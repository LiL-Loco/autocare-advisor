/**
 * Admin Product Moderation Routes - AutoCare Advisor
 *
 * Routes für Produktmoderation durch Admins:
 * - Moderation Queue Verwaltung
 * - Bulk Operations
 * - Quality Control
 * - System Analytics
 */

import { Request, Response, Router } from 'express';
import pool from '../database/postgres';
import { requireAdmin } from '../middleware/adminAuth';
import { authenticateToken } from '../middleware/auth';
import Product from '../models/Product';
import logger from '../utils/logger';

const router = Router();

// Apply authentication and admin check to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Types for TypeScript
interface ModerationItem {
  id: string;
  product_id: string;
  partner_id: string;
  action_type: string;
  status: string;
  priority: string;
  product_data: any;
  changes_summary: string;
  moderator_id?: string;
  moderated_at?: string;
  moderation_notes?: string;
  rejection_reason?: string;
  flags: string[];
  created_at: string;
  updated_at: string;
}

interface AdminStats {
  totalProducts: number;
  pendingModeration: number;
  moderatedToday: number;
  activePartners: number;
  avgModerationTime: number;
  qualityScore: number;
}

/**
 * @route   GET /api/admin/moderation/queue
 * @desc    Get products pending moderation
 * @access  Admin
 */
router.get('/moderation/queue', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = (req.query.status as string) || 'pending';
    const priority = req.query.priority as string;
    const partnerId = req.query.partnerId as string;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        pmq.*,
        u.email as partner_email,
        u.first_name as partner_first_name,
        u.last_name as partner_last_name,
        COUNT(*) OVER() as total_count
      FROM product_moderation_queue pmq
      JOIN users u ON pmq.partner_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND pmq.status = $${paramCount}`;
      params.push(status);
    }

    if (priority) {
      paramCount++;
      query += ` AND pmq.priority = $${paramCount}`;
      params.push(priority);
    }

    if (partnerId) {
      paramCount++;
      query += ` AND pmq.partner_id = $${paramCount}`;
      params.push(partnerId);
    }

    query += ` ORDER BY 
      CASE pmq.priority 
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2  
        WHEN 'normal' THEN 3
        WHEN 'low' THEN 4
      END,
      pmq.created_at ASC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);
    const items = result.rows;

    const totalCount = items.length > 0 ? parseInt(items[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        items: items.map((item) => ({
          id: item.id,
          productId: item.product_id,
          partnerId: item.partner_id,
          partnerName: `${item.partner_first_name} ${item.partner_last_name}`,
          partnerEmail: item.partner_email,
          actionType: item.action_type,
          status: item.status,
          priority: item.priority,
          productData: item.product_data,
          changesSummary: item.changes_summary,
          flags: item.flags || [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          moderatedAt: item.moderated_at,
          moderationNotes: item.moderation_notes,
          rejectionReason: item.rejection_reason,
        })),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error: any) {
    logger.error('Failed to get moderation queue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve moderation queue',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/admin/moderation/approve/:itemId
 * @desc    Approve a moderation item
 * @access  Admin
 */
router.post(
  '/moderation/approve/:itemId',
  async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const { notes } = req.body;
      const moderatorId = req.user?.userId;

      // Get moderation item
      const moderationItem = await pool.query(
        'SELECT * FROM product_moderation_queue WHERE id = $1 AND status = $2',
        [itemId, 'pending']
      );

      if (moderationItem.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Moderation item not found or already processed',
        });
      }

      const item = moderationItem.rows[0];

      // Start transaction
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Apply the product changes based on action type
        if (item.action_type === 'create') {
          // Create new product in MongoDB
          const productData = item.product_data;
          const newProduct = new Product({
            ...productData,
            isActive: true,
            createdBy: moderatorId,
            lastModifiedBy: moderatorId,
          });

          const savedProduct = await newProduct.save();

          // Update moderation queue
          await client.query(
            `
          UPDATE product_moderation_queue 
          SET status = $1, moderator_id = $2, moderated_at = NOW(), 
              moderation_notes = $3, product_id = $4
          WHERE id = $5
        `,
            [
              'approved',
              moderatorId,
              notes || 'Approved by admin',
              savedProduct._id.toString(),
              itemId,
            ]
          );
        } else if (item.action_type === 'update') {
          // Update existing product
          await Product.findByIdAndUpdate(item.product_id, {
            ...item.product_data,
            lastModifiedBy: moderatorId,
            updatedAt: new Date(),
          });

          await client.query(
            `
          UPDATE product_moderation_queue 
          SET status = $1, moderator_id = $2, moderated_at = NOW(), moderation_notes = $3
          WHERE id = $4
        `,
            ['approved', moderatorId, notes || 'Approved by admin', itemId]
          );
        } else if (item.action_type === 'delete') {
          // Delete/deactivate product
          await Product.findByIdAndUpdate(item.product_id, {
            isActive: false,
            lastModifiedBy: moderatorId,
            updatedAt: new Date(),
          });

          await client.query(
            `
          UPDATE product_moderation_queue 
          SET status = $1, moderator_id = $2, moderated_at = NOW(), moderation_notes = $3
          WHERE id = $4
        `,
            [
              'approved',
              moderatorId,
              notes || 'Deletion approved by admin',
              itemId,
            ]
          );
        }

        await client.query('COMMIT');

        res.json({
          success: true,
          message: 'Moderation item approved successfully',
          data: { itemId, status: 'approved' },
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error: any) {
      logger.error('Failed to approve moderation item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to approve moderation item',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/admin/moderation/reject/:itemId
 * @desc    Reject a moderation item
 * @access  Admin
 */
router.post(
  '/moderation/reject/:itemId',
  async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const { reason, notes } = req.body;
      const moderatorId = req.user?.userId;

      if (!reason) {
        return res.status(400).json({
          success: false,
          error: 'Rejection reason is required',
        });
      }

      const result = await pool.query(
        `
      UPDATE product_moderation_queue 
      SET status = $1, moderator_id = $2, moderated_at = NOW(), 
          rejection_reason = $3, moderation_notes = $4
      WHERE id = $5 AND status = 'pending'
      RETURNING id
    `,
        ['rejected', moderatorId, reason, notes || '', itemId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Moderation item not found or already processed',
        });
      }

      res.json({
        success: true,
        message: 'Moderation item rejected successfully',
        data: { itemId, status: 'rejected', reason },
      });
    } catch (error: any) {
      logger.error('Failed to reject moderation item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject moderation item',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/admin/moderation/bulk-approve
 * @desc    Bulk approve multiple moderation items
 * @access  Admin
 */
router.post('/moderation/bulk-approve', async (req: Request, res: Response) => {
  try {
    const { itemIds, notes } = req.body;
    const moderatorId = req.user?.userId;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Item IDs array is required',
      });
    }

    if (itemIds.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Cannot process more than 50 items at once',
      });
    }

    const client = await pool.connect();
    const results: any[] = [];

    try {
      await client.query('BEGIN');

      for (const itemId of itemIds) {
        try {
          // Get moderation item
          const moderationItem = await client.query(
            'SELECT * FROM product_moderation_queue WHERE id = $1 AND status = $2',
            [itemId, 'pending']
          );

          if (moderationItem.rows.length === 0) {
            results.push({
              itemId,
              status: 'error',
              message: 'Item not found or already processed',
            });
            continue;
          }

          const item = moderationItem.rows[0];

          // Process based on action type
          if (item.action_type === 'create') {
            const productData = item.product_data;
            const newProduct = new Product({
              ...productData,
              isActive: true,
              createdBy: moderatorId,
              lastModifiedBy: moderatorId,
            });

            const savedProduct = await newProduct.save();

            await client.query(
              `
              UPDATE product_moderation_queue 
              SET status = $1, moderator_id = $2, moderated_at = NOW(), 
                  moderation_notes = $3, product_id = $4
              WHERE id = $5
            `,
              [
                'approved',
                moderatorId,
                notes || 'Bulk approved by admin',
                savedProduct._id.toString(),
                itemId,
              ]
            );

            results.push({
              itemId,
              status: 'approved',
              productId: savedProduct._id.toString(),
            });
          } else if (item.action_type === 'update') {
            await Product.findByIdAndUpdate(item.product_id, {
              ...item.product_data,
              lastModifiedBy: moderatorId,
              updatedAt: new Date(),
            });

            await client.query(
              `
              UPDATE product_moderation_queue 
              SET status = $1, moderator_id = $2, moderated_at = NOW(), moderation_notes = $3
              WHERE id = $4
            `,
              [
                'approved',
                moderatorId,
                notes || 'Bulk approved by admin',
                itemId,
              ]
            );

            results.push({
              itemId,
              status: 'approved',
              productId: item.product_id,
            });
          }
        } catch (error: any) {
          results.push({ itemId, status: 'error', message: error.message });
        }
      }

      await client.query('COMMIT');

      const approved = results.filter((r) => r.status === 'approved').length;
      const errors = results.filter((r) => r.status === 'error').length;

      res.json({
        success: true,
        message: `Bulk operation completed: ${approved} approved, ${errors} errors`,
        data: { results, approved, errors },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    logger.error('Failed to bulk approve moderation items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk approve moderation items',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/admin/stats/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Admin
 */
router.get('/stats/dashboard', async (req: Request, res: Response) => {
  try {
    // Get basic counts
    const [moderationStats, partnerStats, productStats, recentActivity] =
      await Promise.all([
        // Moderation queue stats
        pool.query(`
        SELECT 
          status,
          priority,
          COUNT(*) as count
        FROM product_moderation_queue 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY status, priority
      `),

        // Partner stats
        pool.query(`
        SELECT 
          role,
          is_active,
          COUNT(*) as count
        FROM users 
        WHERE role IN ('partner', 'customer')
        GROUP BY role, is_active
      `),

        // Product stats from MongoDB (simplified for now)
        Product.aggregate([
          {
            $group: {
              _id: '$isActive',
              count: { $sum: 1 },
            },
          },
        ]),

        // Recent moderation activity
        pool.query(`
        SELECT 
          DATE(moderated_at) as date,
          status,
          COUNT(*) as count
        FROM product_moderation_queue
        WHERE moderated_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(moderated_at), status
        ORDER BY date DESC
      `),
      ]);

    // Process moderation stats
    const moderation = {
      pending: 0,
      approved: 0,
      rejected: 0,
      processing: 0,
    };

    moderationStats.rows.forEach((row) => {
      moderation[row.status as keyof typeof moderation] = parseInt(row.count);
    });

    // Process partner stats
    const partners = {
      active: 0,
      inactive: 0,
      total: 0,
    };

    partnerStats.rows.forEach((row) => {
      if (row.role === 'partner') {
        if (row.is_active) {
          partners.active = parseInt(row.count);
        } else {
          partners.inactive = parseInt(row.count);
        }
      }
    });
    partners.total = partners.active + partners.inactive;

    // Process product stats
    const products = {
      active: 0,
      inactive: 0,
      total: 0,
    };

    productStats.forEach((item: any) => {
      if (item._id) {
        products.active = item.count;
      } else {
        products.inactive = item.count;
      }
    });
    products.total = products.active + products.inactive;

    res.json({
      success: true,
      data: {
        moderation,
        partners,
        products,
        recentActivity: recentActivity.rows,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    logger.error('Failed to get admin dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve admin dashboard statistics',
      message: error.message,
    });
  }
});

export default router;

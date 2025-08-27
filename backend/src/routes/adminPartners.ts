import express from 'express';
import { initializeDatabase } from '../database/mongodb';
import pool from '../database/postgres';
import { requireAdmin } from '../middleware/adminAuth';
import Product from '../models/Product';
import logger from '../utils/logger';

const router = express.Router();

// Get All Partners
router.get('/', requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = "WHERE role = 'partner'";
    const queryParams = [];
    let paramCounter = 1;

    // Add search filter
    if (search) {
      whereClause += ` AND (first_name ILIKE $${paramCounter} OR last_name ILIKE $${paramCounter} OR email ILIKE $${paramCounter} OR company ILIKE $${paramCounter})`;
      queryParams.push(`%${search}%`);
      paramCounter++;
    }

    // Add status filter
    if (status && status !== 'all') {
      whereClause += ` AND is_active = $${paramCounter}`;
      queryParams.push(status === 'active');
      paramCounter++;
    }

    // Validate sort column
    const validSortColumns = [
      'name',
      'email',
      'company',
      'created_at',
      'last_login',
    ];
    const sortColumn = validSortColumns.includes(sortBy as string)
      ? sortBy
      : 'created_at';
    const sortDirection = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Get partners with pagination
    const partnersQuery = `
      SELECT 
        id,
        COALESCE(first_name || ' ' || last_name, first_name, last_name, email) as name,
        email,
        first_name,
        last_name,
        company,
        CASE 
            WHEN is_active THEN 'active'
            ELSE 'inactive'
        END as status,
        created_at,
        last_login,
        COALESCE((
          SELECT SUM(amount) 
          FROM orders 
          WHERE user_id = users.id
        ), 0) as total_revenue,
        COALESCE((
          SELECT COUNT(*) 
          FROM orders 
          WHERE user_id = users.id
        ), 0) as total_orders
      FROM users 
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    queryParams.push(parseInt(limit as string), offset);
    const partnersResult = await pool.query(partnersQuery, queryParams);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const totalPartners = parseInt(countResult.rows[0].count);

    // Get product counts for each partner
    await initializeDatabase();
    const partnersWithProducts = await Promise.all(
      partnersResult.rows.map(async (partner) => {
        const productCount = await Product.countDocuments({
          partnerId: partner.id.toString(),
        });

        return {
          ...partner,
          total_revenue: parseFloat(partner.total_revenue),
          total_orders: parseInt(partner.total_orders),
          product_count: productCount,
          created_at: partner.created_at,
          last_login: partner.last_login,
        };
      })
    );

    logger.info(
      `👥 Retrieved ${partnersResult.rows.length} partners (page ${page})`
    );

    res.json({
      success: true,
      data: {
        partners: partnersWithProducts,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(totalPartners / parseInt(limit as string)),
          totalItems: totalPartners,
          itemsPerPage: parseInt(limit as string),
          hasNextPage: offset + partnersResult.rows.length < totalPartners,
          hasPrevPage: parseInt(page as string) > 1,
        },
      },
    });
  } catch (error) {
    logger.error('❌ Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partners',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Get Partner Statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // Overall partner statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_partners,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_partners,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_partners,
        0 as pending_partners,
        COALESCE(SUM((
          SELECT SUM(amount) 
          FROM orders 
          WHERE user_id = users.id
        )), 0) as total_revenue,
        COALESCE(AVG((
          SELECT SUM(amount) 
          FROM orders 
          WHERE user_id = users.id
        )), 0) as avg_revenue_per_partner
      FROM users 
      WHERE role = 'partner'
    `;

    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];

    // Monthly growth statistics
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const thisMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const growthQuery = `
      SELECT 
        COUNT(CASE WHEN created_at >= $1 AND created_at < $2 THEN 1 END) as last_month_partners,
        COUNT(CASE WHEN created_at >= $2 THEN 1 END) as this_month_partners
      FROM users 
      WHERE role = 'partner'
    `;

    const growthResult = await pool.query(growthQuery, [lastMonth, thisMonth]);
    const growth = growthResult.rows[0];

    // Product statistics
    await initializeDatabase();
    const totalProducts = await Product.countDocuments();
    const productsPerPartner =
      stats.total_partners > 0
        ? totalProducts / parseInt(stats.total_partners)
        : 0;

    const statistics = {
      totalPartners: parseInt(stats.total_partners),
      activePartners: parseInt(stats.active_partners),
      pendingPartners: parseInt(stats.pending_partners),
      inactivePartners: parseInt(stats.inactive_partners),
      totalRevenue: parseFloat(stats.total_revenue),
      avgRevenuePerPartner: parseFloat(stats.avg_revenue_per_partner),
      totalProducts,
      avgProductsPerPartner: Math.round(productsPerPartner * 10) / 10,
      growth: {
        lastMonth: parseInt(growth.last_month_partners),
        thisMonth: parseInt(growth.this_month_partners),
        growthRate:
          growth.last_month_partners > 0
            ? ((growth.this_month_partners - growth.last_month_partners) /
                growth.last_month_partners) *
              100
            : 0,
      },
    };

    logger.info('📊 Partner statistics retrieved');

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    logger.error('❌ Error fetching partner statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner statistics',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Get Single Partner Details
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get partner details
    const partnerQuery = `
      SELECT 
        id,
        COALESCE(first_name || ' ' || last_name, first_name, last_name, email) as name,
        email,
        first_name,
        last_name,
        company,
        CASE 
            WHEN is_active THEN 'active'
            ELSE 'inactive'
        END as status,
        phone,
        address,
        created_at,
        last_login
      FROM users 
      WHERE id = $1 AND role = 'partner'
    `;

    const partnerResult = await pool.query(partnerQuery, [id]);

    if (partnerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    const partner = partnerResult.rows[0];

    // Get partner's orders
    const ordersQuery = `
      SELECT 
        id,
        amount,
        status,
        created_at,
        order_items
      FROM orders 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const ordersResult = await pool.query(ordersQuery, [id]);

    // Get partner's products
    await initializeDatabase();
    const products = await Product.find({ partnerId: id.toString() })
      .select('name brand category price clickCount createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate performance metrics
    const totalRevenue = ordersResult.rows.reduce(
      (sum, order) => sum + parseFloat(order.amount),
      0
    );
    const avgOrderValue =
      ordersResult.rows.length > 0
        ? totalRevenue / ordersResult.rows.length
        : 0;
    const totalClicks = products.reduce(
      (sum, product) => sum + (product.clickCount || 0),
      0
    );

    const partnerDetails = {
      ...partner,
      metrics: {
        totalRevenue,
        totalOrders: ordersResult.rows.length,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        totalProducts: products.length,
        totalClicks,
      },
      recentOrders: ordersResult.rows.map((order) => ({
        ...order,
        amount: parseFloat(order.amount),
      })),
      recentProducts: products.map((product) => ({
        id: product._id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        clickCount: product.clickCount || 0,
        createdAt: product.createdAt,
      })),
    };

    logger.info(`👤 Retrieved details for partner: ${partner.email}`);

    res.json({
      success: true,
      data: partnerDetails,
    });
  } catch (error) {
    logger.error('❌ Error fetching partner details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner details',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Update Partner Status
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Must be one of: active, inactive, pending, suspended',
      });
    }

    // Update partner status
    const updateQuery = `
      UPDATE users 
      SET is_active = CASE 
                          WHEN $1 = 'active' THEN true 
                          ELSE false 
                      END, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND role = 'partner'
      RETURNING id, 
                COALESCE(first_name || ' ' || last_name, first_name, last_name, email) as name, 
                email, 
                CASE 
                    WHEN is_active THEN 'active' 
                    ELSE 'inactive' 
                END as status
    `;

    const result = await pool.query(updateQuery, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    logger.info(
      `✏️ Updated partner ${result.rows[0].email} status to: ${status}`
    );

    res.json({
      success: true,
      message: 'Partner status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('❌ Error updating partner status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update partner status',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Delete Partner (Soft Delete)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete partner (set status to inactive and add deleted flag)
    const deleteQuery = `
      UPDATE users 
      SET 
        status = 'inactive',
        deleted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND role = 'partner' AND deleted_at IS NULL
      RETURNING id, name, email
    `;

    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found or already deleted',
      });
    }

    // Also soft delete partner's products
    await initializeDatabase();
    await Product.updateMany(
      { partnerId: id.toString() },
      {
        $set: {
          isActive: false,
          deletedAt: new Date(),
        },
      }
    );

    logger.info(`🗑️ Soft deleted partner: ${result.rows[0].email}`);

    res.json({
      success: true,
      message: 'Partner deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('❌ Error deleting partner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete partner',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Partner Activity Analytics
router.get('/:id/analytics', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { timeRange = '30d' } = req.query;

    // Calculate date range
    let daysBack = 30;
    switch (timeRange) {
      case '7d':
        daysBack = 7;
        break;
      case '90d':
        daysBack = 90;
        break;
      case '1y':
        daysBack = 365;
        break;
      default:
        daysBack = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get partner revenue over time
    const revenueQuery = `
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(amount), 0) as daily_revenue,
        COUNT(*) as daily_orders
      FROM orders 
      WHERE user_id = $1 AND created_at >= $2
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const revenueResult = await pool.query(revenueQuery, [id, startDate]);

    // Get product performance
    await initializeDatabase();
    const productPerformance = await Product.find({
      partnerId: id.toString(),
      createdAt: { $gte: startDate },
    })
      .select('name category clickCount price createdAt')
      .sort({ clickCount: -1 });

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { partnerId: id.toString() } },
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          totalClicks: { $sum: '$clickCount' },
        },
      },
      { $sort: { productCount: -1 } },
    ]);

    const analytics = {
      revenue: revenueResult.rows.map((row) => ({
        date: row.date,
        revenue: parseFloat(row.daily_revenue),
        orders: parseInt(row.daily_orders),
      })),
      productPerformance: productPerformance.map((product) => ({
        id: product._id,
        name: product.name,
        category: product.category,
        clicks: product.clickCount || 0,
        price: product.price,
        createdAt: product.createdAt,
      })),
      categoryDistribution: categoryStats.map((stat) => ({
        category: stat._id || 'Unknown',
        productCount: stat.productCount,
        totalClicks: stat.totalClicks,
      })),
      summary: {
        totalRevenue: revenueResult.rows.reduce(
          (sum, row) => sum + parseFloat(row.daily_revenue),
          0
        ),
        totalOrders: revenueResult.rows.reduce(
          (sum, row) => sum + parseInt(row.daily_orders),
          0
        ),
        totalProducts: productPerformance.length,
        totalClicks: productPerformance.reduce(
          (sum, product) => sum + (product.clickCount || 0),
          0
        ),
      },
    };

    logger.info(`📈 Analytics retrieved for partner ${id} (${timeRange})`);

    res.json({
      success: true,
      data: analytics,
      timeRange,
      period: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('❌ Error fetching partner analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partner analytics',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

export default router;

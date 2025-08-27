import express from 'express';
import { initializeDatabase } from '../database/mongodb';
import pool from '../database/postgres';
import { requireAdmin } from '../middleware/adminAuth';
import Product from '../models/Product';
import logger from '../utils/logger';

const router = express.Router();

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: Record<string, any>;
}

interface Report {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'scheduled' | 'completed' | 'error';
  frequency: string;
  lastRun: Date | null;
  nextRun: Date | null;
  recipients: string[];
  createdBy: string;
  createdAt: Date;
  parameters: Record<string, any>;
}

// Get All Reports
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = '';
    const queryParams = [];
    let paramCounter = 1;

    // Build WHERE clause
    const conditions = [];
    if (status && status !== 'all') {
      conditions.push(`status = $${paramCounter}`);
      queryParams.push(status);
      paramCounter++;
    }

    if (type && type !== 'all') {
      conditions.push(`report_type = $${paramCounter}`);
      queryParams.push(type);
      paramCounter++;
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Get reports with pagination
    const reportsQuery = `
      SELECT 
        id,
        name,
        description,
        report_type,
        status,
        frequency,
        last_run,
        next_run,
        recipients,
        created_by,
        created_at,
        parameters
      FROM reports 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    queryParams.push(parseInt(limit as string), offset);
    const reportsResult = await pool.query(reportsQuery, queryParams);

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM reports ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const totalReports = parseInt(countResult.rows[0].count);

    // Format reports
    const reports = reportsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.report_type,
      status: row.status,
      frequency: row.frequency,
      lastRun: row.last_run,
      nextRun: row.next_run,
      recipients:
        typeof row.recipients === 'string'
          ? JSON.parse(row.recipients)
          : row.recipients,
      createdBy: row.created_by,
      createdAt: row.created_at,
      parameters:
        typeof row.parameters === 'string'
          ? JSON.parse(row.parameters)
          : row.parameters,
    }));

    logger.info(`📊 Retrieved ${reports.length} reports (page ${page})`);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(totalReports / parseInt(limit as string)),
          totalItems: totalReports,
          itemsPerPage: parseInt(limit as string),
        },
      },
    });
  } catch (error) {
    logger.error('❌ Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Get Report Templates
router.get('/templates', requireAdmin, async (req, res) => {
  try {
    const templates: ReportTemplate[] = [
      {
        id: 'revenue',
        name: 'Revenue Report',
        description:
          'Comprehensive revenue analysis with trends and breakdowns',
        type: 'financial',
        parameters: {
          dateRange: {
            type: 'select',
            options: ['7d', '30d', '90d', '1y'],
            default: '30d',
          },
          groupBy: {
            type: 'select',
            options: ['day', 'week', 'month'],
            default: 'day',
          },
          includePartners: { type: 'boolean', default: true },
          includeCategories: { type: 'boolean', default: true },
        },
      },
      {
        id: 'users',
        name: 'User Analytics Report',
        description: 'User behavior, acquisition, and engagement metrics',
        type: 'analytics',
        parameters: {
          dateRange: {
            type: 'select',
            options: ['7d', '30d', '90d', '1y'],
            default: '30d',
          },
          userSegment: {
            type: 'select',
            options: ['all', 'new', 'returning', 'premium'],
            default: 'all',
          },
          includeGeography: { type: 'boolean', default: false },
          includeDeviceInfo: { type: 'boolean', default: false },
        },
      },
      {
        id: 'products',
        name: 'Product Performance Report',
        description: 'Product sales, trends, and inventory analytics',
        type: 'inventory',
        parameters: {
          dateRange: {
            type: 'select',
            options: ['7d', '30d', '90d', '1y'],
            default: '30d',
          },
          category: {
            type: 'select',
            options: ['all', 'autowachs', 'reiniger', 'politur'],
            default: 'all',
          },
          minSales: { type: 'number', default: 0 },
          includeInventory: { type: 'boolean', default: true },
        },
      },
      {
        id: 'partners',
        name: 'Partner Performance Report',
        description:
          'Partner activity, commissions, and relationship analytics',
        type: 'partners',
        parameters: {
          dateRange: {
            type: 'select',
            options: ['7d', '30d', '90d', '1y'],
            default: '30d',
          },
          partnerStatus: {
            type: 'select',
            options: ['all', 'active', 'inactive', 'pending'],
            default: 'all',
          },
          minRevenue: { type: 'number', default: 0 },
          includeCommissions: { type: 'boolean', default: true },
        },
      },
    ];

    logger.info('📋 Retrieved report templates');

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    logger.error('❌ Error fetching report templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report templates',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Create New Report
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      templateId,
      frequency = 'once',
      recipients = [],
      parameters = {},
    } = req.body;

    // Validate required fields
    if (!name || !templateId) {
      return res.status(400).json({
        success: false,
        message: 'Name and template ID are required',
      });
    }

    // Get admin user info (in real app, this would come from JWT token)
    const adminEmail = 'admin@autocare.com';

    // Calculate next run date for scheduled reports
    let nextRun = null;
    if (frequency !== 'once') {
      nextRun = new Date();
      switch (frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
      }
    }

    // Insert report into database
    const insertQuery = `
      INSERT INTO reports (
        name, 
        description, 
        report_type, 
        status, 
        frequency, 
        next_run, 
        recipients, 
        created_by, 
        parameters
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      name,
      description,
      templateId,
      frequency === 'once' ? 'draft' : 'scheduled',
      frequency,
      nextRun,
      JSON.stringify(recipients),
      adminEmail,
      JSON.stringify(parameters),
    ];

    const result = await pool.query(insertQuery, values);
    const newReport = result.rows[0];

    logger.info(`📊 Created new report: ${name} (${templateId})`);

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: {
        id: newReport.id,
        name: newReport.name,
        description: newReport.description,
        type: newReport.report_type,
        status: newReport.status,
        frequency: newReport.frequency,
        nextRun: newReport.next_run,
        recipients: JSON.parse(newReport.recipients),
        createdBy: newReport.created_by,
        createdAt: newReport.created_at,
        parameters: JSON.parse(newReport.parameters),
      },
    });
  } catch (error) {
    logger.error('❌ Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Generate Report Data
router.post('/:id/generate', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get report details
    const reportQuery = `
      SELECT * FROM reports WHERE id = $1
    `;
    const reportResult = await pool.query(reportQuery, [id]);

    if (reportResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const report = reportResult.rows[0];
    const parameters =
      typeof report.parameters === 'string'
        ? JSON.parse(report.parameters)
        : report.parameters;

    let reportData: any = {};

    // Generate data based on report type
    switch (report.report_type) {
      case 'revenue':
        reportData = await generateRevenueReport(parameters);
        break;
      case 'users':
        reportData = await generateUsersReport(parameters);
        break;
      case 'products':
        reportData = await generateProductsReport(parameters);
        break;
      case 'partners':
        reportData = await generatePartnersReport(parameters);
        break;
      default:
        throw new Error('Unknown report type');
    }

    // Update report status and last run time
    const updateQuery = `
      UPDATE reports 
      SET status = 'completed', last_run = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(updateQuery, [id]);

    logger.info(`📈 Generated report data for: ${report.name}`);

    res.json({
      success: true,
      message: 'Report generated successfully',
      data: {
        reportId: id,
        reportName: report.name,
        generatedAt: new Date().toISOString(),
        data: reportData,
      },
    });
  } catch (error) {
    // Update report status to error
    const updateQuery = `
      UPDATE reports 
      SET status = 'error', last_run = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(updateQuery, [req.params.id]);

    logger.error('❌ Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Delete Report
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `
      DELETE FROM reports WHERE id = $1 RETURNING name
    `;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    logger.info(`🗑️ Deleted report: ${result.rows[0].name}`);

    res.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    logger.error('❌ Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    });
  }
});

// Helper functions for generating different report types
async function generateRevenueReport(parameters: any) {
  const {
    dateRange = '30d',
    groupBy = 'day',
    includePartners = true,
    includeCategories = true,
  } = parameters;

  let daysBack = 30;
  switch (dateRange) {
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

  // Revenue over time
  const revenueQuery = `
    SELECT 
      DATE(created_at) as date,
      SUM(amount) as revenue,
      COUNT(*) as orders
    FROM orders 
    WHERE created_at >= $1
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
  const revenueResult = await pool.query(revenueQuery, [startDate]);

  const data: any = {
    overview: {
      totalRevenue: revenueResult.rows.reduce(
        (sum, row) => sum + parseFloat(row.revenue),
        0
      ),
      totalOrders: revenueResult.rows.reduce(
        (sum, row) => sum + parseInt(row.orders),
        0
      ),
      period: dateRange,
    },
    timeline: revenueResult.rows.map((row) => ({
      date: row.date,
      revenue: parseFloat(row.revenue),
      orders: parseInt(row.orders),
    })),
  };

  if (includePartners) {
    const partnersQuery = `
      SELECT 
        u.name as partner_name,
        u.email,
        SUM(o.amount) as revenue,
        COUNT(o.id) as orders
      FROM users u
      JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'partner' AND o.created_at >= $1
      GROUP BY u.id, u.name, u.email
      ORDER BY revenue DESC
      LIMIT 10
    `;
    const partnersResult = await pool.query(partnersQuery, [startDate]);
    data.topPartners = partnersResult.rows.map((row) => ({
      name: row.partner_name,
      email: row.email,
      revenue: parseFloat(row.revenue),
      orders: parseInt(row.orders),
    }));
  }

  if (includeCategories) {
    await initializeDatabase();
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { productCount: -1 } },
    ]);
    data.categories = categoryStats.map((stat) => ({
      category: stat._id || 'Unknown',
      productCount: stat.productCount,
      avgPrice: Math.round(stat.avgPrice * 100) / 100,
    }));
  }

  return data;
}

async function generateUsersReport(parameters: any) {
  const { dateRange = '30d', userSegment = 'all' } = parameters;

  let daysBack = 30;
  switch (dateRange) {
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

  let whereClause = '';
  if (userSegment !== 'all') {
    if (userSegment === 'new') {
      whereClause = `AND created_at >= '${startDate.toISOString()}'`;
    } else if (userSegment === 'returning') {
      whereClause = `AND created_at < '${startDate.toISOString()}'`;
    }
  }

  const userQuery = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as new_users,
      COUNT(CASE WHEN role = 'partner' THEN 1 END) as new_partners
    FROM users 
    WHERE created_at >= $1 ${whereClause}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  const userResult = await pool.query(userQuery, [startDate]);

  return {
    overview: {
      totalUsers: userResult.rows.reduce(
        (sum, row) => sum + parseInt(row.new_users),
        0
      ),
      totalPartners: userResult.rows.reduce(
        (sum, row) => sum + parseInt(row.new_partners),
        0
      ),
      period: dateRange,
      segment: userSegment,
    },
    timeline: userResult.rows.map((row) => ({
      date: row.date,
      newUsers: parseInt(row.new_users),
      newPartners: parseInt(row.new_partners),
    })),
  };
}

async function generateProductsReport(parameters: any) {
  const { dateRange = '30d', category = 'all', minSales = 0 } = parameters;

  let daysBack = 30;
  switch (dateRange) {
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

  await initializeDatabase();

  let matchStage: any = {
    createdAt: { $gte: startDate },
  };

  if (category !== 'all') {
    matchStage.category = category;
  }

  const productStats = await Product.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        productCount: { $sum: 1 },
        totalClicks: { $sum: '$clickCount' },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { productCount: -1 } },
  ]);

  const topProducts = await Product.find(matchStage)
    .sort({ clickCount: -1 })
    .limit(10)
    .select('name brand category clickCount price');

  return {
    overview: {
      totalProducts: await Product.countDocuments(matchStage),
      period: dateRange,
      category: category,
    },
    categories: productStats.map((stat) => ({
      category: stat._id || 'Unknown',
      productCount: stat.productCount,
      totalClicks: stat.totalClicks,
      avgPrice: Math.round(stat.avgPrice * 100) / 100,
    })),
    topProducts: topProducts.map((product) => ({
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      clicks: product.clickCount || 0,
      price: product.price,
    })),
  };
}

async function generatePartnersReport(parameters: any) {
  const {
    dateRange = '30d',
    partnerStatus = 'all',
    minRevenue = 0,
  } = parameters;

  let daysBack = 30;
  switch (dateRange) {
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

  let whereClause = "WHERE u.role = 'partner'";
  if (partnerStatus !== 'all') {
    whereClause += ` AND u.status = '${partnerStatus}'`;
  }

  const partnersQuery = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.company,
      u.status,
      COALESCE(SUM(o.amount), 0) as revenue,
      COUNT(o.id) as orders,
      u.created_at
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id AND o.created_at >= $1
    ${whereClause}
    GROUP BY u.id, u.name, u.email, u.company, u.status, u.created_at
    HAVING COALESCE(SUM(o.amount), 0) >= $2
    ORDER BY revenue DESC
  `;

  const partnersResult = await pool.query(partnersQuery, [
    startDate,
    minRevenue,
  ]);

  return {
    overview: {
      totalPartners: partnersResult.rows.length,
      period: dateRange,
      status: partnerStatus,
      minRevenue: minRevenue,
    },
    partners: partnersResult.rows.map((partner) => ({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      company: partner.company,
      status: partner.status,
      revenue: parseFloat(partner.revenue),
      orders: parseInt(partner.orders),
      joinDate: partner.created_at,
    })),
  };
}

export default router;

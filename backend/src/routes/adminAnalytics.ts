import express from 'express';
import { requireAdmin } from '../middleware/adminAuth';
import logger from '../utils/logger';
import pool from '../database/postgres';
import { initializeDatabase } from '../database/mongodb';
import Product from '../models/Product';

const router = express.Router();

// Analytics Overview Endpoint
router.get('/overview', requireAdmin, async (req, res) => {
  try {
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

    // Get revenue data from PostgreSQL
    const revenueQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) as total_revenue,
        COUNT(*) as total_orders,
        COALESCE(AVG(amount), 0) as avg_order_value,
        DATE(created_at) as order_date
      FROM orders 
      WHERE created_at >= $1
      GROUP BY DATE(created_at)
      ORDER BY order_date DESC
    `;

    const revenueResult = await pool.query(revenueQuery, [startDate]);
    
    // Get user statistics
    const userQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= $1 THEN 1 END) as new_users,
        COUNT(CASE WHEN role = 'partner' THEN 1 END) as total_partners
      FROM users
    `;

    const userResult = await pool.query(userQuery, [startDate]);

    // Get product statistics from MongoDB
    await initializeDatabase();
    const totalProducts = await Product.countDocuments();
    const recentProducts = await Product.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Calculate growth percentages (mock calculation for demo)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - daysBack);

    const previousRevenueResult = await pool.query(revenueQuery, [previousPeriodStart]);
    const previousUserResult = await pool.query(userQuery, [previousPeriodStart]);

    const currentRevenue = revenueResult.rows.reduce((sum, row) => sum + parseFloat(row.total_revenue), 0);
    const currentOrders = revenueResult.rows.reduce((sum, row) => sum + parseInt(row.total_orders), 0);
    const currentUsers = userResult.rows[0]?.total_users || 0;
    const currentAOV = currentOrders > 0 ? currentRevenue / currentOrders : 0;

    // Mock previous period data for growth calculation
    const previousRevenue = currentRevenue * 0.85; // Simulate 15% growth
    const previousOrders = currentOrders * 0.87; // Simulate 13% growth
    const previousUsers = parseInt(currentUsers) * 0.92; // Simulate 8% growth
    const previousAOV = currentAOV * 0.98; // Simulate -2% change

    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const orderGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0;
    const userGrowth = previousUsers > 0 ? ((currentUsers - previousUsers) / previousUsers) * 100 : 0;
    const aovGrowth = previousAOV > 0 ? ((currentAOV - previousAOV) / previousAOV) * 100 : 0;

    const overview = {
      totalRevenue: currentRevenue,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      totalUsers: parseInt(currentUsers),
      userGrowth: Math.round(userGrowth * 10) / 10,
      totalOrders: currentOrders,
      orderGrowth: Math.round(orderGrowth * 10) / 10,
      avgOrderValue: Math.round(currentAOV * 100) / 100,
      aovGrowth: Math.round(aovGrowth * 10) / 10,
      totalProducts,
      newProducts: recentProducts,
      totalPartners: userResult.rows[0]?.total_partners || 0
    };

    logger.info(`📊 Analytics overview requested for ${timeRange} period`);

    res.json({
      success: true,
      data: overview,
      timeRange,
      period: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days: daysBack
      }
    });

  } catch (error) {
    logger.error('❌ Error fetching analytics overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics overview',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Chart Data Endpoint
router.get('/charts', requireAdmin, async (req, res) => {
  try {
    const { timeRange = '30d', type } = req.query;
    
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

    let chartData: any = {};

    if (!type || type === 'revenue') {
      // Revenue chart data
      const revenueQuery = `
        SELECT 
          DATE(created_at) as date,
          COALESCE(SUM(amount), 0) as revenue,
          COUNT(*) as orders
        FROM orders 
        WHERE created_at >= $1
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      const revenueResult = await pool.query(revenueQuery, [startDate]);
      chartData.revenue = revenueResult.rows.map(row => ({
        date: row.date,
        amount: parseFloat(row.revenue),
        orders: parseInt(row.orders)
      }));
    }

    if (!type || type === 'users') {
      // User registration chart data
      const userQuery = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_users,
          COUNT(CASE WHEN role = 'partner' THEN 1 END) as new_partners
        FROM users 
        WHERE created_at >= $1
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      const userResult = await pool.query(userQuery, [startDate]);
      chartData.users = userResult.rows.map(row => ({
        date: row.date,
        newUsers: parseInt(row.new_users),
        newPartners: parseInt(row.new_partners)
      }));
    }

    if (!type || type === 'products') {
      // Product category distribution
      await initializeDatabase();
      const categoryStats = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      chartData.products = categoryStats.map(stat => ({
        category: stat._id || 'Unknown',
        count: stat.count,
        avgPrice: Math.round(stat.avgPrice * 100) / 100
      }));
    }

    if (!type || type === 'partners') {
      // Partner performance data
      const partnerQuery = `
        SELECT 
          u.name as partner_name,
          u.email,
          COALESCE(SUM(o.amount), 0) as total_revenue,
          COUNT(o.id) as total_orders
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'partner'
        GROUP BY u.id, u.name, u.email
        ORDER BY total_revenue DESC
        LIMIT 10
      `;

      const partnerResult = await pool.query(partnerQuery);
      chartData.partners = partnerResult.rows.map(row => ({
        name: row.partner_name,
        email: row.email,
        revenue: parseFloat(row.total_revenue),
        orders: parseInt(row.total_orders)
      }));
    }

    logger.info(`📈 Chart data requested for type: ${type || 'all'}, period: ${timeRange}`);

    res.json({
      success: true,
      data: chartData,
      timeRange,
      type: type || 'all'
    });

  } catch (error) {
    logger.error('❌ Error fetching chart data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Performance Metrics Endpoint
router.get('/performance', requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Top products by sales
    await initializeDatabase();
    const topProducts = await Product.find()
      .sort({ clickCount: -1 })
      .limit(parseInt(limit as string))
      .select('name brand clickCount price category');

    // Top partners by revenue
    const topPartnersQuery = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.company,
        COALESCE(SUM(o.amount), 0) as revenue,
        COUNT(o.id) as orders,
        u.created_at
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'partner'
      GROUP BY u.id, u.name, u.email, u.company, u.created_at
      ORDER BY revenue DESC
      LIMIT $1
    `;

    const topPartnersResult = await pool.query(topPartnersQuery, [limit]);

    // Category performance
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          totalClicks: { $sum: '$clickCount' },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $addFields: {
          marketShare: { $divide: ['$productCount', { $sum: '$productCount' }] }
        }
      },
      {
        $sort: { totalClicks: -1 }
      }
    ]);

    const performance = {
      topProducts: topProducts.map(product => ({
        id: product._id,
        name: product.name,
        brand: product.brand,
        clicks: product.clickCount || 0,
        price: product.price,
        category: product.category
      })),
      topPartners: topPartnersResult.rows.map(partner => ({
        id: partner.id,
        name: partner.name,
        email: partner.email,
        company: partner.company,
        revenue: parseFloat(partner.revenue),
        orders: parseInt(partner.orders),
        joinDate: partner.created_at
      })),
      categories: categoryStats.map(category => ({
        name: category._id || 'Unknown',
        productCount: category.productCount,
        totalClicks: category.totalClicks,
        avgPrice: Math.round(category.avgPrice * 100) / 100,
        marketShare: Math.round(category.marketShare * 100)
      }))
    };

    logger.info(`🎯 Performance metrics requested with limit: ${limit}`);

    res.json({
      success: true,
      data: performance,
      limit: parseInt(limit as string)
    });

  } catch (error) {
    logger.error('❌ Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Real-time Analytics Endpoint
router.get('/realtime', requireAdmin, async (req, res) => {
  try {
    // Active sessions (mock data - would be from Redis in real implementation)
    const activeUsers = Math.floor(Math.random() * 200) + 50;
    
    // Recent orders
    const recentOrdersQuery = `
      SELECT 
        o.id,
        o.amount,
        o.created_at,
        u.name as user_name,
        u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `;

    const recentOrdersResult = await pool.query(recentOrdersQuery);

    // Current processing orders
    const processingOrdersQuery = `
      SELECT COUNT(*) as count
      FROM orders 
      WHERE status IN ('processing', 'pending')
    `;

    const processingResult = await pool.query(processingOrdersQuery);

    // Recent activity feed
    const recentActivity = [
      {
        type: 'order',
        description: `Neue Bestellung über €${(Math.random() * 200 + 50).toFixed(2)}`,
        timestamp: new Date().toISOString(),
        value: Math.random() * 200 + 50
      },
      {
        type: 'partner',
        description: 'Neuer Partner registriert: AutoDetailing München',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        type: 'product',
        description: 'Neues Produkt hinzugefügt: Premium Carnauba Wachs',
        timestamp: new Date(Date.now() - 600000).toISOString()
      }
    ];

    const realtimeData = {
      activeUsers,
      currentOrders: processingResult.rows[0]?.count || 0,
      recentOrders: recentOrdersResult.rows.map(order => ({
        id: order.id,
        amount: parseFloat(order.amount),
        customerName: order.user_name,
        customerEmail: order.email,
        timestamp: order.created_at
      })),
      recentActivity
    };

    logger.info('⚡ Real-time analytics data requested');

    res.json({
      success: true,
      data: realtimeData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error fetching real-time analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time analytics',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

export default router;
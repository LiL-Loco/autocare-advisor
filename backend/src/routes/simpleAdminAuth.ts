import bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

const router = Router();

// Simple Admin Login for Development/Testing
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Admin login attempt:', email);

    // Load admin user from file (fallback)
    let adminUser = null;

    try {
      const adminFilePath = path.join(
        process.cwd(),
        'backend',
        'admin-user.json'
      );
      if (fs.existsSync(adminFilePath)) {
        const adminData = fs.readFileSync(adminFilePath, 'utf8');
        adminUser = JSON.parse(adminData);
      }
    } catch (err) {
      console.log('No admin file found, using hardcoded admin');
    }

    // Hardcoded fallback admin (for immediate testing)
    if (!adminUser) {
      adminUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@autocare.de',
        password_hash:
          '$2a$12$C7OMyWo4Auweo/syDyBQXOi.rOGJ6hh9.GCRnrKXW3U.lrMHpluO2', // admin123!
        role: 'admin',
        first_name: 'System',
        last_name: 'Administrator',
        is_active: true,
      };
    }

    // Validate email
    if (email !== adminUser.email) {
      console.log('❌ Invalid email:', email);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(
      password,
      adminUser.password_hash
    );
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        userType: 'admin',
      },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        type: 'refresh',
      },
      process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      { expiresIn: '7d' }
    );

    console.log('✅ Admin login successful:', email);

    res.json({
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        firstName: adminUser.first_name,
        lastName: adminUser.last_name,
        userType: 'admin',
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('💥 Admin login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login',
    });
  }
});

// Admin Dashboard Stats (Simple Mock for Testing)
router.get('/stats/dashboard', async (req: Request, res: Response) => {
  try {
    // Mock dashboard statistics
    const mockStats = {
      overview: {
        totalPartners: 12,
        totalProducts: 245,
        pendingModeration: 8,
        monthlyRevenue: 12450.5,
        averageApprovalTime: 3.2,
      },
      moderation: {
        pending: 8,
        approved: 15,
        rejected: 2,
        processing: 3,
      },
      partners: {
        activePartners: 12,
        newThisMonth: 3,
        topPartnersByProducts: [
          {
            id: '1',
            name: 'Chemical Guys',
            email: 'info@chemicalguys.de',
            productCount: 45,
          },
          {
            id: '2',
            name: 'Meguiars',
            email: 'info@meguiars.de',
            productCount: 38,
          },
          { id: '3', name: 'Sonax', email: 'info@sonax.de', productCount: 32 },
        ],
      },
      products: {
        totalProducts: 245,
        newThisMonth: 18,
        topCategories: [
          { name: 'Polituren & Wachse', count: 89, percentage: 36.3 },
          { name: 'Lackreinigung', count: 67, percentage: 27.3 },
          { name: 'Innenraumpflege', count: 45, percentage: 18.4 },
          { name: 'Felgenpflege', count: 32, percentage: 13.1 },
          { name: 'Zubehör', count: 12, percentage: 4.9 },
        ],
      },
      activity: {
        recentApprovals: [
          {
            id: '1',
            productName: 'Chemical Guys V7 Spray Detailer',
            partnerName: 'Chemical Guys',
            approvedAt: new Date().toISOString(),
          },
          {
            id: '2',
            productName: 'Sonax Xtreme Polish & Wax',
            partnerName: 'Sonax',
            approvedAt: new Date().toISOString(),
          },
        ],
        recentRejections: [
          {
            id: '3',
            productName: 'Generic Car Wax',
            partnerName: 'Unknown Brand',
            reason: 'Insufficient product information',
            rejectedAt: new Date().toISOString(),
          },
        ],
      },
    };

    res.json({
      success: true,
      data: mockStats,
    });
  } catch (error) {
    console.error('💥 Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
    });
  }
});

export default router;

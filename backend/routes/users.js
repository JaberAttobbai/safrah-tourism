const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -passwordResetToken -emailVerificationToken')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('bookingHistory.booking', 'bookingId status dates pricing'),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching users'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -passwordResetToken -emailVerificationToken')
      .populate('bookingHistory.booking')
      .populate('wishlist');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user'
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'city', 
      'dateOfBirth', 'gender', 'role', 'isActive', 'isEmailVerified',
      'preferences', 'loyaltyPoints'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password -passwordResetToken -emailVerificationToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating user',
      details: error.message
    });
  }
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete admin users'
      });
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting user'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private (Admin)
router.get('/:id/stats', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('bookingHistory.booking');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const bookings = user.bookingHistory.map(bh => bh.booking);
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalSpent = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.pricing.totalAmount, 0);

    const stats = {
      totalBookings,
      completedBookings,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      totalSpent,
      loyaltyPoints: user.loyaltyPoints,
      wishlistItems: user.wishlist.length,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin,
      isEmailVerified: user.isEmailVerified
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user statistics'
    });
  }
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private (Admin)
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      usersByRole
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ])
    ]);

    const recentUsers = await User.find()
      .select('firstName lastName email createdAt role isActive')
      .sort({ createdAt: -1 })
      .limit(10);

    const dashboardData = {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsersThisMonth
      },
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentUsers
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching dashboard data'
    });
  }
});

// @desc    Create admin user
// @route   POST /api/users/create-admin
// @access  Private (Admin)
router.post('/create-admin', protect, admin, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    const adminUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: {
          id: adminUser._id,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          email: adminUser.email,
          role: adminUser.role
        }
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating admin user',
      details: error.message
    });
  }
});

module.exports = router;
const express = require('express');
const Guide = require('../models/Guide');
const { protect, admin, guide, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all guides
// @route   GET /api/guides
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      region,
      category,
      language,
      verified,
      search,
      sortBy = 'rating.average',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      isActive: true,
      isAcceptingBookings: true
    };

    if (region) filter.regions = { $in: region.split(',') };
    if (category) filter.categories = { $in: category.split(',') };
    if (language) filter.languages = { $in: language.split(',') };
    if (verified === 'true') filter['verification.isVerified'] = true;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const [guides, total] = await Promise.all([
      Guide.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'firstName lastName'),
      Guide.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        guides,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching guides'
    });
  }
});

// @desc    Get top-rated guides
// @route   GET /api/guides/top-rated
// @access  Public
router.get('/top-rated', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const guides = await Guide.getTopRated(Number(limit));

    res.json({
      success: true,
      data: { guides }
    });

  } catch (error) {
    console.error('Get top-rated guides error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching top-rated guides'
    });
  }
});

// @desc    Find available guides
// @route   GET /api/guides/available
// @access  Public
router.get('/available', async (req, res) => {
  try {
    const { region, category, date } = req.query;

    if (!region || !category || !date) {
      return res.status(400).json({
        success: false,
        error: 'Region, category, and date are required'
      });
    }

    const guides = await Guide.findAvailable(region, category, date);

    res.json({
      success: true,
      data: { guides }
    });

  } catch (error) {
    console.error('Find available guides error:', error);
    res.status(500).json({
      success: false,
      error: 'Error finding available guides'
    });
  }
});

// @desc    Get guide by ID
// @route   GET /api/guides/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('reviews')
      .populate('trips', 'title imageUrl category region rating price');

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    res.json({
      success: true,
      data: { guide }
    });

  } catch (error) {
    console.error('Get guide error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching guide'
    });
  }
});

// @desc    Check guide availability
// @route   GET /api/guides/:id/availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    const isAvailable = guide.isAvailableOn(date);

    res.json({
      success: true,
      data: { 
        available: isAvailable,
        date: new Date(date)
      }
    });

  } catch (error) {
    console.error('Check guide availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Error checking guide availability'
    });
  }
});

// @desc    Create guide profile
// @route   POST /api/guides
// @access  Private (Guide/Admin)
router.post('/', protect, guide, async (req, res) => {
  try {
    const guideData = {
      ...req.body,
      user: req.user._id
    };

    // Check if guide profile already exists for this user
    const existingGuide = await Guide.findOne({ user: req.user._id });
    
    if (existingGuide) {
      return res.status(400).json({
        success: false,
        error: 'Guide profile already exists for this user'
      });
    }

    const guide = await Guide.create(guideData);

    res.status(201).json({
      success: true,
      message: 'Guide profile created successfully',
      data: { guide }
    });

  } catch (error) {
    console.error('Create guide error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating guide profile',
      details: error.message
    });
  }
});

// @desc    Update guide profile
// @route   PUT /api/guides/:id
// @access  Private (Owner/Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    // Check ownership or admin
    if (guide.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only update your own profile.'
      });
    }

    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'firstName lastName');

    res.json({
      success: true,
      message: 'Guide profile updated successfully',
      data: { guide: updatedGuide }
    });

  } catch (error) {
    console.error('Update guide error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating guide profile',
      details: error.message
    });
  }
});

// @desc    Update guide availability
// @route   PUT /api/guides/:id/availability
// @access  Private (Owner/Admin)
router.put('/:id/availability', protect, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    // Check ownership or admin
    if (guide.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only update your own availability.'
      });
    }

    guide.availability = { ...guide.availability, ...req.body };
    await guide.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: { availability: guide.availability }
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating availability',
      details: error.message
    });
  }
});

// @desc    Verify guide
// @route   PUT /api/guides/:id/verify
// @access  Private (Admin)
router.put('/:id/verify', protect, admin, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    guide.verification.isVerified = true;
    guide.verification.verifiedBy = req.user._id;
    guide.verification.verifiedAt = new Date();

    await guide.save();

    res.json({
      success: true,
      message: 'Guide verified successfully'
    });

  } catch (error) {
    console.error('Verify guide error:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying guide'
    });
  }
});

// @desc    Delete guide profile
// @route   DELETE /api/guides/:id
// @access  Private (Owner/Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    // Check ownership or admin
    if (guide.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only delete your own profile.'
      });
    }

    // Soft delete by marking as inactive
    guide.isActive = false;
    await guide.save();

    res.json({
      success: true,
      message: 'Guide profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete guide error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting guide profile'
    });
  }
});

// @desc    Get guide statistics
// @route   GET /api/guides/:id/stats
// @access  Private (Owner/Admin)
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    // Check ownership or admin
    if (guide.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only view your own statistics.'
      });
    }

    res.json({
      success: true,
      data: { 
        statistics: guide.statistics,
        rating: guide.rating,
        verification: guide.verification
      }
    });

  } catch (error) {
    console.error('Get guide stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching guide statistics'
    });
  }
});

module.exports = router;
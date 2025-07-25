const express = require('express');
const Trip = require('../models/Trip');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all trips
// @route   GET /api/trips
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      region,
      category,
      difficulty,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      featured,
      popular,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      isActive: true,
      isAvailable: true
    };

    if (region) filter.region = region;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (featured === 'true') filter.featured = true;
    if (popular === 'true') filter.popular = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minDuration || maxDuration) {
      filter['durationDetails.days'] = {};
      if (minDuration) filter['durationDetails.days'].$gte = Number(minDuration);
      if (maxDuration) filter['durationDetails.days'].$lte = Number(maxDuration);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const [trips, total] = await Promise.all([
      Trip.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('guide', 'name specialty rating imageUrl')
        .populate('destinations', 'title location imageUrl')
        .populate('createdBy', 'firstName lastName'),
      Trip.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching trips'
    });
  }
});

// @desc    Get featured trips
// @route   GET /api/trips/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const trips = await Trip.getFeatured(Number(limit));

    res.json({
      success: true,
      data: { trips }
    });

  } catch (error) {
    console.error('Get featured trips error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching featured trips'
    });
  }
});

// @desc    Get popular trips
// @route   GET /api/trips/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const trips = await Trip.getPopular(Number(limit));

    res.json({
      success: true,
      data: { trips }
    });

  } catch (error) {
    console.error('Get popular trips error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching popular trips'
    });
  }
});

// @desc    Get trip by ID or slug
// @route   GET /api/trips/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug
    let trip = await Trip.findById(id)
      .populate('guide', 'name specialty rating imageUrl languages regions contact')
      .populate('destinations', 'title location imageUrl region')
      .populate('createdBy', 'firstName lastName');
    
    if (!trip) {
      trip = await Trip.findOne({ slug: id })
        .populate('guide', 'name specialty rating imageUrl languages regions contact')
        .populate('destinations', 'title location imageUrl region')
        .populate('createdBy', 'firstName lastName');
    }

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Increment view count
    await trip.incrementViews();

    res.json({
      success: true,
      data: { trip }
    });

  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching trip'
    });
  }
});

// @desc    Check trip availability
// @route   GET /api/trips/:id/availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { date, numberOfPeople = 1 } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    const availability = trip.checkAvailability(date, Number(numberOfPeople));

    res.json({
      success: true,
      data: { availability }
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Error checking trip availability'
    });
  }
});

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      createdBy: req.user._id
    };

    const trip = await Trip.create(tripData);

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: { trip }
    });

  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating trip',
      details: error.message
    });
  }
});

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('guide', 'name specialty rating')
     .populate('destinations', 'title location imageUrl');

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: { trip }
    });

  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating trip',
      details: error.message
    });
  }
});

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Soft delete by marking as inactive
    trip.isActive = false;
    await trip.save();

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting trip'
    });
  }
});

// @desc    Get trip statistics
// @route   GET /api/trips/:id/stats
// @access  Private (Admin)
router.get('/:id/stats', protect, admin, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    const stats = {
      views: trip.viewCount,
      bookings: trip.bookingCount,
      rating: trip.rating,
      availabilityStatus: trip.availabilityStatus,
      spotsLeft: trip.availability.maxBookings - trip.availability.currentBookings
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get trip stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching trip statistics'
    });
  }
});

module.exports = router;
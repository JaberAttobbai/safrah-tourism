const express = require('express');
const Destination = require('../models/Destination');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      region,
      category,
      minPrice,
      maxPrice,
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
    if (category) filter.categories = { $in: category.split(',') };
    if (featured === 'true') filter.featured = true;
    if (popular === 'true') filter.popular = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const [destinations, total] = await Promise.all([
      Destination.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'firstName lastName'),
      Destination.countDocuments(filter)
    ]);

    // Add user wishlist information if user is authenticated
    if (req.user) {
      destinations.forEach(destination => {
        destination._doc.isInWishlist = req.user.wishlist.includes(destination._id);
      });
    }

    res.json({
      success: true,
      data: {
        destinations,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching destinations'
    });
  }
});

// @desc    Get featured destinations
// @route   GET /api/destinations/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const destinations = await Destination.getFeatured(Number(limit));

    res.json({
      success: true,
      data: { destinations }
    });

  } catch (error) {
    console.error('Get featured destinations error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching featured destinations'
    });
  }
});

// @desc    Get popular destinations
// @route   GET /api/destinations/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const destinations = await Destination.getPopular(Number(limit));

    res.json({
      success: true,
      data: { destinations }
    });

  } catch (error) {
    console.error('Get popular destinations error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching popular destinations'
    });
  }
});

// @desc    Get destination by ID or slug
// @route   GET /api/destinations/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug
    let destination = await Destination.findById(id).populate('createdBy', 'firstName lastName');
    
    if (!destination) {
      destination = await Destination.findOne({ slug: id }).populate('createdBy', 'firstName lastName');
    }

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    // Increment view count
    await destination.incrementViews();

    // Add wishlist status if user is authenticated
    if (req.user) {
      destination._doc.isInWishlist = req.user.wishlist.includes(destination._id);
    }

    res.json({
      success: true,
      data: { destination }
    });

  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching destination'
    });
  }
});

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const destinationData = {
      ...req.body,
      createdBy: req.user._id
    };

    const destination = await Destination.create(destinationData);

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: { destination }
    });

  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating destination',
      details: error.message
    });
  }
});

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    res.json({
      success: true,
      message: 'Destination updated successfully',
      data: { destination }
    });

  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating destination',
      details: error.message
    });
  }
});

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    // Soft delete by marking as inactive
    destination.isActive = false;
    await destination.save();

    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });

  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting destination'
    });
  }
});

// @desc    Add destination to wishlist
// @route   POST /api/destinations/:id/wishlist
// @access  Private
router.post('/:id/wishlist', protect, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    const user = req.user;
    const isInWishlist = user.wishlist.includes(destination._id);

    if (isInWishlist) {
      return res.status(400).json({
        success: false,
        error: 'Destination already in wishlist'
      });
    }

    user.wishlist.push(destination._id);
    await user.save();

    res.json({
      success: true,
      message: 'Destination added to wishlist'
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Error adding to wishlist'
    });
  }
});

// @desc    Remove destination from wishlist
// @route   DELETE /api/destinations/:id/wishlist
// @access  Private
router.delete('/:id/wishlist', protect, async (req, res) => {
  try {
    const user = req.user;
    const destinationIndex = user.wishlist.indexOf(req.params.id);

    if (destinationIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Destination not in wishlist'
      });
    }

    user.wishlist.splice(destinationIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Destination removed from wishlist'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Error removing from wishlist'
    });
  }
});

// @desc    Get destination statistics
// @route   GET /api/destinations/:id/stats
// @access  Private (Admin)
router.get('/:id/stats', protect, admin, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    const stats = {
      views: destination.viewCount,
      bookings: destination.bookingCount,
      rating: destination.rating,
      wishlisted: await require('../models/User').countDocuments({
        wishlist: destination._id
      })
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get destination stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching destination statistics'
    });
  }
});

module.exports = router;
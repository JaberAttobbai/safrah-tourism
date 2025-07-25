const express = require('express');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const { protect, admin, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user._id
    };

    // Validate trip/destination availability
    if (bookingData.trip) {
      const trip = await Trip.findById(bookingData.trip);
      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      const availability = trip.checkAvailability(
        bookingData.dates.startDate, 
        bookingData.totalTravelers
      );

      if (!availability.available) {
        return res.status(400).json({
          success: false,
          error: 'Trip is not available for the selected date and number of travelers'
        });
      }
    }

    if (bookingData.destination) {
      const destination = await Destination.findById(bookingData.destination);
      if (!destination || !destination.isActive || !destination.isAvailable) {
        return res.status(404).json({
          success: false,
          error: 'Destination not found or not available'
        });
      }
    }

    // Calculate pricing
    let basePrice = 0;
    if (bookingData.trip) {
      const trip = await Trip.findById(bookingData.trip);
      basePrice = trip.discountedPrice || trip.price;
    } else if (bookingData.destination) {
      const destination = await Destination.findById(bookingData.destination);
      basePrice = destination.discountedPrice || destination.price;
    }

    const totalPrice = basePrice * bookingData.totalTravelers;
    const taxAmount = totalPrice * 0.15; // 15% VAT

    bookingData.pricing = {
      basePrice: totalPrice,
      taxAmount,
      totalAmount: totalPrice + taxAmount,
      ...bookingData.pricing
    };

    const booking = await Booking.create(bookingData);

    // Update booking counts
    if (bookingData.trip) {
      await Trip.findByIdAndUpdate(bookingData.trip, {
        $inc: { 
          bookingCount: 1,
          'availability.currentBookings': bookingData.totalTravelers
        }
      });
    }

    if (bookingData.destination) {
      await Destination.findByIdAndUpdate(bookingData.destination, {
        $inc: { bookingCount: 1 }
      });
    }

    // Add to user's booking history
    req.user.bookingHistory.push({
      booking: booking._id,
      date: new Date()
    });
    await req.user.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('trip', 'title imageUrl region category')
      .populate('destination', 'title imageUrl location region')
      .populate('guide', 'name specialty rating contact');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: populatedBooking }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating booking',
      details: error.message
    });
  }
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const bookings = await Booking.getUserBookings(req.user._id, status);

    // Apply pagination if needed
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedBookings = bookings.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      data: {
        bookings: paginatedBookings,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(bookings.length / Number(limit)),
          totalItems: bookings.length
        }
      }
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching bookings'
    });
  }
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter['payment.status'] = paymentStatus;
    
    if (startDate || endDate) {
      filter['dates.startDate'] = {};
      if (startDate) filter['dates.startDate'].$gte = new Date(startDate);
      if (endDate) filter['dates.startDate'].$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'firstName lastName email phone')
        .populate('trip', 'title region category')
        .populate('destination', 'title location region')
        .populate('guide', 'name specialty'),
      Booking.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total
        }
      }
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching bookings'
    });
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('trip', 'title imageUrl region category guide')
      .populate('destination', 'title imageUrl location region')
      .populate('guide', 'name specialty rating contact')
      .populate('notes.author', 'firstName lastName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check access permissions
    if (booking.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only view your own bookings.'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching booking'
    });
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check access permissions
    if (booking.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only update your own bookings.'
      });
    }

    // Prevent updates to confirmed/completed bookings
    if (['confirmed', 'completed'].includes(booking.status) && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update confirmed or completed bookings'
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trip', 'title imageUrl region category')
     .populate('destination', 'title imageUrl location region')
     .populate('guide', 'name specialty rating');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking: updatedBooking }
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating booking',
      details: error.message
    });
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check access permissions
    if (booking.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only cancel your own bookings.'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel completed booking'
      });
    }

    await booking.cancelBooking(req.user._id, reason);

    // Update trip availability if applicable
    if (booking.trip) {
      await Trip.findByIdAndUpdate(booking.trip, {
        $inc: { 
          'availability.currentBookings': -booking.totalTravelers
        }
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        refundEligible: booking.cancellation.refundEligible,
        refundAmount: booking.cancellation.refundAmount
      }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Error cancelling booking'
    });
  }
});

// @desc    Confirm booking (Admin)
// @route   PUT /api/bookings/:id/confirm
// @access  Private (Admin)
router.put('/:id/confirm', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already confirmed'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Cannot confirm cancelled booking'
      });
    }

    await booking.confirmBooking(req.user._id);

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        confirmationNumber: booking.confirmation.confirmationNumber
      }
    });

  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Error confirming booking'
    });
  }
});

// @desc    Add note to booking
// @route   POST /api/bookings/:id/notes
// @access  Private
router.post('/:id/notes', protect, async (req, res) => {
  try {
    const { content, isInternal = true } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check access permissions
    if (booking.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    await booking.addNote(req.user._id, content, isInternal);

    res.json({
      success: true,
      message: 'Note added successfully'
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      error: 'Error adding note'
    });
  }
});

// @desc    Get upcoming bookings
// @route   GET /api/bookings/upcoming
// @access  Private (Admin)
router.get('/upcoming', protect, admin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const bookings = await Booking.getUpcoming(Number(limit));

    res.json({
      success: true,
      data: { bookings }
    });

  } catch (error) {
    console.error('Get upcoming bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching upcoming bookings'
    });
  }
});

module.exports = router;
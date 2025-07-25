const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  trip: {
    type: mongoose.Schema.ObjectId,
    ref: 'Trip'
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination'
  },
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: 'Guide'
  },
  bookingType: {
    type: String,
    enum: ['trip', 'destination', 'custom'],
    required: true
  },
  travelers: {
    adults: {
      type: Number,
      required: true,
      min: [1, 'At least one adult traveler is required']
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  totalTravelers: {
    type: Number,
    required: true,
    min: 1
  },
  travelerDetails: [{
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    nationality: {
      type: String,
      trim: true
    },
    passportNumber: {
      type: String,
      trim: true
    },
    specialRequirements: {
      type: String,
      trim: true
    }
  }],
  dates: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    duration: {
      type: Number,
      required: true // in days
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    additionalFees: [{
      name: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      description: {
        type: String
      }
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'SAR',
      enum: ['SAR', 'USD', 'EUR']
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'wallet'],
      required: true
    },
    transactionId: {
      type: String
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    paymentDate: {
      type: Date
    },
    refundDate: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  contactInfo: {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      relationship: {
        type: String,
        trim: true
      }
    }
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  accommodationRequests: {
    roomType: {
      type: String,
      enum: ['single', 'double', 'twin', 'triple', 'family', 'suite']
    },
    specialRequirements: {
      type: String,
      maxlength: [300, 'Accommodation requirements cannot exceed 300 characters']
    }
  },
  dietaryRequirements: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free', 'dairy_free', 'nut_free']
  }],
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: {
      type: Date
    },
    cancelledBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      trim: true
    },
    refundEligible: {
      type: Boolean,
      default: false
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  confirmation: {
    isConfirmed: {
      type: Boolean,
      default: false
    },
    confirmedAt: {
      type: Date
    },
    confirmedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    confirmationNumber: {
      type: String
    }
  },
  communication: {
    notifications: [{
      type: {
        type: String,
        enum: ['email', 'sms', 'push'],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      sentAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['sent', 'delivered', 'failed'],
        default: 'sent'
      }
    }],
    lastContactDate: {
      type: Date
    }
  },
  review: {
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  },
  notes: [{
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Note cannot exceed 1000 characters']
    },
    isInternal: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Create indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ trip: 1 });
bookingSchema.index({ destination: 1 });
bookingSchema.index({ guide: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ 'dates.startDate': 1, 'dates.endDate': 1 });
bookingSchema.index({ createdAt: -1 });

// Compound indexes
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ 'dates.startDate': 1, status: 1 });

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  const count = await this.constructor.countDocuments();
  const bookingNumber = String(count + 1).padStart(6, '0');
  this.bookingId = `SAF${bookingNumber}`;
  
  next();
});

// Calculate total travelers before saving
bookingSchema.pre('save', function(next) {
  this.totalTravelers = this.travelers.adults + this.travelers.children + this.travelers.infants;
  next();
});

// Calculate duration in days
bookingSchema.pre('save', function(next) {
  if (this.dates.startDate && this.dates.endDate) {
    const timeDiff = this.dates.endDate.getTime() - this.dates.startDate.getTime();
    this.dates.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  next();
});

// Generate confirmation number when confirmed
bookingSchema.pre('save', function(next) {
  if (this.isModified('confirmation.isConfirmed') && this.confirmation.isConfirmed && !this.confirmation.confirmationNumber) {
    this.confirmation.confirmationNumber = `${this.bookingId}-${Date.now().toString(36).toUpperCase()}`;
    this.confirmation.confirmedAt = new Date();
  }
  next();
});

// Virtual for booking reference
bookingSchema.virtual('reference').get(function() {
  return this.confirmation.confirmationNumber || this.bookingId;
});

// Virtual for booking duration text
bookingSchema.virtual('durationText').get(function() {
  const days = this.dates.duration;
  if (days === 1) {
    return 'يوم واحد';
  } else if (days === 2) {
    return 'يومان';
  } else if (days <= 10) {
    return `${days} أيام`;
  } else {
    return `${days} يوم`;
  }
});

// Virtual for remaining amount
bookingSchema.virtual('remainingAmount').get(function() {
  return this.pricing.totalAmount - this.payment.paidAmount;
});

// Static method to get user's bookings
bookingSchema.statics.getUserBookings = function(userId, status = null) {
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('trip', 'title imageUrl region category')
    .populate('destination', 'title imageUrl location region')
    .populate('guide', 'name specialty rating')
    .sort({ createdAt: -1 });
};

// Static method to get upcoming bookings
bookingSchema.statics.getUpcoming = function(limit = 10) {
  const today = new Date();
  return this.find({
    'dates.startDate': { $gte: today },
    status: { $in: ['confirmed', 'pending'] }
  })
    .populate('user', 'firstName lastName email phone')
    .populate('trip', 'title region category')
    .populate('destination', 'title location region')
    .sort({ 'dates.startDate': 1 })
    .limit(limit);
};

// Instance method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const startDate = this.dates.startDate;
  const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  let refundPercentage = 0;
  
  if (hoursUntilStart >= 48) {
    refundPercentage = 100; // Full refund
  } else if (hoursUntilStart >= 24) {
    refundPercentage = 50; // 50% refund
  } else if (hoursUntilStart >= 12) {
    refundPercentage = 25; // 25% refund
  } else {
    refundPercentage = 0; // No refund
  }
  
  return (this.payment.paidAmount * refundPercentage) / 100;
};

// Instance method to cancel booking
bookingSchema.methods.cancelBooking = async function(cancelledBy, reason) {
  this.status = 'cancelled';
  this.cancellation.isCancelled = true;
  this.cancellation.cancelledAt = new Date();
  this.cancellation.cancelledBy = cancelledBy;
  this.cancellation.reason = reason;
  
  const refundAmount = this.calculateRefund();
  this.cancellation.refundEligible = refundAmount > 0;
  this.cancellation.refundAmount = refundAmount;
  
  return this.save();
};

// Instance method to confirm booking
bookingSchema.methods.confirmBooking = async function(confirmedBy) {
  this.status = 'confirmed';
  this.confirmation.isConfirmed = true;
  this.confirmation.confirmedBy = confirmedBy;
  
  return this.save();
};

// Instance method to add note
bookingSchema.methods.addNote = function(author, content, isInternal = true) {
  this.notes.push({
    author,
    content,
    isInternal
  });
  
  return this.save();
};

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
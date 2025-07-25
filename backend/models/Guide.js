const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Guide name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  experienceYears: {
    type: Number,
    required: [true, 'Experience years is required'],
    min: [0, 'Experience cannot be negative']
  },
  languages: [{
    type: String,
    required: true,
    enum: ['arabic', 'english', 'french', 'urdu', 'spanish', 'german']
  }],
  regions: [{
    type: String,
    required: true,
    enum: ['north', 'south', 'east', 'west', 'center']
  }],
  categories: [{
    type: String,
    enum: ['beach', 'mountain', 'shopping', 'religious', 'cultural', 'adventure', 'family', 'luxury']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Profile image URL is required']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  bio: {
    type: String,
    maxlength: [2000, 'Bio cannot exceed 2000 characters']
  },
  qualifications: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    year: {
      type: Number
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  certifications: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      trim: true
    },
    issueDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    schedule: [{
      day: {
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      available: {
        type: Boolean,
        default: true
      },
      timeSlots: [{
        start: {
          type: String,
          match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        },
        end: {
          type: String,
          match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        }
      }]
    }],
    blackoutDates: [{
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      },
      reason: {
        type: String,
        trim: true
      }
    }]
  },
  pricing: {
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate cannot be negative']
    },
    dailyRate: {
      type: Number,
      min: [0, 'Daily rate cannot be negative']
    },
    groupRates: [{
      minSize: {
        type: Number,
        required: true,
        min: 1
      },
      maxSize: {
        type: Number,
        required: true,
        min: 1
      },
      rate: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        enum: ['hour', 'day', 'trip'],
        default: 'day'
      }
    }]
  },
  contact: {
    phone: {
      type: String,
      match: [/^05\d{8}$/, 'Please provide a valid Saudi phone number (05xxxxxxxx)']
    },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    whatsapp: {
      type: String,
      match: [/^05\d{8}$/, 'Please provide a valid WhatsApp number (05xxxxxxxx)']
    }
  },
  socialMedia: {
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    }
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date
    },
    documents: [{
      type: {
        type: String,
        enum: ['id_card', 'license', 'certificate', 'insurance'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      verified: {
        type: Boolean,
        default: false
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  statistics: {
    totalTrips: {
      type: Number,
      default: 0
    },
    totalClients: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    responseTime: {
      type: Number,
      default: 0 // in hours
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAcceptingBookings: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  trips: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Trip'
  }]
}, {
  timestamps: true
});

// Create indexes
guideSchema.index({ 'user': 1 });
guideSchema.index({ regions: 1 });
guideSchema.index({ categories: 1 });
guideSchema.index({ languages: 1 });
guideSchema.index({ 'rating.average': -1 });
guideSchema.index({ 'verification.isVerified': 1 });
guideSchema.index({ isActive: 1, isAcceptingBookings: 1 });

// Compound indexes
guideSchema.index({ regions: 1, categories: 1 });
guideSchema.index({ 'rating.average': -1, 'verification.isVerified': 1 });

// Virtual for average rating display
guideSchema.virtual('ratingDisplay').get(function() {
  return Math.round(this.rating.average * 10) / 10;
});

// Virtual for experience display
guideSchema.virtual('experienceDisplay').get(function() {
  if (this.experienceYears === 1) {
    return 'سنة واحدة';
  } else if (this.experienceYears === 2) {
    return 'سنتان';
  } else if (this.experienceYears <= 10) {
    return `${this.experienceYears} سنوات`;
  } else {
    return `${this.experienceYears} سنة`;
  }
});

// Update lastActive on save
guideSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastActive = new Date();
  }
  next();
});

// Static method to get top-rated guides
guideSchema.statics.getTopRated = function(limit = 6) {
  return this.find({ 
    isActive: true, 
    isAcceptingBookings: true,
    'verification.isVerified': true 
  })
    .sort({ 'rating.average': -1, 'rating.count': -1 })
    .limit(limit)
    .populate('user', 'firstName lastName');
};

// Static method to search guides
guideSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    isAcceptingBookings: true,
    ...filters
  };
  
  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { specialty: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  
  return this.find(searchQuery).populate('user', 'firstName lastName');
};

// Static method to find available guides
guideSchema.statics.findAvailable = function(region, category, date) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
  
  return this.find({
    isActive: true,
    isAcceptingBookings: true,
    'availability.isAvailable': true,
    regions: region,
    categories: category,
    'availability.schedule': {
      $elemMatch: {
        day: dayOfWeek,
        available: true
      }
    },
    'availability.blackoutDates': {
      $not: {
        $elemMatch: {
          start: { $lte: new Date(date) },
          end: { $gte: new Date(date) }
        }
      }
    }
  }).populate('user', 'firstName lastName');
};

// Instance method to update rating
guideSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  
  return this.save();
};

// Instance method to check availability for a specific date
guideSchema.methods.isAvailableOn = function(date) {
  const checkDate = new Date(date);
  const dayOfWeek = checkDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
  
  // Check if guide is generally available
  if (!this.isActive || !this.isAcceptingBookings || !this.availability.isAvailable) {
    return false;
  }
  
  // Check day of week availability
  const daySchedule = this.availability.schedule.find(s => s.day === dayOfWeek);
  if (!daySchedule || !daySchedule.available) {
    return false;
  }
  
  // Check blackout dates
  const isBlackedOut = this.availability.blackoutDates.some(blackout => 
    checkDate >= blackout.start && checkDate <= blackout.end
  );
  
  return !isBlackedOut;
};

// Ensure virtual fields are serialized
guideSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Guide', guideSchema);
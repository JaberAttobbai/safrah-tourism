const mongoose = require('mongoose');
const slugify = require('slugify');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number
  },
  currency: {
    type: String,
    default: 'SAR',
    enum: ['SAR', 'USD', 'EUR']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  durationDetails: {
    days: {
      type: Number,
      required: true,
      min: 1
    },
    nights: {
      type: Number,
      default: function() {
        return Math.max(0, this.durationDetails.days - 1);
      }
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['beach', 'mountain', 'shopping', 'religious', 'cultural', 'adventure', 'family', 'luxury']
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    enum: ['north', 'south', 'east', 'west', 'center']
  },
  imageUrl: {
    type: String,
    required: [true, 'Main image URL is required']
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
  included: [{
    type: String,
    required: true,
    trim: true
  }],
  excluded: [{
    type: String,
    trim: true
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [{
      type: String,
      trim: true
    }],
    meals: [{
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks']
    }],
    accommodation: {
      type: String,
      trim: true
    }
  }],
  travelers: {
    min: {
      type: Number,
      default: 1,
      min: 1
    },
    max: {
      type: Number,
      default: 10,
      min: 1
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  ageRestrictions: {
    minAge: {
      type: Number,
      default: 0
    },
    maxAge: {
      type: Number
    }
  },
  languages: [{
    type: String,
    enum: ['arabic', 'english', 'french', 'urdu'],
    default: ['arabic']
  }],
  meetingPoint: {
    name: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 48 hours before departure'
  },
  refundPolicy: {
    type: String,
    default: 'Full refund for cancellations made 48+ hours in advance'
  },
  featured: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  tags: [{
    type: String,
    trim: true
  }],
  amenities: [{
    type: String,
    enum: [
      'air_conditioning', 'wifi', 'meals', 'transportation', 
      'guide', 'insurance', 'equipment', 'photography'
    ]
  }],
  availability: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    daysOfWeek: [{
      type: String,
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }],
    maxBookings: {
      type: Number,
      default: 20
    },
    currentBookings: {
      type: Number,
      default: 0
    }
  },
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: 'Guide'
  },
  destinations: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Destination'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  bookingCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

// Create indexes
tripSchema.index({ slug: 1 });
tripSchema.index({ category: 1 });
tripSchema.index({ region: 1 });
tripSchema.index({ featured: 1 });
tripSchema.index({ popular: 1 });
tripSchema.index({ price: 1 });
tripSchema.index({ 'rating.average': -1 });
tripSchema.index({ difficulty: 1 });
tripSchema.index({ 'availability.startDate': 1, 'availability.endDate': 1 });
tripSchema.index({ isActive: 1, isAvailable: 1 });

// Compound indexes
tripSchema.index({ category: 1, region: 1 });
tripSchema.index({ price: 1, difficulty: 1 });

// Virtual for discounted price
tripSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Virtual for savings amount
tripSchema.virtual('savings').get(function() {
  if (this.discount > 0) {
    return Math.round(this.price * (this.discount / 100));
  }
  return 0;
});

// Virtual for availability status
tripSchema.virtual('availabilityStatus').get(function() {
  const now = new Date();
  const available = this.availability.currentBookings < this.availability.maxBookings;
  const inDateRange = now >= this.availability.startDate && now <= this.availability.endDate;
  
  if (!this.isActive || !this.isAvailable) return 'inactive';
  if (!inDateRange) return 'out_of_season';
  if (!available) return 'fully_booked';
  if (this.availability.currentBookings / this.availability.maxBookings > 0.8) return 'limited_spots';
  
  return 'available';
});

// Generate slug before saving
tripSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    locale: 'ar'
  }) + '-' + Date.now();
  
  next();
});

// Update originalPrice if not set
tripSchema.pre('save', function(next) {
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

// Static method to get popular trips
tripSchema.statics.getPopular = function(limit = 6) {
  return this.find({ popular: true, isActive: true, isAvailable: true })
    .sort({ 'rating.average': -1, bookingCount: -1 })
    .limit(limit)
    .populate('guide', 'name specialty rating')
    .populate('destinations', 'title location imageUrl');
};

// Static method to get featured trips
tripSchema.statics.getFeatured = function(limit = 8) {
  return this.find({ featured: true, isActive: true, isAvailable: true })
    .sort({ 'rating.average': -1 })
    .limit(limit)
    .populate('guide', 'name specialty rating')
    .populate('destinations', 'title location imageUrl');
};

// Static method to search trips
tripSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    isAvailable: true,
    ...filters
  };
  
  if (query) {
    searchQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ];
  }
  
  return this.find(searchQuery)
    .populate('guide', 'name specialty rating')
    .populate('destinations', 'title location imageUrl');
};

// Instance method to check availability
tripSchema.methods.checkAvailability = function(date, numberOfPeople = 1) {
  const requestedDate = new Date(date);
  const available = this.availability.currentBookings + numberOfPeople <= this.availability.maxBookings;
  const inDateRange = requestedDate >= this.availability.startDate && requestedDate <= this.availability.endDate;
  const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const dayAvailable = this.availability.daysOfWeek.length === 0 || this.availability.daysOfWeek.includes(dayOfWeek);
  
  return {
    available: this.isActive && this.isAvailable && available && inDateRange && dayAvailable,
    spotsLeft: this.availability.maxBookings - this.availability.currentBookings,
    inSeason: inDateRange,
    dayAvailable
  };
};

// Instance method to update rating
tripSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  
  return this.save();
};

// Instance method to increment view count
tripSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Ensure virtual fields are serialized
tripSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Trip', tripSchema);
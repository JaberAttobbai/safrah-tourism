const mongoose = require('mongoose');
const slugify = require('slugify');

const destinationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Destination title is required'],
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
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    enum: ['north', 'south', 'east', 'west', 'center']
  },
  coordinates: {
    latitude: {
      type: Number,
      validate: {
        validator: function(v) {
          return v >= -90 && v <= 90;
        },
        message: 'Latitude must be between -90 and 90'
      }
    },
    longitude: {
      type: Number,
      validate: {
        validator: function(v) {
          return v >= -180 && v <= 180;
        },
        message: 'Longitude must be between -180 and 180'
      }
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  currency: {
    type: String,
    default: 'SAR',
    enum: ['SAR', 'USD', 'EUR']
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
  imageUrl: {
    type: String,
    required: [true, 'Main image URL is required']
  },
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
  categories: [{
    type: String,
    enum: ['beach', 'mountain', 'shopping', 'religious', 'cultural', 'adventure', 'family', 'luxury']
  }],
  amenities: [{
    type: String,
    enum: [
      'parking', 'wifi', 'restaurant', 'pool', 'spa', 'gym', 
      'beach_access', 'mountain_view', 'shopping_nearby', 
      'prayer_room', 'family_friendly', 'wheelchair_accessible'
    ]
  }],
  duration: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks'],
      default: 'days'
    }
  },
  capacity: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 20
    }
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
  inclusions: [{
    type: String,
    trim: true
  }],
  exclusions: [{
    type: String,
    trim: true
  }],
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 24 hours before the tour'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  season: [{
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter', 'all_year']
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
destinationSchema.index({ slug: 1 });
destinationSchema.index({ region: 1 });
destinationSchema.index({ featured: 1 });
destinationSchema.index({ popular: 1 });
destinationSchema.index({ price: 1 });
destinationSchema.index({ 'rating.average': -1 });
destinationSchema.index({ tags: 1 });
destinationSchema.index({ categories: 1 });
destinationSchema.index({ isActive: 1, isAvailable: 1 });

// Compound indexes
destinationSchema.index({ region: 1, categories: 1 });
destinationSchema.index({ price: 1, region: 1 });

// Virtual for discounted price
destinationSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Virtual for savings amount
destinationSchema.virtual('savings').get(function() {
  if (this.discount > 0) {
    return Math.round(this.price * (this.discount / 100));
  }
  return 0;
});

// Generate slug before saving
destinationSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    locale: 'ar'
  }) + '-' + Date.now();
  
  next();
});

// Update originalPrice if not set
destinationSchema.pre('save', function(next) {
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

// Ensure at least one image is primary
destinationSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Static method to get popular destinations
destinationSchema.statics.getPopular = function(limit = 6) {
  return this.find({ popular: true, isActive: true, isAvailable: true })
    .sort({ 'rating.average': -1, bookingCount: -1 })
    .limit(limit);
};

// Static method to get featured destinations
destinationSchema.statics.getFeatured = function(limit = 8) {
  return this.find({ featured: true, isActive: true, isAvailable: true })
    .sort({ 'rating.average': -1 })
    .limit(limit);
};

// Static method to search destinations
destinationSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    isAvailable: true,
    ...filters
  };
  
  if (query) {
    searchQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ];
  }
  
  return this.find(searchQuery);
};

// Instance method to update rating
destinationSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  
  return this.save();
};

// Instance method to increment view count
destinationSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Ensure virtual fields are serialized
destinationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Destination', destinationSchema);
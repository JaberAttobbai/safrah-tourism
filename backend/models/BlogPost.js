const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  featuredImage: {
    url: {
      type: String,
      required: [true, 'Featured image is required']
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      trim: true
    }
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
    caption: {
      type: String,
      trim: true
    }
  }],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'travel_tips',
      'destination_guide',
      'cultural_insights',
      'food_and_dining',
      'adventures',
      'family_travel',
      'luxury_travel',
      'budget_travel',
      'seasonal_travel',
      'safety_tips'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  relatedDestinations: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Destination'
  }],
  relatedTrips: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Trip'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  readingTime: {
    type: Number, // in minutes
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    replies: [{
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: [500, 'Reply cannot exceed 500 characters']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isCommentsEnabled: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    enum: ['ar', 'en'],
    default: 'ar'
  }
}, {
  timestamps: true
});

// Create indexes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ featured: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ viewCount: -1 });

// Compound indexes
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });

// Generate slug before saving
blogPostSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    locale: 'ar'
  }) + '-' + Date.now();
  
  next();
});

// Generate excerpt if not provided
blogPostSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    // Remove HTML tags and get first 150 characters
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }
  next();
});

// Calculate reading time
blogPostSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Set publishedAt when status changes to published
blogPostSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for like count
blogPostSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
blogPostSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.filter(comment => comment.isApproved).length : 0;
});

// Virtual for reading time display
blogPostSchema.virtual('readingTimeDisplay').get(function() {
  if (this.readingTime === 1) {
    return 'دقيقة واحدة';
  } else if (this.readingTime === 2) {
    return 'دقيقتان';
  } else if (this.readingTime <= 10) {
    return `${this.readingTime} دقائق`;
  } else {
    return `${this.readingTime} دقيقة`;
  }
});

// Static method to get published posts
blogPostSchema.statics.getPublished = function(limit = 10, category = null) {
  const query = { status: 'published' };
  if (category) query.category = category;
  
  return this.find(query)
    .populate('author', 'firstName lastName profileImage')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Static method to get featured posts
blogPostSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ 
    status: 'published', 
    featured: true 
  })
    .populate('author', 'firstName lastName profileImage')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Static method to search posts
blogPostSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    status: 'published',
    ...filters
  };
  
  if (query) {
    searchQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { subtitle: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ];
  }
  
  return this.find(searchQuery)
    .populate('author', 'firstName lastName profileImage')
    .sort({ publishedAt: -1 });
};

// Static method to get related posts
blogPostSchema.statics.getRelated = function(postId, category, tags, limit = 4) {
  return this.find({
    _id: { $ne: postId },
    status: 'published',
    $or: [
      { category: category },
      { tags: { $in: tags } }
    ]
  })
    .populate('author', 'firstName lastName profileImage')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Instance method to increment view count
blogPostSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Instance method to add like
blogPostSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (!existingLike) {
    this.likes.push({ user: userId });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to remove like
blogPostSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

// Instance method to add comment
blogPostSchema.methods.addComment = function(userId, content) {
  if (!this.isCommentsEnabled) {
    throw new Error('Comments are disabled for this post');
  }
  
  this.comments.push({
    user: userId,
    content,
    isApproved: false // Require approval
  });
  
  return this.save();
};

// Instance method to approve comment
blogPostSchema.methods.approveComment = function(commentId) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.isApproved = true;
    return this.save();
  }
  
  throw new Error('Comment not found');
};

// Ensure virtual fields are serialized
blogPostSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
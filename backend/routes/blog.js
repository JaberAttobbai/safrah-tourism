const express = require('express');
const BlogPost = require('../models/BlogPost');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { status: 'published' };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('author', 'firstName lastName profileImage')
        .populate('relatedDestinations', 'title imageUrl location')
        .populate('relatedTrips', 'title imageUrl category'),
      BlogPost.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching blog posts'
    });
  }
});

// @desc    Get featured blog posts
// @route   GET /api/blog/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const posts = await BlogPost.getFeatured(Number(limit));

    res.json({
      success: true,
      data: { posts }
    });

  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching featured posts'
    });
  }
});

// @desc    Get blog post by ID or slug
// @route   GET /api/blog/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug
    let post = await BlogPost.findById(id)
      .populate('author', 'firstName lastName profileImage')
      .populate('relatedDestinations', 'title imageUrl location')
      .populate('relatedTrips', 'title imageUrl category')
      .populate('comments.user', 'firstName lastName profileImage')
      .populate('comments.replies.user', 'firstName lastName profileImage');
    
    if (!post) {
      post = await BlogPost.findOne({ slug: id })
        .populate('author', 'firstName lastName profileImage')
        .populate('relatedDestinations', 'title imageUrl location')
        .populate('relatedTrips', 'title imageUrl category')
        .populate('comments.user', 'firstName lastName profileImage')
        .populate('comments.replies.user', 'firstName lastName profileImage');
    }

    if (!post || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Increment view count
    await post.incrementViews();

    // Get related posts
    const relatedPosts = await BlogPost.getRelated(
      post._id,
      post.category,
      post.tags,
      4
    );

    // Check if user has liked the post
    let hasLiked = false;
    if (req.user) {
      hasLiked = post.likes.some(like => 
        like.user.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      data: { 
        post: {
          ...post.toJSON(),
          hasLiked
        },
        relatedPosts
      }
    });

  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching blog post'
    });
  }
});

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private (Admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user._id
    };

    const post = await BlogPost.create(postData);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: { post }
    });

  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating blog post',
      details: error.message
    });
  }
});

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private (Admin/Author)
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Check if user is admin or the author
    if (req.user.role !== 'admin' && 
        post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only edit your own posts.'
      });
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName profileImage');

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: { post: updatedPost }
    });

  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating blog post',
      details: error.message
    });
  }
});

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private (Admin/Author)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Check if user is admin or the author
    if (req.user.role !== 'admin' && 
        post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only delete your own posts.'
      });
    }

    // Soft delete by archiving
    post.status = 'archived';
    await post.save();

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting blog post'
    });
  }
});

// @desc    Like blog post
// @route   POST /api/blog/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    await post.addLike(req.user._id);

    res.json({
      success: true,
      message: 'Post liked successfully',
      data: { likeCount: post.likeCount }
    });

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      error: 'Error liking post'
    });
  }
});

// @desc    Unlike blog post
// @route   DELETE /api/blog/:id/like
// @access  Private
router.delete('/:id/like', protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    await post.removeLike(req.user._id);

    res.json({
      success: true,
      message: 'Post unliked successfully',
      data: { likeCount: post.likeCount }
    });

  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({
      success: false,
      error: 'Error unliking post'
    });
  }
});

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    const post = await BlogPost.findById(req.params.id);

    if (!post || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    await post.addComment(req.user._id, content);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully. It will be visible after approval.'
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error adding comment'
    });
  }
});

// @desc    Approve comment
// @route   PUT /api/blog/:id/comments/:commentId/approve
// @access  Private (Admin)
router.put('/:id/comments/:commentId/approve', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    await post.approveComment(req.params.commentId);

    res.json({
      success: true,
      message: 'Comment approved successfully'
    });

  } catch (error) {
    console.error('Approve comment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error approving comment'
    });
  }
});

// @desc    Get blog categories with post counts
// @route   GET /api/blog/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 } 
      } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching categories'
    });
  }
});

module.exports = router;
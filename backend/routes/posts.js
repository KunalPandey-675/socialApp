const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const Post = require('../models/Post');
const User = require('../models/User');
const { commentSchema } = require('../utils/validation');

// route   GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50);                 // Limit to recent 50 posts

    res.json({
      success: true,
      posts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// route   POST /api/posts
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { text } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post must contain text or an image' 
      });
    }

    // Get user info
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Upload image to Cloudinary if provided
    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Create post
    const newPost = new Post({
      user: req.user.id,
      username: user.username,
      text: text || '',
      image: imageUrl
    });

    const post = await newPost.save();

    res.json({
      success: true,
      post
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// route   POST /api/posts/:id/like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Get user info
    const user = await User.findById(req.user.id).select('-password');

    // Check if post has already been liked by this user
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike - remove like
      post.likes.splice(likeIndex, 1);
    } else {
      // Like - add like
      post.likes.unshift({ 
        user: req.user.id, 
        username: user.username 
      });
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// route   POST /api/posts/:id/comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    // Validate comment with Zod
    const validatedData = commentSchema.parse(req.body);
    const { text } = validatedData;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Get user info
    const user = await User.findById(req.user.id).select('-password');

    const newComment = {
      user: req.user.id,
      username: user.username,
      text: text.trim()
    };

    post.comments.unshift(newComment);
    await post.save();

    res.json({
      success: true,
      comments: post.comments
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle Zod validation errors
    if (err.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        message: err.errors[0].message 
      });
    }
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// route   DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authorized' 
      });
    }

    await post.deleteOne();

    res.json({ 
      success: true, 
      message: 'Post removed' 
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;

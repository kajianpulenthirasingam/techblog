const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

// Homepage route
router.get('/', async (req, res) => {
  try {
    // Fetch all blog posts from the database
    const posts = await Post.findAll();

    // Render the homepage template with the posts data
    res.render('index', { posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Dashboard route
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch the logged-in user's posts from the database
    const userId = req.session.userId;
    const userPosts = await Post.findAll({ where: { userId } });

    // Render the dashboard template with the user's posts data
    res.render('dashboard', { userPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign-up route
router.get('/signup', (req, res) => {
  // Render the sign-up template
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Create a new user in the database
    await User.create({ username, password });

    // Redirect to the login page
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.get('/login', (req, res) => {
  // Render the login 
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database based on the username
    const user = await User.findOne({ where: { username } });

    if (user && user.password === password) {
      // Set the user ID in the session to authenticate them
      req.session.userId = user.id;

      // Redirect to the dashboard
      res.redirect('/dashboard');
    } else {
      // Show an error message if authentication fails
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  // Destroy the session and redirect to the homepage
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Create blog post route
router.get('/posts/create', (req, res) => {
  // Render the create post template
  res.render('create-post');
});

router.post('/posts/create', async (req, res) => {
  const { title, content } = req.body;

  try {
    // Create a new blog post in the database
    const userId = req.session.userId;
    await Post.create({ title, content, userId });

    // Redirect to the dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update blog post route
router.get('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the blog post from the database
    const post = await Post.findByPk(postId);

    // Render the edit post template with the post data
    res.render('edit-post', { post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  try {
    // Update the blog post in the database
    await Post.update({ title, content }, { where: { id: postId } });

    // Redirect to the dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Leave comment on blog post route
router.post('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const { name, content } = req.body;

  try {
    // Create a new comment for the blog post in the database
    await Comment.create({ name, content, postId });

    // Redirect to the blog post details page
    res.redirect(`/posts/${postId}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bcrypt = require('bcrypt');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'kajian',
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize 
    })
  })
);

// User model and other dependencies should be imported here

const routes = require('./routes');
 
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ username, password: hashedPassword });

    // Set user session data
    req.session.userId = newUser.id;

    // Redirect to the dashboard or show a success message
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Set user session data
    req.session.userId = user.id;

    // Redirect to the dashboard or show a success message
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
app.post('/logout', (req, res) => {
  // Clear the user session data
  req.session.destroy();

  // Redirect to the login page or show a success message
  res.redirect('/login');
});
 
app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  // Render the dashboard view
  res.render('dashboard');
});

app.get('/posts/create', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  // Render the create-post view
  res.render('create-post');
});


app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

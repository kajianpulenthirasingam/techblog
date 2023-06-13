const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'kajian',
    resave: false,
    saveUninitialized: true
  })
);

const routes = require('./routes');

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

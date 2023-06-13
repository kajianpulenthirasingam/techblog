const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Set up middleware and routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

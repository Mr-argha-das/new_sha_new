require("dotenv").config();

// Debug: Check if JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not found in environment. Using default value.');
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
}

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`JWT_SECRET loaded: ${!!process.env.JWT_SECRET}`);
});

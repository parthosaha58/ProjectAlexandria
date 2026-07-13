const mongoose = require("mongoose"); // Import Mongoose

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Username is required
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  bio: {
    type: String, // Bio is optional
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId, // Bookmarks is an array of post IDs
      ref: "Post", // Reference to the Post model
    },
  ],
  createdPosts: [
    {
      type: mongoose.Schema.Types.ObjectId, // CreatedPosts is an array of post IDs
      ref: "Post", // Reference to the Post model
    },
  ],
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;

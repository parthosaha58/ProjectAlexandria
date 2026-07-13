const mongoose = require("mongoose"); // Import Mongoose
const User = require("./user"); // Import the User model

// Define the feedback schema
const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // This refers to the "User" model
      required: true, // Feedback must be associated with a user
    },
    content: {
      type: String,
      required: true, // Content of the feedback is required
      trim: true, // Trim whitespace from feedback
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the date when feedback is created
    },
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
  }
);

// Create the Feedback model based on the schema
const Feedback = mongoose.model("Feedback", feedbackSchema);

// Export the Feedback model
module.exports = Feedback;

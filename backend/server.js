const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const User = require("./models/user");
const Post = require("./models/postsch");
const Course = require("./models/Course");
const Topic = require("./models/Topic");
const Resource = require("./models/Resource");
const LinksInfo = require("./models/LinksInfo");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ProjectAlexandria"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Endpoint to fetch users from the database
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send(error);
  }
});

// Endpoint to fetch a user's profile by username
app.get("/api/users/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Server error");
  }
});

// POST endpoint to add a new user
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser); // Add logging
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send("Error saving user");
  }
});

// POST endpoint for user login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("Login successful for user:", username); // Add logging
      res.status(200).send("Login successful");
    } else {
      console.log("Invalid credentials for user:", username); // Add logging
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Server error");
  }
});

// PUT endpoint to update a user
app.put("/api/users/:id", async (req, res) => {
  try {
    const { username, password } = req.body;
    const updateData = { username };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    console.log("User updated:", updatedUser); // Add logging
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).send("Error updating user");
  }
});

// Endpoint to update a user's bio
app.put("/api/users/:username/bio", async (req, res) => {
  const { bio } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { bio },
      { new: true }
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).send("Server error");
  }
});

// PUT endpoint to bookmark a post for a user
app.put("/api/users/:username/bookmark", async (req, res) => {
  try {
    const { postId } = req.body;
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      user.bookmarks.push(postId);
      await user.save();
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error bookmarking post:", error);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch bookmarked posts for a user
app.get("/api/users/:username/bookmarks", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      "bookmarks"
    );
    if (user) {
      res.json(user.bookmarks);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch posts created by a user
app.get("/api/users/:username/createdPosts", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      "createdPosts"
    );
    if (user) {
      res.json(user.createdPosts);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching created posts:", error);
    res.status(500).send("Server error");
  }
});

// DELETE endpoint to delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log("User deleted:", req.params.id); // Add logging
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(400).send("Error deleting user");
  }
});

// Endpoint to fetch posts from the database
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(
      posts.map((post) => ({
        ...post.toObject(),
        images: post.images.map((image) => image.toString("base64")),
      }))
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send(error);
  }
});

// Endpoint to fetch a post by ID
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Server error");
  }
});

// POST endpoint to add a new post
app.post("/api/posts", upload.array("images"), async (req, res) => {
  const { authorName, question, tags } = req.body;
  const images = req.files.map((file) => file.buffer);
  try {
    const newPost = new Post({
      authorName,
      question,
      tags: tags.split(",").map((tag) => tag.trim()),
      images,
    });
    const savedPost = await newPost.save();
    console.log("Post saved:", savedPost); // Add logging

    // Update the user's createdPosts array
    await User.findOneAndUpdate(
      { username: authorName },
      { $push: { createdPosts: savedPost._id } }
    );

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(400).send("Error saving post");
  }
});

// PUT endpoint to update a post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const { authorName, question, content, comments, tags } = req.body;
    const updateData = { authorName, question, content, comments, tags };
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    console.log("Post updated:", updatedPost); // Add logging
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(400).send("Error updating post");
  }
});

// PUT endpoint to add a comment to a post
app.put("/api/posts/:id/comments", async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (post) {
      post.comments.push(comment);
      await post.save();
      console.log("Comment added to post:", post); // Add logging
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Server error");
  }
});

// PUT endpoint to like a post
app.put("/api/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.likes += 1;
      await post.save();
      console.log("Post liked:", post); // Add logging
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).send("Server error");
  }
});

// PUT endpoint to dislike a post
app.put("/api/posts/:id/dislike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.dislikes += 1;
      await post.save();
      console.log("Post disliked:", post); // Add logging
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error("Error disliking post:", error);
    res.status(500).send("Server error");
  }
});

// PUT endpoint to flag a post
app.put("/api/posts/:id/flag", async (req, res) => {
  try {
    const { isFlagged } = req.body;
    const post = await Post.findById(req.params.id);
    if (post) {
      post.isFlagged = isFlagged;
      await post.save();
      console.log("Post flag status updated:", post); // Add logging
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error("Error updating flag status:", error);
    res.status(500).send("Server error");
  }
});

// DELETE endpoint to delete a post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    console.log("Post deleted:", req.params.id); // Add logging
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(400).send("Error deleting post");
  }
});

// Feedback model
// POST endpoint to submit feedback
app.post("/api/feedback", async (req, res) => {
  const { userId, content } = req.body;
  try {
    const feedback = new Feedback({
      user: userId,
      content,
    });
    const savedFeedback = await feedback.save();
    console.log("Feedback saved:", savedFeedback);
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(400).send("Error saving feedback");
  }
});

// GET endpoint to fetch all feedbacks
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().populate("user", "username"); // Populate user details
    res.json(feedbackList);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).send(error);
  }
});

// DELETE endpoint to delete feedback
app.delete("/api/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    console.log("Feedback deleted:", req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(400).send("Error deleting feedback");
  }
});

// jahi's server.js functions

// API Endpoints
app.get("/api/topics", async (req, res) => {
  try {
    const courses = await Course.find({}, "courseid coursename");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.get("/api/alltopics", async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.json(topics.flatMap((topic) => topic.topics));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

app.get("/api/allresources", async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(
      resources.flatMap((r) =>
        r.links.map((link) => ({ courseid: r.courseid, topic: r.topic, link }))
      )
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

app.get("/api/topics/:courseid", async (req, res) => {
  try {
    const { courseid } = req.params;
    const course = await Course.findOne({ courseid });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const topics = await Topic.findOne({ courseid });
    if (!topics) return res.status(404).json({ message: "Topics not found" });

    res.json({
      courseid: course.courseid,
      coursename: course.coursename,
      numberOfTopics: topics.topics.length,
      topics: topics.topics,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

app.get("/api/resources/:courseid/:topic", async (req, res) => {
  try {
    const { courseid, topic } = req.params;

    const resource = await Resource.findOne({ courseid, topic });
    if (!resource) {
      console.log("No resource found for:", courseid, topic);
      return res.json({ links: [] });
    }

    console.log("Resource fetched:", resource);

    const linksInfo = await LinksInfo.find({ topic });
    console.log(
      "LinksInfo fetched for topic:",
      topic,
      JSON.stringify(linksInfo, null, 2)
    );

    // Map the links with additional information
    const mappedLinks = resource.links.map((url) => {
      const linkInfo = linksInfo.find((info) => info.url === url);
      return {
        url,
        description: linkInfo ? linkInfo.description : "",
        likes: linkInfo ? linkInfo.likes : 0,
        dislikes: linkInfo ? linkInfo.dislikes : 0,
      };
    });

    // Send the combined response
    res.json({
      courseid: resource.courseid,
      topic: resource.topic,
      links: mappedLinks,
    });
  } catch (error) {
    console.error("Error fetching resource data:", error);
    res.status(500).json({ error: "Failed to fetch resource data" });
  }
});

app.get("/test-linksinfo/:topic", async (req, res) => {
  try {
    const topic = req.params.topic;
    const linksInfo = await LinksInfo.find({ topic });

    console.log("Fetched linksInfo:", linksInfo);
    res.json(linksInfo);
  } catch (error) {
    console.error("Error fetching linksInfo:", error);
    res.status(500).json({ error: "Failed to fetch linksInfo" });
  }
});

app.post("/api/resources/:courseid/:topic/like", async (req, res) => {
  try {
    const { courseid, topic } = req.params;
    const { url } = req.body;
    const linkInfo = await LinksInfo.findOneAndUpdate(
      { topic, url },
      { $inc: { likes: 1 } },
      { new: true, upsert: true }
    );
    res.json({ likes: linkInfo.likes });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Failed to update likes" });
  }
});

app.post("/api/resources/:courseid/:topic/dislike", async (req, res) => {
  try {
    const { courseid, topic } = req.params;
    const { url } = req.body;
    const linkInfo = await LinksInfo.findOneAndUpdate(
      { topic, url },
      { $inc: { dislikes: 1 } },
      { new: true, upsert: true }
    );
    res.json({ dislikes: linkInfo.dislikes });
  } catch (error) {
    console.error("Error updating dislikes:", error);
    res.status(500).json({ error: "Failed to update dislikes" });
  }
});

app.post("/api/resources/:courseid/:topic/description", async (req, res) => {
  try {
    const { courseid, topic } = req.params;
    const { url, description } = req.body;
    const linkInfo = await LinksInfo.findOneAndUpdate(
      { topic, url },
      { description },
      { new: true, upsert: true }
    );
    res.json({ description: linkInfo.description });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ error: "Failed to update description" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./profile.css";
import Post_structure from "./components/post_structure";
import "./post.css";
import { getProfile, updateBio, getCreatedPosts } from "./api"; // Import the new API method
import axios from "axios"; // Import axios for API calls

const Profile = () => {
  // State to manage bio, bookmarks, and username
  const [bio, setBio] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [username, setUsername] = useState(""); // Add state for username
  const [createdPosts, setCreatedPosts] = useState([]); // Add state for created posts

  const location = useLocation();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(location.state.username); // Use username from navigation state
        setUsername(response.data.username);
        setBio(response.data.bio || ""); // Set bio from response

        // Fetch bookmarked posts
        const bookmarkedPostsResponse = await axios.get(
          `http://localhost:5000/api/users/${location.state.username}/bookmarks`
        );
        setBookmarkedPosts(bookmarkedPostsResponse.data);

        // Fetch created posts
        const createdPostsResponse = await getCreatedPosts(
          location.state.username
        );
        console.log("Created Posts Response:", createdPostsResponse.data); // Debug log
        setCreatedPosts(createdPostsResponse.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (location.state && location.state.username) {
      fetchProfile();
    }
  }, [location.state]);

  // Handle bio update
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const saveBio = async () => {
    try {
      await updateBio(username, bio);
      alert("Bio saved!");
    } catch (error) {
      console.error("Error saving bio:", error);
      alert("Error saving bio");
    }
  };

  // Add new bookmark (for demonstration, you can replace this logic with actual bookmark management)
  const addBookmark = () => {
    const newPostId = bookmarkedPosts.length + 1;
    setBookmarkedPosts([
      ...bookmarkedPosts,
      {
        id: newPostId,
        title: `Post ${newPostId}`,
        content: `Content for Post ${newPostId}`,
        comments: [], // Ensure comments is an array
        tags: [], // Ensure tags is an array
        authorName: "",
        date: "",
        likes: 0,
        dislikes: 0,
      },
    ]);
  };

  return (
    <div className="profile-container">
      <h1>Welcome to {username}'s Profile</h1> {/* Update heading */}
      <p>This is the profile page. Customize it as needed!</p>
      {/* Bio Section */}
      <div className="bio-section">
        <h2>Your Bio</h2>
        <textarea
          value={bio}
          onChange={handleBioChange}
          placeholder="Tell us about yourself..."
          rows="5"
          cols="40"
        />
        <button onClick={saveBio} className="save-bio-button">
          Save Bio
        </button>
      </div>
      {/* Logout Link */}
      <Link to="/" className="logout-button">
        Logout
      </Link>
      {/* Bookmarked Posts Section */}
      <h2>Your Bookmarked Posts</h2>
      {bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post) => (
          <Post_structure
            key={post._id}
            post={post} // Pass the entire post object
          />
        ))
      ) : (
        <p>No bookmarks yet!</p>
      )}
      {/* Created Posts Section */}
      <h2>Your Created Posts</h2>
      {createdPosts.length > 0 ? (
        createdPosts.map((post) => (
          <Post_structure
            key={post._id}
            post={post} // Pass the entire post object
          />
        ))
      ) : (
        <p>No created posts yet!</p>
      )}
    </div>
  );
};

export default Profile;

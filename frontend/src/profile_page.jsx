import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./profile.css";
import Post_structure from "./components/post_structure";
import "./post.css";
import { getProfile, updateBio, getCreatedPosts } from "./api";
import axios from "axios";

const Profile = () => {
  const [bio, setBio] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [createdPosts, setCreatedPosts] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(location.state.username);
        setUsername(response.data.username);
        setBio(response.data.bio || "");

        const bookmarkedPostsResponse = await axios.get(
          `https://projectalexandria.onrender.com/api/users/${location.state.username}/bookmarks`
        );
        setBookmarkedPosts(bookmarkedPostsResponse.data);

        const createdPostsResponse = await getCreatedPosts(
          location.state.username
        );
        console.log("Created Posts Response:", createdPostsResponse.data);
        setCreatedPosts(createdPostsResponse.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (location.state && location.state.username) {
      fetchProfile();
    }
  }, [location.state]);

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

  const addBookmark = () => {
    const newPostId = bookmarkedPosts.length + 1;
    setBookmarkedPosts([
      ...bookmarkedPosts,
      {
        id: newPostId,
        title: `Post ${newPostId}`,
        content: `Content for Post ${newPostId}`,
        comments: [],
        tags: [],
        authorName: "",
        date: "",
        likes: 0,
        dislikes: 0,
      },
    ]);
  };

  return (
    <div className="profile-container">
      <h1>Welcome to {username}'s Profile</h1>
      <p>This is the profile page. Customize it as needed!</p>
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
      <Link to="/" className="logout-button">
        Logout
      </Link>
      <h2>Your Bookmarked Posts</h2>
      {bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post) => (
          <Post_structure
            key={post._id}
            post={post}
          />
        ))
      ) : (
        <p>No bookmarks yet!</p>
      )}
      <h2>Your Created Posts</h2>
      {createdPosts.length > 0 ? (
        createdPosts.map((post) => (
          <Post_structure
            key={post._id}
            post={post}
          />
        ))
      ) : (
        <p>No created posts yet!</p>
      )}
    </div>
  );
};

export default Profile;

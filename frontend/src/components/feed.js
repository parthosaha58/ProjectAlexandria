import React, { useState } from 'react';

const Feed = () => {
  // State to store the list of posts
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // Handle new post submission
  const handlePostSubmit = () => {
    if (newPost.trim() !== "") {
      const newPostObject = {
        id: posts.length + 1,
        content: newPost,
      };

      setPosts([...posts, newPostObject]); // Add new post to the feed
      setNewPost(""); // Clear the input field
    }
  };

  return (
    <div className="feed-container">
      <h1>Post Feed</h1>

      {/* New Post Input */}
      <div className="new-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write something..."
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      {/* Display Posts */}
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
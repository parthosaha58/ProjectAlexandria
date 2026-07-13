import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./post.css"; // Import the CSS file

function Post_structure({ post }) {
  if (!post) {
    return <div>Post data is not available.</div>;
  }

  const [isFlagged, setIsFlagged] = useState(post?.isFlagged || false); // Provide default value
  const [hasReacted, setHasReacted] = useState(false); // Tracks if the user has liked or disliked
  const [likes, setLikes] = useState(post?.likes || 0); // Provide default value
  const [dislikes, setDislikes] = useState(post?.dislikes || 0); // Provide default value
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState(""); // New state for username

  const toggleFlag = async () => {
    try {
      const updatedFlag = !isFlagged;
      await axios.put(`http://localhost:5000/api/posts/${post._id}/flag`, {
        isFlagged: updatedFlag,
      });
      setIsFlagged(updatedFlag);
    } catch (error) {
      console.error("Error updating flag status:", error);
    }
  };

  const handleLike = async () => {
    if (!hasReacted) {
      try {
        await axios.put(`http://localhost:5000/api/posts/${post._id}/like`);
        setLikes(likes + 1);
        setHasReacted(true);
      } catch (error) {
        console.error("Error liking post:", error);
      }
    }
  };

  const handleDislike = async () => {
    if (!hasReacted) {
      try {
        await axios.put(`http://localhost:5000/api/posts/${post._id}/dislike`);
        setDislikes(dislikes + 1);
        setHasReacted(true);
      } catch (error) {
        console.error("Error disliking post:", error);
      }
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/posts/${post._id}/comments`, {
        comment: newComment,
      });
      setNewComment("");
      // Update the post comments locally
      post.comments.push(newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleBookmarkSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${username}/bookmark`, {
        postId: post._id,
      });
      setUsername(""); // Clear the username input field
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  return (
    <>
      <div className="post">
        <h2 className="post-title">{post.question}</h2>
        <ul className="post-list">
          {(post.comments || []).map((comment, index) => (
            <li key={index}>
              <p className="post-content">{comment}</p>
            </li>
          ))}
          {post.images && post.images.length > 0 && (
            <div className="post-images">
              {post.images.map((image, index) => (
                <li key={index}>
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt={`Post image ${index + 1}`}
                  />
                </li>
              ))}
            </div>
          )}
        </ul>
        <div className="post-footer">
          <span className="post-author">By {post.authorName}.</span>
          <div className="tags-box">
            <span className="tags-title">Tags:</span>
            <ul className="tags-list">
              {post.tags.map((tag, index) => (
                <li key={index} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <div className="like-dislike-buttons">
            <button
              className="like-button"
              onClick={handleLike}
              disabled={hasReacted}
            >
              👍 Like {likes}
            </button>
            <button
              className="dislike-button"
              onClick={handleDislike}
              disabled={hasReacted}
            >
              👎 Dislike {dislikes}
            </button>
          </div>
          <span className="post-date">
            posted on: {new Date(post.date).toLocaleString()}
          </span>
          <button
            onClick={toggleFlag}
            className={`flag-button ${isFlagged ? "flagged" : ""}`}
          >
            {isFlagged ? "Unflag" : "Flag"}
          </button>
        </div>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={handleBookmarkSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <button type="submit">Bookmark</button>
        </form>
      </div>
    </>
  );
}

Post_structure.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.string).isRequired,
    authorName: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    likes: PropTypes.number,
    dislikes: PropTypes.number,
    date: PropTypes.string.isRequired,
    isFlagged: PropTypes.bool,
    images: PropTypes.arrayOf(PropTypes.string), // Add images prop type
  }).isRequired,
};

Post_structure.defaultProps = {
  post: {
    likes: 0,
    dislikes: 0,
    isFlagged: false,
    comments: [], // Ensure comments is an array
    tags: [], // Ensure tags is an array
    images: [], // Ensure images is an array
  },
};

export default Post_structure;

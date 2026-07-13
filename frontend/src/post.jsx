import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import "./post.css";
import LoginSignup from "./LoginSignup";
import FeedbackPage from "./feedback";
import axios from "axios";
import { createPost, getCreatedPosts } from "./api"; // Import the getCreatedPosts function

function PostPage() {
  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getCreatedPosts(username);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = [...event.target.files];
    setImages(files);
    if (files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };

  const handleRemoveImage = () => {
    setImages([]);
    setPreviewImage(null);
    document.querySelector('input[type="file"]').value = null;
  };

  const handleSubmit = async () => {
    console.log("Username submitted:", username);
    console.log("Question submitted:", question);
    console.log("Tags submitted:", tags);
    console.log("Images submitted:", images);

    try {
      const formData = new FormData();
      formData.append("authorName", username);
      formData.append("question", question);
      formData.append("tags", tags);
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await createPost(formData);

      console.log("Post submitted successfully:", response.data);
      navigate("/"); // Navigate back to home page
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <>
      <header className="header">
        <Link to="/">Project Alexandria</Link>
        <Link to="/library">Library</Link>
        <Link to="/feedback">Feedback</Link>
      </header>
      <Routes>
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/LoginSignup" element={<LoginSignup />} />
      </Routes>
      <main className="main" style={{ textAlign: "left" }}>
        <div className="post-container">
          <label>
            <h1>Ask a question</h1>
          </label>
          <label>Enter your username (can be anonymous)</label>
          <input
            type="text"
            placeholder="Enter your username (can be anonymous)..."
            value={username}
            onChange={handleUsernameChange}
          />
          <textarea
            placeholder="Write your question..."
            value={question}
            onChange={handleInputChange}
          ></textarea>
          <label>Add tags (comma separated)</label>
          <input
            type="text"
            placeholder="Add tags (comma separated)..."
            value={tags}
            onChange={handleTagsChange}
          />
          <label>Upload an image</label>
          <input type="file" multiple onChange={handleImageChange} />
          {previewImage && (
            <div className="image-preview">
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                onClick={() => window.open(previewImage, "_blank")}
              />
              <button onClick={handleRemoveImage}>Remove Image</button>
            </div>
          )}
          <button onClick={handleSubmit}>Post</button>
        </div>
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post._id} className="post-item">
              <h2>{post.question}</h2>
              <p>{post.authorName}</p>
              {post.images && post.images.length > 0 && (
                <div className="post-images">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${image}`}
                      alt={`Post image ${index + 1}`}
                      style={{ width: "100px", height: "100px" }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <p>coded by Promit, Kazi, Naziba and Hritik.</p>
      </footer>
    </>
  );
}

export default PostPage;

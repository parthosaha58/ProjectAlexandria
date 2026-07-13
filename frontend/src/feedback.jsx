import { useState, useEffect } from "react";
import axios from "axios";
import Post_structure from "./components/post_structure";
import "./Feedback.css";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [flaggedComments, setFlaggedComments] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]); // New state for flagged posts
  const [feedbackComments, setFeedbackComments] = useState({}); // New state for feedback comments

  useEffect(() => {
    // Fetch feedback list from localStorage on component mount
    const storedFeedbackList =
      JSON.parse(localStorage.getItem("feedbackList")) || [];
    setFeedbackList(storedFeedbackList);

    // Fetch flagged comments from localStorage
    const storedFlaggedComments =
      JSON.parse(localStorage.getItem("flaggedComments")) || [];
    setFlaggedComments(storedFlaggedComments);

    const handleFlaggedCommentsUpdated = (event) => {
      setFlaggedComments(event.detail);
    };

    window.addEventListener(
      "flaggedCommentsUpdated",
      handleFlaggedCommentsUpdated
    );

    // Fetch flagged posts from the server
    const fetchFlaggedPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        const flagged = response.data.filter((post) => post.isFlagged);
        setFlaggedPosts(flagged);
      } catch (error) {
        console.error("Error fetching flagged posts:", error);
      }
    };

    fetchFlaggedPosts();

    return () => {
      window.removeEventListener(
        "flaggedCommentsUpdated",
        handleFlaggedCommentsUpdated
      );
    };
  }, []);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      const updatedFeedbackList = [...feedbackList, { text: feedback }];
      setFeedbackList(updatedFeedbackList);
      localStorage.setItem("feedbackList", JSON.stringify(updatedFeedbackList)); // Save to localStorage
      setFeedback("");
    } else {
      alert("Please enter your feedback before submitting.");
    }
  };

  const handleContactModerators = () => {
    const newWindow = window.open("", "_blank", "width=400,height=400");
    newWindow.document.write(`
      <html>
        <head>
          <title>Contact Moderators</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              background-color: #f4f4f9;
              margin: 0;
              padding: 20px;
            }
            h1 {
              color: #333;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              font-size: 1.2rem;
              margin: 10px 0;
              color: #54101d;
            }
          </style>
        </head>
        <body>
          <h1>Moderators' Contact</h1>
          <ul>
            <li>1. Hrithik Saha - hrithik@gmail.com</li>
            <li>2. Promit Hasan - promit@gmail.com</li>
            <li>3. Kazi Jahid - jahid@gmail.com</li>
            <li>4. Nazima Tasnim - nazima@gmail.com</li>
          </ul>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const handleCommentChange = (feedbackIndex, comment) => {
    setFeedbackComments({
      ...feedbackComments,
      [feedbackIndex]: comment,
    });
  };

  const handleCommentSubmit = (feedbackIndex) => {
    const comment = feedbackComments[feedbackIndex];
    if (comment && comment.trim()) {
      const updatedFeedbackList = [...feedbackList];
      if (!updatedFeedbackList[feedbackIndex].comments) {
        updatedFeedbackList[feedbackIndex].comments = [];
      }
      updatedFeedbackList[feedbackIndex].comments.push(comment);
      setFeedbackList(updatedFeedbackList);
      localStorage.setItem("feedbackList", JSON.stringify(updatedFeedbackList)); // Save to localStorage
      setFeedbackComments({
        ...feedbackComments,
        [feedbackIndex]: "",
      });
    } else {
      alert("Please enter a comment before submitting.");
    }
  };

  return (
    <div className="body">
      <header className="header">
        <h1 className="headerText">Feedback Page</h1>
        <button className="contactButton" onClick={handleContactModerators}>
          Contact Moderators
        </button>
      </header>
      <div className="container">
        <div className="feedbackBox">
          <h3 className="feedbackTitle">Feedback Box</h3>
          <textarea
            className="textarea"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={handleFeedbackChange}
          />
          <button className="button" onClick={handleFeedbackSubmit}>
            Submit Feedback
          </button>
        </div>

        <div className="feedbackTable">
          <h3 className="feedbackTitle">Feedback List</h3>
          <div className="scrollableTable">
            {feedbackList.length === 0 ? (
              <p>No feedback posted yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Feedback</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.text}</td>
                      <td>
                        <ul>
                          {(item.comments || []).map((comment, idx) => (
                            <li key={idx}>
                              <span>⭐</span> {comment}
                            </li>
                          ))}
                        </ul>
                        <input
                          type="text"
                          value={feedbackComments[index] || ""}
                          onChange={(e) =>
                            handleCommentChange(index, e.target.value)
                          }
                          placeholder="Add a comment"
                        />
                        <button onClick={() => handleCommentSubmit(index)}>
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="feedbackTable">
          <h3 className="feedbackTitle">Flagged Posts</h3>
          <div className="scrollableTable">
            {flaggedPosts.length === 0 ? (
              <p style={{ marginTop: "5px" }}>None</p>
            ) : (
              flaggedPosts.map((post) => (
                <Post_structure key={post._id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const signup = (username, password) => {
  return axios.post(`${API_URL}/signup`, { username, password });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

export const getProfile = (username) => {
  return axios.get(`${API_URL}/users/${username}`);
};

export const updateBio = (username, bio) => {
  return axios.put(`${API_URL}/users/${username}/bio`, { bio });
};

export const createPost = (formData) => {
  return axios.post(`${API_URL}/posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCreatedPosts = (username) => {
  return axios.get(`${API_URL}/users/${username}/createdPosts`);
};

// ==================== FEEDBACK APIs ====================

// Submit feedback
export const submitFeedback = (userId, content) => {
  return axios.post(`${API_URL}/feedback`, { userId, content });
};

// Get all feedback
export const fetchFeedback = () => {
  return axios.get(`${API_URL}/feedback`);
};

// Delete feedback by ID
export const deleteFeedback = (id) => {
  return axios.delete(`${API_URL}/feedback/${id}`);
};

// Flag feedback by ID
export const flagFeedback = (id) => {
  return axios.post(`${API_URL}/feedback/${id}/flag`);
};

// Unflag feedback by ID
export const unflagFeedback = (id) => {
  return axios.post(`${API_URL}/feedback/${id}/unflag`);
};

// Add other API methods as needed

//jahhid's api
// api.js
export const fetchCourses = async () => {
  const response = await fetch("http://localhost:5000/api/topics");
  if (!response.ok) throw new Error("Error fetching courses");
  return response.json();
};

export const fetchAllTopics = async () => {
  const response = await fetch("http://localhost:5000/api/alltopics");
  if (!response.ok) throw new Error("Error fetching topics");
  return response.json();
};

export const fetchAllResources = async () => {
  const response = await fetch("http://localhost:5000/api/allresources");
  if (!response.ok) throw new Error("Error fetching resources");
  return response.json();
};

export const fetchCourseDetails = async (courseid) => {
  const response = await fetch(`http://localhost:5000/api/topics/${courseid}`);
  if (!response.ok) throw new Error("Error fetching course details");
  return response.json();
};

export const fetchResourcesByTopic = async (courseid, topic) => {
  const response = await fetch(
    `http://localhost:5000/api/resources/${courseid}/${encodeURIComponent(
      topic
    )}`
  );
  if (!response.ok) throw new Error("Error fetching resources for the topic");
  const data = await response.json();
  return data.links ? [{ links: data.links }] : [];
};

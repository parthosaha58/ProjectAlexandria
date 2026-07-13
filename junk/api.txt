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

// Add other API methods as needed

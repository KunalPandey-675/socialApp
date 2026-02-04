import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://socialapp-p5jk.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data)
};

// Posts API
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  createPost: (formData) => {
    return api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  addComment: (postId, text) => api.post(`/posts/${postId}/comment`, { text }),
  deletePost: (postId) => api.delete(`/posts/${postId}`)
};

export default api;

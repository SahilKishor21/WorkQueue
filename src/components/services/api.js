// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://workqueue-backend.onrender.com/api',
});

export default api;

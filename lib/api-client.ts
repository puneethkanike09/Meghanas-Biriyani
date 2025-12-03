import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://81g9vnjp-3004.inc1.devtunnels.ms/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., logging, toast notifications)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';

const API_URL = "https://gd-ets-backend.onrender.com";

function logError(error) {
  if (error.response) {
    console.error('API response error:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Error setting up request:', error.message);
  }
}

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data; // { token: '...' }
  } catch (error) {
    logError(error);
    throw error;
  }
}

export async function signupUser(name, phone, email, password, hourlyRate) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, {
      name,
      phone,
      email,
      password,
      hourlyRate,
    });
    return response.data;
  } catch (error) {
    logError(error);
    throw error;
  }
}

import axios from 'axios';
import moment from 'moment';
import Constants from 'expo-constants';

const API_URL = 'https://gd-ets-backend.onrender.com';

console.log('API_URL:', API_URL);

export async function logAttendance(employeeId, eventType, timestamp, locationName) {
  try {
    const response = await axios.post(`${API_URL}/api/log`, {
      employeeId,
      eventType,
      timestamp,
      locationName,
    });
    return response.data;
  } catch (error) {
    console.error('Attendance Log error', error.response ? error.response.data : error.message);
    throw error;
  }
}
export async function getTodayAttendance(employeeId, token) {
  try {
    const todayDate = moment().format('YYYY-MM-DD');
    const response = await axios.get(`${API_URL}/api/today`, {
      params: { employeeId, date: todayDate },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Fetch Attendance error', error.response ? error.response.data : error.message);
    throw error;
  }
}

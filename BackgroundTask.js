// BackgroundTask.js

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Task error:', error);
    return;
  }

  const token = await AsyncStorage.getItem('token');
  const employeeId = await AsyncStorage.getItem('employeeId');
  if (!token || !employeeId) return;

  const { locations } = data;
  if (!locations || locations.length === 0) return;

  const coords = locations[0].coords;
  console.log('📍 Background location:', coords);

  try {
    await axios.post('https://gd-ets-backend.onrender.com/api/location/update', {
      employeeId,
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: new Date().toISOString()
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Location update failed:', err.message);
  }
});

export const LOCATION_TASK_NAME_EXPORT = LOCATION_TASK_NAME;

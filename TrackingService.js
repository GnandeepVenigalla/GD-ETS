// TrackingService.js
import * as Location from 'expo-location';
import { sendLocalNotification } from './NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

let locationSubscription = null;
let insideOffice = false;
let entryTimestamp = null;
let exitTimestamp = null;

const OFFICE_RADIUS_METERS = 100; // Example radius
const BASE_URL = "https://gd-ets-backend.onrender.com";



const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of the earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      (1 - Math.cos(dLon))) /
      2;

  return R * 2 * Math.asin(Math.sqrt(a));
};

export const startLocationTracking = async (officeLocation) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  locationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000, // 10 seconds
      distanceInterval: 10, // 10 meters
    },
    async (location) => {
      const { latitude, longitude } = location.coords;
      const distance = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        officeLocation.latitude,
        officeLocation.longitude
      );

      if (distance <= OFFICE_RADIUS_METERS) {
        if (!insideOffice) {
          insideOffice = true;
          entryTimestamp = new Date();
          sendLocalNotification(
            'Entered Office',
            `You entered the office at ${entryTimestamp.toLocaleTimeString()}`
          );
        } else {
          const now = new Date();
          const duration = (now - entryTimestamp) / 60000; // in minutes
          if (duration >= 20) {
            // Mark login
            await markAttendance('login', entryTimestamp);
            entryTimestamp = null; // Reset to prevent multiple logins
          }
        }
      } else {
        if (insideOffice) {
          insideOffice = false;
          exitTimestamp = new Date();
          sendLocalNotification(
            'Exited Office',
            `You exited the office at ${exitTimestamp.toLocaleTimeString()}`
          );
        } else {
          const now = new Date();
          const duration = (now - exitTimestamp) / 60000; // in minutes
          if (duration >= 10) {
            // Mark logout
            await markAttendance('logout', exitTimestamp);
            exitTimestamp = null; // Reset to prevent multiple logouts
          }
        }
      }
    }
  );
};

export const stopLocationTracking = () => {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }
};

const markAttendance = async (type, timestamp) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const employeeId = await AsyncStorage.getItem('employeeId');
    const date = new Date().toISOString().split('T')[0];
    const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await axios.post(
      `${BASE_URL}/api/attendance/log`,
      {
        employeeId,
        date,
        [`${type}Time`]: time,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(`${type} time marked at ${time}`);
  } catch (error) {
    console.error(`Failed to mark ${type}:`, error);
  }
};

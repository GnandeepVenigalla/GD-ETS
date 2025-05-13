import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment-timezone';
import { getTodayAttendance } from '../services/attendanceService';
import Constants from 'expo-constants';

const BASE_URL = process.env.REACT_APP_API_URL;

export default function HomeScreen({ navigation }) {
  const [officeName, setOfficeName] = useState('Loading...');
  const [officeTime, setOfficeTime] = useState('');
  const [officeTimezone, setOfficeTimezone] = useState('');
  const [todayHours, setTodayHours] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const employeeId = await AsyncStorage.getItem('employeeId');

      if (!token) {
        Alert.alert('Authentication Error', 'No token found, please login again.');
        setLoading(false);
        return;
      }

      // Fetch user profile
      const profileRes = await axios.get(`${BASE_URL}/api/employee/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { employeeId }
      });
      const office = profileRes.data.workplaces[0];
      if (!office) {
        Alert.alert('No Office Set', 'Please set your workplace location in settings.');
        setLoading(false);
        return;
      }

      const { latitude, longitude, locationName } = office;
      setOfficeName(locationName);

      const timestamp = Math.floor(Date.now() / 1000); // current time in seconds
      const googleKey = (process.env.Google_APT_KEY); // ⬅️ Replace with your actual Google API key

      const timeRes = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${googleKey}`
      );

      const timezone = timeRes.data.timeZoneId || 'UTC';
      setOfficeTimezone(timezone);
      setOfficeTime(moment().tz(timezone).format('hh:mm A'));

      // Fetch today's attendance using attendanceService with token
      const data = await getTodayAttendance(employeeId, token);

      setTodayHours(data.totalHoursWorked || 0);
      setTodayEarnings(data.earnedToday || 0);
    } catch (err) {
      console.error('Home screen error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to load home data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#004aad" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Office: {officeName}</Text>
      <Text style={styles.subHeader}>Time: {officeTime} ({officeTimezone})</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Hours</Text>
        <Text style={styles.cardValue}>{todayHours} hrs</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Earnings</Text>
        <Text style={styles.cardValue}>${todayEarnings.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tracking')}>
        <Text style={styles.buttonText}>Track Location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Attendance')}>
        <Text style={styles.buttonText}>View Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f6f9ff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 16, marginBottom: 20 },
  card: {
    backgroundColor: '#e6f0ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardValue: { fontSize: 16, marginTop: 5 },
  button: {
    backgroundColor: '#004aad',
    padding: 15,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

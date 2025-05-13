import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = process.env.REACT_APP_API_URL;

export default function AttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/attendance/data`);
      setAttendanceData(res.data);
    } catch (error) {
      console.error('Attendance data fetch error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load attendance data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Data</Text>
      {attendanceData ? (
        <Text>{JSON.stringify(attendanceData)}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

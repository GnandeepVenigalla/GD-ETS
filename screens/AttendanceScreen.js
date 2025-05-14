import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';

const BASE_URL = 'https://gd-ets-backend.onrender.com';


export default function AttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchAllAttendance(today);
  }, []);

  const fetchAllAttendance = async (defaultDate = null) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const employeeId = await AsyncStorage.getItem('employeeId');
  
      const res = await axios.get(`${BASE_URL}/api/attendance/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { employeeId }
      });
  
      const markedDates = {};
      const dayMap = {};
  
      res.data.forEach(entry => {
        markedDates[entry.date] = {
          marked: true,
          dotColor: 'blue'
        };
        dayMap[entry.date] = entry;
      });
  
      setAttendanceData({ markedDates, dayMap });
  
      if (defaultDate && dayMap[defaultDate]) {
        setSelectedEntry(dayMap[defaultDate]);
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
      Alert.alert('Error', 'Could not fetch attendance.');
    }
  };

  const handleDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
    const entry = attendanceData.dayMap?.[date];
    setSelectedEntry(entry || null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance History</Text>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...attendanceData.markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: 'skyblue',
            ...attendanceData.markedDates?.[selectedDate]
          }
        }}
        style={styles.calendar}
        theme={{
          todayTextColor: 'red',
          arrowColor: 'blue'
        }}
      />

      <View style={styles.entryCard}>
        <Text style={styles.date}>Date: {selectedDate}</Text>
        {selectedEntry ? (
          <>
            <Text style={styles.info}>Login Time: {selectedEntry.loginTime || '--:--'}</Text>
            <Text style={styles.info}>Logout Time: {selectedEntry.logoutTime || '--:--'}</Text>
            <Text style={styles.info}>Hours Worked: {selectedEntry.totalHoursWorked || 0} hrs</Text>
            <Text style={styles.info}>Earnings: ${selectedEntry.earnedToday?.toFixed(2) || 0}</Text>
          </>
        ) : (
          <Text style={styles.info}>No attendance data available</Text>
        )}
      </View>

      {/* Placeholder: Calendar sync (Google/Microsoft) */}
      <Button
        title="Sync Google/Microsoft Calendar (Coming Soon)"
        onPress={() => Alert.alert('Info', 'This feature will be available soon')}
        color="blue"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20
  },
  entryCard: {
    padding: 15,
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    marginBottom: 20
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  info: {
    fontSize: 16,
    marginBottom: 5
  }
});
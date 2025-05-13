import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = process.env.REACT_APP_API_URL;

export default function TrackingScreen() {
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const fetchTrackingData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tracking/data`);
      setTrackingData(res.data);
    } catch (error) {
      console.error('Tracking data fetch error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load tracking data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tracking Data</Text>
      {trackingData ? (
        <Text>{JSON.stringify(trackingData)}</Text>
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

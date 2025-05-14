import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Vibration, Platform } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';

const BASE_URL = 'https://gd-ets-backend.onrender.com';

export default function TrackingScreen() {
  const [location, setLocation] = useState(null);
  const [office, setOffice] = useState(null);
  const [insideOffice, setInsideOffice] = useState(false);
  const [status, setStatus] = useState('Checking location...');
  const [loading, setLoading] = useState(true);
  const entryTimer = useRef(null);
  const exitTimer = useRef(null);

  useEffect(() => {
    loadOfficeLocation();
    const interval = setInterval(trackLocation, 10000); // Every 10s
    return () => {
      clearInterval(interval);
      clearTimeout(entryTimer.current);
      clearTimeout(exitTimer.current);
    };
  }, []);

  const loadOfficeLocation = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const employeeId = await AsyncStorage.getItem('employeeId');
      const res = await axios.get(`${BASE_URL}/api/employee/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { employeeId }
      });

      const workplace = res.data.workplaces[0];
      if (!workplace) throw new Error('No workplace set');
      setOffice(workplace);
    } catch (err) {
      Alert.alert('Error', 'Failed to load office location');
    } finally {
      setLoading(false);
    }
  };

  const trackLocation = async () => {
    try {
      let { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== 'granted') {
        Alert.alert('Location permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      if (!office) return;

      const distance = getDistance(
        loc.coords.latitude, loc.coords.longitude,
        office.latitude, office.longitude
      );

      if (distance <= office.radiusMeters) {
        setStatus('Inside office');
        if (!insideOffice) {
          setInsideOffice(true);
          clearTimeout(exitTimer.current);
          entryTimer.current = setTimeout(() => {
            markLogin();
          }, 20 * 60 * 1000); // 20 mins
        }
      } else {
        setStatus('Outside office');
        if (insideOffice) {
          setInsideOffice(false);
          clearTimeout(entryTimer.current);
          exitTimer.current = setTimeout(() => {
            markLogout();
          }, 10 * 60 * 1000); // 10 mins
        }
      }
    } catch (err) {
      console.error('Location tracking error:', err.message);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI/180;
    const dLon = (lon2 - lon1) * Math.PI/180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const markLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const employeeId = await AsyncStorage.getItem('employeeId');
      const today = new Date().toISOString().split('T')[0];
      const loginTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await axios.post(`${BASE_URL}/api/attendance/log`, {
        employeeId,
        date: today,
        loginTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Logged In',
          body: `You entered office at ${loginTime}`,
          sound: true
        },
        trigger: null
      });

      if (Platform.OS === 'android') Vibration.vibrate();
    } catch (err) {
      console.error(err.message);
    }
  };

  const markLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const employeeId = await AsyncStorage.getItem('employeeId');
      const today = new Date().toISOString().split('T')[0];
      const logoutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await axios.post(`${BASE_URL}/api/attendance/log`, {
        employeeId,
        date: today,
        logoutTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Notifications.scheduleNotificationAsync({
        content: {
          title: '🚪 Logged Out',
          body: `You left office at ${logoutTime}`,
          sound: true
        },
        trigger: null
      });

      if (Platform.OS === 'android') Vibration.vibrate();
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading || !office) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#004aad" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
        >
          <Marker coordinate={{ latitude: office.latitude, longitude: office.longitude }} title="Office" />
          <Circle
            center={{ latitude: office.latitude, longitude: office.longitude }}
            radius={office.radiusMeters}
            strokeColor="rgba(0,0,255,0.5)"
            fillColor="rgba(0,0,255,0.2)"
          />
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You"
            pinColor="green"
          />
        </MapView>
      )}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  statusBox: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center'
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004aad'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
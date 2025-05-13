import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = process.env.REACT_APP_API_URL;

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const employeeId = await AsyncStorage.getItem('employeeId');
  
      const res = await axios.get(`${BASE_URL}/api/employee/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { employeeId }
      });
  
      if (res.data) {
        const { name, phone, address } = res.data;
        setProfile({ name: name || '', phone: phone || '', address: address || '' });
      }
    } catch (err) {
      console.error('Profile fetch error:', err.message);
      Alert.alert('Error', 'Could not load profile data.');
    }
  };  

  const handleUpdate = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty');
      return;
    }
    if (!profile.phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const employeeId = await AsyncStorage.getItem('employeeId');

      await axios.put(`${BASE_URL}/api/employee/updateProfile`, {
        employeeId,
        ...profile
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Updated', 'Profile info saved!');
    } catch (err) {
      console.error('Profile update error:', err.message);
      Alert.alert('Error', 'Could not update profile info.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Profile Info</Text>

      <TextInput
        placeholder="Name"
        value={profile.name}
        onChangeText={(val) => setProfile({ ...profile, name: val })}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={profile.phone}
        onChangeText={(val) => setProfile({ ...profile, phone: val })}
        style={styles.input}
      />
      <TextInput
        placeholder="Home Address"
        value={profile.address}
        onChangeText={(val) => setProfile({ ...profile, address: val })}
        style={styles.input}
      />

      <Button title="Save Profile" onPress={handleUpdate} />
      <View style={{ marginVertical: 20 }} />
      <Button title="Update Office Location" onPress={() => navigation.navigate('SelectLocation')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6
  }
});

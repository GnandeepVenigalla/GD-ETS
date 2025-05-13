import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = process.env.REACT_APP_API_URL;

export default function SelectLocationScreen({ navigation }) {
  const [employeeId, setEmployeeId] = useState('');
  const [workplace, setWorkplace] = useState(null);

  const updateWorkplace = async () => {
    try {
      await axios.post(`${BASE_URL}/api/employee/updateWorkplace`, {
        employeeId,
        workplace,
      });
      Alert.alert('Success', 'Workplace updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Update workplace error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update workplace');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Location</Text>
      {/* UI for selecting location */}
      <Button title="Update Workplace" onPress={updateWorkplace} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

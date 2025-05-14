import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', email, password);
      const data = await loginUser(email, password);
      console.log('Login response:', data);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('employeeId', data.employeeId);
      console.log('Stored token and employeeId, navigating to Home');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      if (err.response) {
        console.error('Login error response:', err.response.data);
        alert(`Login Failed: ${err.response.data.message || 'Please check your credentials.'}`);
      } else if (err.request) {
        console.error('Login error request:', err.request);
        alert('Login Failed: No response from server. Please check your network connection.');
      } else {
        console.error('Login error:', err.message);
        alert('Login Failed. Please check your credentials.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>GD ETS</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#f6f9ff'
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#1e3a8a'
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  linkText: {
    marginTop: 20,
    color: '#1e3a8a',
    textAlign: 'center'
  }
});

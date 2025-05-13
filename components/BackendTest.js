import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const API_URL = Constants.manifest?.extra?.apiUrl || Constants.expoConfig?.extra?.apiUrl || 'https://gd-ets-backend.onrender.com';

export default function BackendTest() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const testBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/api/status`);
      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unknown error');
      setResponse(null);
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Test</Text>
      {response && <Text style={styles.response}>Response: {JSON.stringify(response)}</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      <Button title="Test Backend Again" onPress={testBackend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  response: { color: 'green', marginBottom: 20 },
  error: { color: 'red', marginBottom: 20 },
});

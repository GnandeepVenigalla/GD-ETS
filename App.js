import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import TrackingScreen from './screens/TrackingScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ProfileScreen from './screens/ProfileScreen';
import SelectLocationScreen from './screens/SelectLocationScreen';
import BackendTest from './components/BackendTest';
import { LOCATION_TASK_NAME_EXPORT } from './BackgroundTask';
import { useEffect } from 'react';

const Stack = createStackNavigator();

export default function App() {

  useEffect(() => {
    startBackgroundLocation();
  }, []);

  const startBackgroundLocation = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Background location permission not granted');
      return;
    }

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME_EXPORT);
    if (!hasStarted) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME_EXPORT, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 50,
        timeInterval: 60000,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Tracking location",
          notificationBody: "Enabled while you work",
        }
      });
      console.log('✅ Background tracking started');
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SelectLocation" component={SelectLocationScreen} />
        <Stack.Screen name="BackendTest" component={BackendTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

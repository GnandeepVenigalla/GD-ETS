// NotificationService.js
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

export const configureNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('Notification received:', notification);
    },
    requestPermissions: Platform.OS === 'ios',
  });

  PushNotification.createChannel(
    {
      channelId: 'office-events', // (required)
      channelName: 'Office Events', // (required)
      importance: 4, // Max importance
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );
};

export const sendLocalNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'office-events',
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    vibrate: true,
    vibration: 300,
  });
};

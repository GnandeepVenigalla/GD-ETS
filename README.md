# GD Employee Tracking System

## Overview
GD Employee Tracking System is a React Native mobile application built with Expo that enables employee attendance tracking using location services. The app automatically tracks employees' presence within a defined office radius and logs attendance events such as login and logout based on their location.

## Features
- User authentication with login and signup functionality.
- Background and foreground location tracking using Expo Location and TaskManager.
- Automatic attendance marking based on office location entry and exit.
- Local notifications to inform users when they enter or exit the office.
- Multiple screens for user interaction including Login, Signup, Home, Tracking, Attendance, Profile, and Location selection.
- Communication with a backend API for secure data management.

## Workflow
1. User logs in or signs up to the app.
2. The app requests background location permissions and starts background location tracking.
3. Foreground tracking monitors the user's location relative to the office radius.
4. When the user enters the office area, a local notification is sent, and attendance login time is marked after a defined duration.
5. When the user exits the office area, a local notification is sent, and attendance logout time is marked after a defined duration.
6. Location updates and attendance logs are sent securely to the backend API.

## Technologies Used
- React Native with Expo framework.
- React Navigation for screen management.
- Expo Location and TaskManager APIs for background and foreground location tracking.
- Axios for HTTP communication with the backend API.
- AsyncStorage for local data storage.
- Moment.js for date and time formatting.

## How to Build and Run
### Prerequisites
- Node.js installed on your machine.
- Expo CLI installed globally (`npm install -g expo-cli`).
- A physical device or emulator/simulator for running the app.

### Installation
1. Clone the repository.
2. Navigate to the `my-gd-ets-app` directory.
3. Run `npm install` to install dependencies.
4. Run `expo start` to start the development server.
5. Use the Expo Go app on your device or an emulator to run the app.

## Configuration
- The backend API URL is configured in `app.json` under the `extra.apiUrl` property.
- Location tracking settings such as accuracy, distance intervals, and time intervals are configured in the app's source code.

## Folder Structure (Brief)
- `App.js`: Main app component and navigation setup.
- `screens/`: Contains all screen components for the app.
- `services/`: API service modules for attendance and authentication.
- `components/`: Reusable UI components.
- `BackgroundTask.js`: Background location tracking task definition.
- `TrackingService.js`: Foreground location tracking and attendance logic.

## License
This project is licensed under the MIT License.

## Picture 
![image]([https://user-images.githubusercontent.com/104444/144111111-5a4a8d3f-8a4f-4a3f-9a4f-8a4f-5a4f.png](https://github.com/GnandeepVenigalla/GD-ETS/blob/main/assets/6D44DC9B-A300-4762-89A1-1C9F11166EBA.png))

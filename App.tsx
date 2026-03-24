import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import AppNavigator from './src/navigation/AppNavigator';
import OfflineBanner from './src/components/ui/OfflineBanner';
import client from './src/api/client';
import type { RootStackParamList } from './src/types';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      setIsAuthenticated(!!token);
      setCheckingAuth(false);
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    registerForPushNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (!navigationRef.current) return;

      if (data?.type === 'chat' && data?.userId) {
        navigationRef.current.navigate('Chat', {
          userId: data.userId as string,
          clientName: (data.clientName as string) || null,
          channel: (data.channel as string) || 'whatsapp',
        });
      } else if (data?.type === 'visit' && data?.visit) {
        navigationRef.current.navigate('VisitDetail', { visit: data.visit as any });
      }
    });

    return () => subscription.remove();
  }, []);

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) return;
    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      await client.post('/push-token', {
        token: tokenData.data,
        platform: Platform.OS,
      }).catch(() => {});

      await SecureStore.setItemAsync('push_enabled', 'true');
    } catch (error) {
      console.error('Push registration failed:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <GestureHandlerRootView style={styles.flex}>
        <StatusBar style="dark" />
        <OfflineBanner />
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="dark" />
        <OfflineBanner />
        <AppNavigator onLogout={handleLogout} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

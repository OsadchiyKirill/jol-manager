import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import TodayScreen from '../screens/TodayScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import DialogsScreen from '../screens/DialogsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';
import VisitDetailScreen from '../screens/VisitDetailScreen';
import { COLORS, TYPOGRAPHY } from '../utils/colors';
import client from '../api/client';
import type { RootStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Today: { active: 'home', inactive: 'home-outline' },
  Schedule: { active: 'calendar', inactive: 'calendar-outline' },
  Dialogs: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Settings: { active: 'person', inactive: 'person-outline' },
};

function TabNavigator({ onLogout }: { onLogout: () => void }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await client.get('/conversations');
        const convs = Array.isArray(res.data) ? res.data : [];
        const total = convs.reduce((acc: number, c: any) => acc + (c.unread_count || 0), 0);
        setUnreadCount(total);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons?.active : icons?.inactive;
          return <Ionicons name={iconName || 'help'} size={22} color={color} />;
        },
        tabBarActiveTintColor: COLORS.coral,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 0.5,
          paddingBottom: 28,
          height: 83,
        },
        tabBarLabelStyle: { ...TYPOGRAPHY.label, marginTop: 2 },
        tabBarHideOnKeyboard: true,
        headerStyle: {
          backgroundColor: COLORS.surface,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { ...TYPOGRAPHY.h3 },
      })}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{ title: 'Сьогодні' }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ title: 'Розклад' }}
      />
      <Tab.Screen
        name="Dialogs"
        component={DialogsScreen}
        options={{
          title: 'Діалоги',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.coral,
            ...TYPOGRAPHY.label,
            color: '#fff',
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        options={{ title: 'Налаштування' }}
      >
        {() => <SettingsScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { ...TYPOGRAPHY.h3 },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => <TabNavigator onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Чат' }}
      />
      <Stack.Screen
        name="VisitDetail"
        component={VisitDetailScreen}
        options={{ title: 'Деталі запису' }}
      />
    </Stack.Navigator>
  );
}

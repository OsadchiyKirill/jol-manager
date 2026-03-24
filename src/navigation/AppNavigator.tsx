import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodayScreen from '../screens/TodayScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import DialogsScreen from '../screens/DialogsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';
import VisitDetailScreen from '../screens/VisitDetailScreen';
import { TodayIcon, ScheduleIcon, DialogsIcon, SettingsIcon } from '../components/ui/TabIcons';
import { COLORS, TYPOGRAPHY } from '../utils/colors';
import client from '../api/client';
import type { RootStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
      screenOptions={{
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
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          title: 'Сьогодні',
          tabBarIcon: ({ color }) => <TodayIcon color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Розклад',
          tabBarIcon: ({ color }) => <ScheduleIcon color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Dialogs"
        component={DialogsScreen}
        options={{
          title: 'Діалоги',
          tabBarIcon: ({ color }) => <DialogsIcon color={color} size={24} />,
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
        options={{
          title: 'Налаштування',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={24} />,
        }}
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

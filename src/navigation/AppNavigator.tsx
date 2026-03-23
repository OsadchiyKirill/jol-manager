import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import TodayScreen from '../screens/TodayScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import DialogsScreen from '../screens/DialogsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    today: '🏠',
    schedule: '📅',
    dialogs: '💬',
  };
  return <Text style={{ fontSize: 22 }}>{icons[name] || '•'}</Text>;
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#8b7355',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0d6cc',
        },
        headerStyle: {
          backgroundColor: '#f8f4f0',
        },
        headerTintColor: '#2c2c2c',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          title: 'Сьогодні',
          tabBarIcon: ({ color }) => <TabIcon name="today" color={color} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Розклад',
          tabBarIcon: ({ color }) => <TabIcon name="schedule" color={color} />,
        }}
      />
      <Tab.Screen
        name="Dialogs"
        component={DialogsScreen}
        options={{
          title: 'Діалоги',
          tabBarIcon: ({ color }) => <TabIcon name="dialogs" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

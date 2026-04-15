import { Tabs } from 'expo-router';
import { FlaskConical, Home, TrendingUp, User } from 'lucide-react-native';
import React, { useEffect } from 'react';

import { useAuthStore } from '@/stores/useAuthStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { colors } from '@/theme';

export default function TabsLayout() {
  const user = useAuthStore((s) => s.user);
  const fetchCheckins = useProgressStore((s) => s.fetchCheckins);

  useEffect(() => {
    if (user) {
      void fetchCheckins(user.id);
    }
  }, [user, fetchCheckins]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.neutral[200],
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="simulator"
        options={{
          title: 'Meu Mix',
          tabBarIcon: ({ color, size }) => (
            <FlaskConical color={color} size={size} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Evolução',
          tabBarIcon: ({ color, size }) => (
            <TrendingUp color={color} size={size} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={1.75} />,
        }}
      />
    </Tabs>
  );
}

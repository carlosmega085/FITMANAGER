import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.borderLight,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

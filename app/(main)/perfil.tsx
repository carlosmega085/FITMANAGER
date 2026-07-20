import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { colors, spacing, borderRadius } from '@/constants/colors';

export default function PerfilScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.substring(0, 2).toUpperCase() || 'FM'} 
            style={{ backgroundColor: colors.primary }}
            color={colors.background}
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{user?.name || 'Usuario'}</Text>
          
          <Text style={styles.label}>Usuario (Login)</Text>
          <Text style={styles.value}>{user?.username || '---'}</Text>
          
          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{user?.roles?.join(', ') || '---'}</Text>
        </View>

        <Button 
          mode="outlined" 
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={colors.error}
          buttonColor="transparent"
          icon="logout"
        >
          Cerrar Sesión
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatarContainer: {
    marginBottom: spacing.xl,
  },
  infoContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 12,
    color: colors.subtext,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  logoutButton: {
    width: '100%',
    borderColor: colors.error,
  },
});

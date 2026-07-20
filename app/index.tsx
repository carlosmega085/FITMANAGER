import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/constants/colors';

/**
 * Pantalla de splash/redirect.
 * Evalúa el estado de autenticación y redirige según rol:
 * - No autenticado → (auth)/login
 * - Admin → (admin)/dashboard
 * - Vendedor → (vendedor)/venta
 */
export default function IndexScreen() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    // Redirigir a main (Escáner/Historial)
    router.replace('/(main)');
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/constants/colors';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Prevenir que el splash se oculte automáticamente al arrancar
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { restoreSession, isLoading } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Ocultar el splash screen una vez que la sesión esté lista
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Mientras está cargando, no renderizamos el árbol de componentes principal
  // El SplashScreen de Expo se mantendrá visible
  if (isLoading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      />
    </QueryClientProvider>
  );
}

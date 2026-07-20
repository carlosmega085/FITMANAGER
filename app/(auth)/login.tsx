import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { colors, spacing, borderRadius } from '@/constants/colors';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña.');
      return;
    }

    setLoading(true);
    try {
      await login({ username, password });
      router.replace('/(main)');
    } catch (error: any) {
      const isNetworkError = error.message === 'Ocurrió un error inesperado' || error.message.toLowerCase().includes('network');
      const title = isNetworkError ? 'Error de Conexión' : 'Acceso Denegado';
      Alert.alert(title, error.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>FitManager</Text>
            <Text style={styles.subtitle}>Validación de Accesos</Text>
          </View>

          <TextInput
            mode="outlined"
            label="Usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            theme={{ colors: { background: colors.cardHover, onSurfaceVariant: colors.subtext } }}
            left={<TextInput.Icon icon="account" color={colors.subtext} />}
          />

          <TextInput
            mode="outlined"
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            theme={{ colors: { background: colors.cardHover, onSurfaceVariant: colors.subtext } }}
            left={<TextInput.Icon icon="lock" color={colors.subtext} />}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={loading}
            style={styles.button}
            buttonColor={colors.primary}
            textColor={colors.background}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {loading ? <ActivityIndicator color={colors.background} /> : 'INGRESAR'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  formContainer: {
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.cardHover,
  },
  button: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

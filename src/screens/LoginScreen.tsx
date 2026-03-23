import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import client from '../api/client';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [canUseFaceId, setCanUseFaceId] = useState(false);

  useEffect(() => {
    checkFaceId();
  }, []);

  const checkFaceId = async () => {
    const faceIdEnabled = await SecureStore.getItemAsync('faceid_enabled');
    const token = await SecureStore.getItemAsync('auth_token');
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setCanUseFaceId(faceIdEnabled === 'true' && !!token && hasHardware && isEnrolled);
  };

  const handleFaceIdLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Увійти в JOL Manager',
        cancelLabel: 'Скасувати',
        disableDeviceFallback: false,
      });
      if (result.success) {
        onLoginSuccess();
      }
    } catch (error) {
      Alert.alert('Помилка', 'Face ID не вдалося');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Помилка', 'Введіть email та пароль');
      return;
    }

    setLoading(true);
    try {
      const response = await client.post('/auth/login', { email, password });
      const { token } = response.data;
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_email', email);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const faceIdEnabled = await SecureStore.getItemAsync('faceid_enabled');

      if (hasHardware && isEnrolled && faceIdEnabled !== 'true') {
        Alert.alert(
          'Face ID',
          'Увійти через Face ID наступного разу?',
          [
            { text: 'Ні', style: 'cancel' },
            {
              text: 'Так',
              onPress: () => SecureStore.setItemAsync('faceid_enabled', 'true'),
            },
          ]
        );
      }

      onLoginSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Невірний email або пароль';
      Alert.alert('Помилка входу', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>JOL Beauty</Text>
        <Text style={styles.subtitle}>Менеджер</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.textTertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor={COLORS.textTertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Увійти</Text>
          )}
        </TouchableOpacity>

        {canUseFaceId && (
          <TouchableOpacity style={styles.faceIdBtn} onPress={handleFaceIdLogin}>
            <Ionicons name="finger-print" size={28} color={COLORS.purple} />
            <Text style={styles.faceIdText}>Увійти через Face ID</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.coral,
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  button: {
    backgroundColor: COLORS.coral,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.sm,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  faceIdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xxl,
    paddingVertical: SPACING.lg,
  },
  faceIdText: {
    ...TYPOGRAPHY.body,
    color: COLORS.purple,
    fontWeight: '500',
  },
});

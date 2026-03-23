import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import * as LocalAuthentication from 'expo-local-authentication';
import Avatar from '../components/Avatar';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';

interface SettingsScreenProps {
  onLogout: () => void;
}

export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const [email, setEmail] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedEmail = await SecureStore.getItemAsync('user_email');
      if (storedEmail) setEmail(storedEmail);

      const pushPref = await SecureStore.getItemAsync('push_enabled');
      setPushEnabled(pushPref === 'true');

      const faceIdPref = await SecureStore.getItemAsync('faceid_enabled');
      setFaceIdEnabled(faceIdPref === 'true');

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setFaceIdAvailable(hasHardware && isEnrolled);
    };
    loadSettings();
  }, []);

  const togglePush = async (value: boolean) => {
    setPushEnabled(value);
    await SecureStore.setItemAsync('push_enabled', String(value));
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        setPushEnabled(false);
        await SecureStore.setItemAsync('push_enabled', 'false');
        Alert.alert('Дозвіл відхилено', 'Увімкніть сповіщення в налаштуваннях iPhone');
      }
    }
  };

  const toggleFaceId = async (value: boolean) => {
    setFaceIdEnabled(value);
    await SecureStore.setItemAsync('faceid_enabled', String(value));
  };

  const handleLogout = () => {
    Alert.alert('Вийти?', 'Ви впевнені що хочете вийти з акаунту?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Вийти',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('auth_token');
          await SecureStore.deleteItemAsync('user_email');
          await Notifications.setBadgeCountAsync(0);
          onLogout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileSection}>
        <Avatar name={email} size={64} />
        <Text style={styles.email}>{email || 'manager@jol.beauty'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Налаштування</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.coral} />
            <Text style={styles.settingLabel}>Push-сповіщення</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={togglePush}
            trackColor={{ false: COLORS.border, true: COLORS.coral }}
            thumbColor="#fff"
          />
        </View>

        {faceIdAvailable && (
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="finger-print-outline" size={22} color={COLORS.purple} />
              <Text style={styles.settingLabel}>Face ID</Text>
            </View>
            <Switch
              value={faceIdEnabled}
              onValueChange={toggleFaceId}
              trackColor={{ false: COLORS.border, true: COLORS.purple }}
              thumbColor="#fff"
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Про додаток</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Версія</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Розробник</Text>
          <Text style={styles.infoValue}>T10 Solutions</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>Вийти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  email: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.md,
  },
  logoutText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.danger,
  },
});

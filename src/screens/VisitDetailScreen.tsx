import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Badge from '../components/Badge';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';
import type { RootStackParamList } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDetail'>;

const STATUS_LABELS: Record<string, { label: string; type: 'default' | 'new' | 'vip' | 'admin' | 'mila' }> = {
  '1': { label: 'Підтверджено', type: 'mila' },
  '2': { label: 'Клієнт прийшов', type: 'new' },
  '3': { label: 'Завершено', type: 'default' },
  '4': { label: 'Скасовано', type: 'admin' },
  '5': { label: 'Не прийшов', type: 'admin' },
  confirmed: { label: 'Підтверджено', type: 'mila' },
  completed: { label: 'Завершено', type: 'default' },
  cancelled: { label: 'Скасовано', type: 'admin' },
  pending: { label: 'Очікує', type: 'default' },
};

export default function VisitDetailScreen({ route }: Props) {
  const { visit } = route.params;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, duration: 250, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 250, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const callClient = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (visit.client_phone) {
      Linking.openURL(`tel:${visit.client_phone}`);
    }
  };

  const isNew = visit.client_vizits === 0;
  const statusInfo = STATUS_LABELS[visit.status] || { label: visit.status, type: 'default' as const };

  const endTime = (() => {
    if (!visit.time || !visit.duration) return null;
    const [h, m] = visit.time.split(':').map(Number);
    const total = h * 60 + m + visit.duration;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  })();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.timeSection}>
          <Ionicons name="time-outline" size={24} color={COLORS.coral} />
          <Text style={styles.timeText}>
            {visit.time}{endTime ? ` — ${endTime}` : ''}
          </Text>
          {visit.duration > 0 && (
            <Text style={styles.durationText}>{visit.duration} хв</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Клієнт</Text>
          <View style={styles.clientRow}>
            <Text style={styles.clientName}>{visit.client_name}</Text>
            {isNew && <Badge label="NEW" type="new" />}
            {visit.client_vizits > 5 && <Badge label="VIP" type="vip" />}
          </View>
          {visit.client_phone ? (
            <TouchableOpacity onPress={callClient} style={styles.phoneRow}>
              <Ionicons name="call-outline" size={18} color={COLORS.coral} />
              <Text style={styles.phoneText}>{visit.client_phone}</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.vizitsText}>
            {visit.client_vizits === 0
              ? 'Перший візит'
              : `${visit.client_vizits} візитів`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Послуга</Text>
          <Text style={styles.serviceName}>{visit.service_name}</Text>
          <View style={styles.serviceDetails}>
            {visit.duration > 0 && (
              <Text style={styles.serviceDetail}>⏱ {visit.duration} хв</Text>
            )}
            {visit.total > 0 && (
              <Text style={styles.serviceDetail}>💰 {visit.total}€</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Майстер</Text>
          <Text style={styles.masterName}>{visit.master_name_ua}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Статус</Text>
          <Badge label={statusInfo.label} type={statusInfo.type} />
        </View>
      </ScrollView>
    </Animated.View>
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
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
  timeText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  durationText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    marginLeft: 'auto',
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  clientName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  phoneText: {
    ...TYPOGRAPHY.body,
    color: COLORS.coral,
  },
  vizitsText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  serviceName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginTop: SPACING.sm,
  },
  serviceDetail: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  masterName: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.purple,
  },
});

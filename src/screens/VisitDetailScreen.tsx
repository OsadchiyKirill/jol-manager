import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Badge from '../components/Badge'; // used for NEW/VIP badges
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';
import type { RootStackParamList } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDetail'>;

const VISIT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  '1': { label: 'Підтверджено', color: '#7B52AB', bg: '#EEE8F5' },
  '2': { label: 'Очікує', color: '#EAB308', bg: '#FEFCE8' },
  '3': { label: 'Завершено', color: '#48BB78', bg: '#F0FFF4' },
  '4': { label: 'Скасовано', color: '#E24B4A', bg: '#FEF2F2' },
  '5': { label: 'Не прийшов', color: '#9CA3AF', bg: '#F5F5F5' },
  '6': { label: 'Підтверджено', color: '#7B52AB', bg: '#EEE8F5' },
  '7': { label: 'Очікує оплати', color: '#E05A3A', bg: '#FDF3F0' },
  '21': { label: 'Нагадування надіслано', color: '#6B7280', bg: '#F5F5F5' },
  confirmed: { label: 'Підтверджено', color: '#7B52AB', bg: '#EEE8F5' },
  completed: { label: 'Завершено', color: '#48BB78', bg: '#F0FFF4' },
  cancelled: { label: 'Скасовано', color: '#E24B4A', bg: '#FEF2F2' },
  pending: { label: 'Очікує', color: '#EAB308', bg: '#FEFCE8' },
};

const DEFAULT_STATUS = { label: 'Невідомий', color: '#9CA3AF', bg: '#F5F5F5' };

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
  const statusInfo = VISIT_STATUS[String(visit.status)] || { ...DEFAULT_STATUS, label: `Статус ${visit.status}` };

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
          <View style={[styles.statusPill, { backgroundColor: statusInfo.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
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
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';
import type { Visit } from '../types';

const VISIT_STATUS_COLORS: Record<string, { bg: string; border: string }> = {
  '1': { bg: COLORS.purpleLight, border: COLORS.purple },
  '2': { bg: COLORS.successLight, border: COLORS.success },
  '3': { bg: '#F5F5F5', border: COLORS.textTertiary },
  '4': { bg: COLORS.dangerLight, border: COLORS.danger },
  '5': { bg: COLORS.warningLight, border: COLORS.warning },
  confirmed: { bg: COLORS.purpleLight, border: COLORS.purple },
  completed: { bg: '#F5F5F5', border: COLORS.textTertiary },
  cancelled: { bg: COLORS.dangerLight, border: COLORS.danger },
  pending: { bg: COLORS.warningLight, border: COLORS.warning },
};

interface VisitCardProps {
  visit: Visit;
  index?: number;
  onPress?: () => void;
}

export default function VisitCard({ visit, index = 0, onPress }: VisitCardProps) {
  const statusStyle = VISIT_STATUS_COLORS[visit.status] || {
    bg: COLORS.surface,
    border: COLORS.border,
  };
  const isNew = visit.client_vizits === 0;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[
          styles.card,
          { backgroundColor: statusStyle.bg, borderLeftColor: statusStyle.border },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.time}>{visit.time}</Text>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
          {visit.duration > 0 && (
            <Text style={styles.duration}>{visit.duration} хв</Text>
          )}
        </View>
        <Text style={styles.clientName}>{visit.client_name}</Text>
        <Text style={styles.service}>{visit.service_name}</Text>
        <View style={styles.footer}>
          <Text style={styles.master}>{visit.master_name_ua}</Text>
          {visit.total > 0 && (
            <Text style={styles.price}>{visit.total}€</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  time: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  newBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 20,
    marginLeft: SPACING.sm,
  },
  newBadgeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.success,
    fontWeight: '600',
  },
  duration: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginLeft: 'auto',
  },
  clientName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  service: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  master: {
    ...TYPOGRAPHY.caption,
    color: COLORS.purple,
  },
  price: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});

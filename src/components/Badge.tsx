import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';

type BadgeType = 'default' | 'new' | 'vip' | 'admin' | 'mila' | 'whatsapp' | 'instagram';

interface BadgeProps {
  label: string;
  type?: BadgeType;
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  default: { bg: COLORS.border, text: COLORS.textSecondary },
  new: { bg: COLORS.successLight, text: COLORS.success },
  vip: { bg: COLORS.purpleLight, text: COLORS.purple },
  admin: { bg: COLORS.coralLight, text: COLORS.coral },
  mila: { bg: COLORS.purpleLight, text: COLORS.purple },
  whatsapp: { bg: COLORS.whatsappLight, text: '#1B5E20' },
  instagram: { bg: COLORS.instagramLight, text: '#AD1457' },
};

export default function Badge({ label, type = 'default' }: BadgeProps) {
  const { bg, text } = BADGE_COLORS[type] || BADGE_COLORS.default;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 20,
  },
  label: {
    ...TYPOGRAPHY.label,
    fontWeight: '500',
  },
});

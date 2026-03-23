import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

interface AvatarProps {
  name?: string | null;
  channel?: string;
  size?: number;
}

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: COLORS.whatsapp,
  instagram: COLORS.instagram,
  messenger: COLORS.messenger,
};

const CHANNEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  whatsapp: 'logo-whatsapp',
  instagram: 'logo-instagram',
  messenger: 'chatbubble',
};

export default function Avatar({ name, channel, size = 44 }: AvatarProps) {
  const bgColor = channel && CHANNEL_COLORS[channel]
    ? CHANNEL_COLORS[channel]
    : name ? COLORS.purple : COLORS.coral;

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      {initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
      ) : channel && CHANNEL_ICONS[channel] ? (
        <Ionicons name={CHANNEL_ICONS[channel]} size={size * 0.45} color="#fff" />
      ) : (
        <Ionicons name="person" size={size * 0.45} color="#fff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '600',
  },
});

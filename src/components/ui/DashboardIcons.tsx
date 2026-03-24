import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
}

export function CalendarIcon({ color = '#E05A3A', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="2.5" stroke={color} strokeWidth="1.5" />
      <Path d="M3 9h18" stroke={color} strokeWidth="1.5" />
      <Line x1="8" y1="2" x2="8" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="16" y1="2" x2="16" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="15" r="1.5" fill={color} />
    </Svg>
  );
}

export function PersonPlusIcon({ color = '#7B52AB', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="8" r="4" stroke={color} strokeWidth="1.5" />
      <Path d="M2 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="20" y1="8" x2="20" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="17" y1="11" x2="23" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ChatBubbleIcon({ color = '#6B7280', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12c0 3.3-3.6 6-8 6-.9 0-1.7-.1-2.5-.3L7 19v-2.7C4.6 15 3 13.1 3 11c0-3.3 3.6-6 8-6"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <Path d="M14 6c0-2.2 2.7-4 6-4 .6 0 1.2.1 1.8.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}

export function LightningIcon({ color = '#EAB308', size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L4.5 12.5h6L9 22l9.5-12h-6L13 2z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EmptyScheduleIcon({ color = '#D1D5DB', size = 64 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="8" y="12" width="48" height="44" rx="6" stroke={color} strokeWidth="2" />
      <Path d="M8 24h48" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="6" x2="20" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="44" y1="6" x2="44" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="26" y1="36" x2="38" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="38" y1="36" x2="26" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

interface StatIconProps {
  color: string;
  children: React.ReactNode;
}

export function StatIconCircle({ color, children }: StatIconProps) {
  return (
    <View style={[styles.iconCircle, { backgroundColor: color + '1F' }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});

import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface TabIconProps {
  color: string;
  size?: number;
  focused?: boolean;
}

export function TodayIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M3 9h18" stroke={color} strokeWidth="1.8" />
      <Path d="M8 2v4M16 2v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="7" y="12" width="4" height="4" rx="1" fill={color} />
    </Svg>
  );
}

export function ScheduleIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M3 9h18" stroke={color} strokeWidth="1.8" />
      <Path d="M8 2v4M16 2v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M7 13h10M7 17h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function DialogsIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12c0 4.418-3.582 7-8 7-1.2 0-2.3-.2-3.3-.5L4 20l1.5-3.5C4.5 15 4 13.6 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="9" cy="12" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
      <Circle cx="15" cy="12" r="1" fill={color} />
    </Svg>
  );
}

export function SettingsIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" fill="none" />
      <Path
        d="M4 21c0-3.314 3.582-6 8-6s8 2.686 8 6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

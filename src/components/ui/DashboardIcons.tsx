import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

export function CalendarIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.5" />
      <Path d="M3 9h18" stroke={color} strokeWidth="1.5" />
      <Path d="M8 2v4M16 2v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Rect x="7" y="12" width="4" height="4" rx="1" fill={color} opacity={0.3} />
      <Rect x="13" y="12" width="4" height="4" rx="1" fill={color} opacity={0.15} />
    </Svg>
  );
}

export function PersonPlusIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="8" r="4" stroke={color} strokeWidth="1.5" />
      <Path d="M2 21c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="20" y1="6" x2="20" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="17" y1="9" x2="23" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ChatBubbleIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12c0 4.418-3.582 7-8 7-1.2 0-2.3-.2-3.3-.5L4 20l1.5-3.5C4.5 15 4 13.6 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Circle cx="9" cy="12" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
      <Circle cx="15" cy="12" r="1" fill={color} />
    </Svg>
  );
}

export function LightningIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ClipboardEmptyIcon({ color, size = 64 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M9 3V2a1 1 0 011-1h4a1 1 0 011 1v1" stroke={color} strokeWidth="1.5" />
      <Path d="M9 10h6M9 14h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
    </Svg>
  );
}

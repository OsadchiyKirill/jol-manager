import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/colors';

interface DateStripProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DAY_NAMES = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function getWeekDays(center: Date): Date[] {
  const days: Date[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(center);
    d.setDate(center.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DateStrip({ selectedDate, onDateChange }: DateStripProps) {
  const today = new Date();
  const days = getWeekDays(selectedDate);

  const shiftWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    onDateChange(newDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => shiftWeek(-1)}
        style={styles.arrowBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="chevron-back" size={20} color={COLORS.coral} />
      </TouchableOpacity>

      <View style={styles.daysRow}>
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const dayNum = day.getDate();
          const dayName = DAY_NAMES[day.getDay()];

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[styles.dayCell, isSelected && styles.dayCellSelected]}
              onPress={() => onDateChange(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                {dayName}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                {dayNum}
              </Text>
              {isToday && !isSelected && <View style={styles.todayDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => shiftWeek(1)}
        style={styles.arrowBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="chevron-forward" size={20} color={COLORS.coral} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  arrowBtn: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
    minWidth: 38,
  },
  dayCellSelected: {
    backgroundColor: COLORS.coral,
  },
  dayName: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  dayNameSelected: {
    color: '#fff',
  },
  dayNum: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dayNumSelected: {
    color: '#fff',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.coral,
    marginTop: 3,
  },
});

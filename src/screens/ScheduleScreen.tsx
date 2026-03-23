import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import client from '../api/client';
import VisitCard from '../components/VisitCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';
import { formatDateMadrid } from '../utils/helpers';
import type { Visit, RootStackParamList } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ScheduleScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function ScheduleScreen({ navigation }: ScheduleScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const fetchSchedule = async (date: Date) => {
    setLoading(true);
    try {
      const response = await client.get('/schedule', {
        params: { date: formatDateMadrid(date), lang: 'ua' },
      });
      setVisits(response.data.visits || response.data || []);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedule(selectedDate);
  }, [selectedDate]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => setSelectedDate(new Date());

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedule(selectedDate);
  };

  const onDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (date) setSelectedDate(date);
  };

  const dateStr = formatDateMadrid(selectedDate);
  const todayStr = formatDateMadrid(new Date());
  const isToday = dateStr === todayStr;
  const dayName = selectedDate.toLocaleDateString('uk-UA', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.container}>
      <View style={styles.dateNav}>
        <TouchableOpacity
          onPress={() => changeDate(-1)}
          style={styles.navBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.coral} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInfo}>
          <Text style={styles.dateText}>
            {isToday ? 'Сьогодні' : dateStr}
          </Text>
          <Text style={styles.dayName}>{dayName}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => changeDate(1)}
          style={styles.navBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.coral} />
        </TouchableOpacity>
      </View>

      {!isToday && (
        <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
          <Ionicons name="today" size={16} color={COLORS.coral} />
          <Text style={styles.todayBtnText}>Сьогодні</Text>
        </TouchableOpacity>
      )}

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          locale="uk"
          onChange={onDateChange}
        />
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.coral} />
        </View>
      ) : visits.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Немає записів</Text>
          <Text style={styles.emptySubtitle}>На цей день записів не знайдено</Text>
        </View>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item, index }) => (
            <VisitCard
              visit={item}
              index={index}
              onPress={() => navigation.navigate('VisitDetail', { visit: item })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.coral} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  navBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  dayName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.coralLight,
    marginTop: SPACING.sm,
  },
  todayBtnText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.coral,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
});

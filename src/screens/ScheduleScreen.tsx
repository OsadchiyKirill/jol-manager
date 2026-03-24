import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';
import VisitCard from '../components/VisitCard';
import DateStrip from '../components/ui/DateStrip';
import { ScheduleSkeleton } from '../components/ui/SkeletonLoader';
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

  const goToToday = () => setSelectedDate(new Date());

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedule(selectedDate);
  };

  const dateStr = formatDateMadrid(selectedDate);
  const todayStr = formatDateMadrid(new Date());
  const isToday = dateStr === todayStr;

  const monthLabel = selectedDate.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        {!isToday && (
          <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
            <Ionicons name="today" size={14} color={COLORS.coral} />
            <Text style={styles.todayBtnText}>Сьогодні</Text>
          </TouchableOpacity>
        )}
      </View>

      <DateStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {loading ? (
        <ScheduleSkeleton />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  monthLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.coralLight,
  },
  todayBtnText: {
    ...TYPOGRAPHY.caption,
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

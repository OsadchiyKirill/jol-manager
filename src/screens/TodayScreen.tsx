import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import client from '../api/client';
import VisitCard from '../components/VisitCard';
import { ScheduleSkeleton } from '../components/ui/SkeletonLoader';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';
import { getGreeting, getTodayDateMadrid } from '../utils/helpers';
import type { Visit } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

interface TodayScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function TodayScreen({ navigation }: TodayScreenProps) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [dialogCount, setDialogCount] = useState(0);
  const [takeoverCount, setTakeoverCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef<Animated.CompositeAnimation | null>(null);
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const today = getTodayDateMadrid();

  const fetchData = useCallback(async () => {
    try {
      const [scheduleRes, dialogsRes] = await Promise.all([
        client.get('/schedule', { params: { date: today, lang: 'ua' } }),
        client.get('/conversations').catch(() => ({ data: [] })),
      ]);
      setVisits(scheduleRes.data.visits || scheduleRes.data || []);
      const convs = Array.isArray(dialogsRes.data) ? dialogsRes.data : [];
      setDialogCount(convs.length);
      setTakeoverCount(convs.filter((c: any) => c.status === 'operator').length);
    } catch (error) {
      console.error('Failed to fetch today data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [today]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSync = async () => {
    setSyncing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    rotation.setValue(0);
    rotationAnim.current = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotationAnim.current.start();
    try {
      await client.post('/sync/crm');
      await fetchData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      rotationAnim.current?.stop();
      rotation.setValue(0);
      setSyncing(false);
    }
  };

  const newClientsCount = visits.filter(v => v.client_vizits === 0).length;

  if (loading) {
    return (
      <View style={styles.container}>
        <ScheduleSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.coral} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.dateText}>{today}</Text>
              </View>
              <TouchableOpacity onPress={handleSync} style={styles.syncBtn} disabled={syncing}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons name="sync" size={16} color={COLORS.purple} />
                </Animated.View>
                <Text style={styles.syncText}>{syncing ? 'Синк...' : 'Синк'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <TouchableOpacity
                style={styles.statCard}
                onPress={() => (navigation as any).navigate('Schedule')}
              >
                <Text style={styles.statEmoji}>📅</Text>
                <Text style={styles.statValue}>{visits.length}</Text>
                <Text style={styles.statLabel}>Записів</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statCard}>
                <Text style={styles.statEmoji}>👤</Text>
                <Text style={styles.statValue}>{newClientsCount}</Text>
                <Text style={styles.statLabel}>Нових</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statCard}
                onPress={() => (navigation as any).navigate('Dialogs')}
              >
                <Text style={styles.statEmoji}>💬</Text>
                <Text style={styles.statValue}>{dialogCount}</Text>
                <Text style={styles.statLabel}>Діалогів</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statCard}
                onPress={() => (navigation as any).navigate('Dialogs')}
              >
                <Text style={styles.statEmoji}>⚡</Text>
                <Text style={styles.statValue}>{takeoverCount}</Text>
                <Text style={styles.statLabel}>Перехватів</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Записи сьогодні</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Немає записів на сьогодні</Text>
            <Text style={styles.emptySubtitle}>Потягніть вниз для оновлення</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
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
    backgroundColor: COLORS.background,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  dateText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.purpleLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  syncText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.purple,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.coral,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
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

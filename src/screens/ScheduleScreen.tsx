import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import client from '../api/client';
import VisitCard from '../components/VisitCard';

interface Visit {
  id: number;
  clientName: string;
  masterName: string;
  serviceName: string;
  time: string;
  status: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSchedule = async (date: Date) => {
    setLoading(true);
    try {
      const response = await client.get('/schedule', {
        params: { date: formatDate(date), lang: 'ua' },
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedule(selectedDate);
  };

  const dateStr = formatDate(selectedDate);
  const dayName = selectedDate.toLocaleDateString('uk-UA', { weekday: 'long' });

  return (
    <View style={styles.container}>
      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navBtn}>
          <Text style={styles.navBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>{dateStr}</Text>
          <Text style={styles.dayName}>{dayName}</Text>
        </View>
        <TouchableOpacity onPress={() => changeDate(1)} style={styles.navBtn}>
          <Text style={styles.navBtnText}>→</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8b7355" />
        </View>
      ) : visits.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Немає записів</Text>
        </View>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <VisitCard visit={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f0',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0d6cc',
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navBtnText: {
    fontSize: 24,
    color: '#8b7355',
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  dayName: {
    fontSize: 14,
    color: '#8b7355',
    textTransform: 'capitalize',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  empty: {
    fontSize: 16,
    color: '#999',
  },
});

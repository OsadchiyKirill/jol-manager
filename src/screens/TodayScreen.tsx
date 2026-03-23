import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
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

export default function TodayScreen() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchVisits = async () => {
    try {
      const response = await client.get('/schedule', {
        params: { date: today, lang: 'ua' },
      });
      setVisits(response.data.visits || response.data || []);
    } catch (error) {
      console.error('Failed to fetch today visits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVisits();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b7355" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Сьогодні — {today}</Text>
      {visits.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Немає записів на сьогодні</Text>
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
    backgroundColor: '#f8f4f0',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c2c2c',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  empty: {
    fontSize: 16,
    color: '#999',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Visit {
  id: number;
  clientName: string;
  masterName: string;
  serviceName: string;
  time: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#4caf50',
  pending: '#ff9800',
  cancelled: '#f44336',
  completed: '#8b7355',
};

export default function VisitCard({ visit }: { visit: Visit }) {
  const statusColor = STATUS_COLORS[visit.status] || '#999';

  return (
    <View style={styles.card}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{visit.time}</Text>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
      <View style={styles.details}>
        <Text style={styles.clientName}>{visit.clientName}</Text>
        <Text style={styles.service}>{visit.serviceName}</Text>
        <Text style={styles.master}>{visit.masterName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0d6cc',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    minWidth: 50,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  details: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  service: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  master: {
    fontSize: 13,
    color: '#8b7355',
    marginTop: 2,
  },
});

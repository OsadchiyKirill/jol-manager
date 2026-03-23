import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DialogsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Діалоги</Text>
      <Text style={styles.subtitle}>Скоро тут будуть чати з клієнтами</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f4f0',
  },
  placeholder: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  subtitle: {
    fontSize: 15,
    color: '#999',
    marginTop: 8,
  },
});

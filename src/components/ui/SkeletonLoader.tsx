import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING } from '../../utils/colors';

function SkeletonLine({ width = '100%', height = 16 }: { width?: string | number; height?: number }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[styles.line, { width: width as any, height, opacity }]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <SkeletonLine width={50} height={14} />
        <SkeletonLine width={80} height={12} />
      </View>
      <SkeletonLine width="70%" height={16} />
      <SkeletonLine width="50%" height={14} />
    </View>
  );
}

export function SkeletonDialogRow() {
  return (
    <View style={styles.dialogRow}>
      <SkeletonLine width={44} height={44} />
      <View style={styles.dialogContent}>
        <SkeletonLine width="60%" height={16} />
        <SkeletonLine width="80%" height={14} />
      </View>
    </View>
  );
}

export function ScheduleSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
    </View>
  );
}

export function DialogsSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {[...Array(5)].map((_, i) => <SkeletonDialogRow key={i} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.lg,
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dialogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  dialogContent: {
    flex: 1,
    gap: SPACING.sm,
  },
  skeletonContainer: {
    paddingTop: SPACING.sm,
  },
});

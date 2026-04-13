import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, spacing, typography } from '@/theme';

export interface NutrientBarProps {
  label: string;
  value: number;
  unit: string;
  maxValue: number;
  color: string;
}

export function NutrientBar({ label, value, unit, maxValue, color }: NutrientBarProps) {
  const fillRatio = useSharedValue(0);

  React.useEffect(() => {
    const ratio = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
    fillRatio.value = withTiming(ratio, { duration: 200 });
  }, [value, maxValue, fillRatio]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${fillRatio.value * 100}%`,
  }));

  const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(1);

  return (
    <View style={styles.container} accessibilityLabel={`${label}: ${displayValue} ${unit}`}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{displayValue}</Text>
          <Text style={styles.unit}> {unit}</Text>
        </View>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { backgroundColor: color }, animatedBarStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[900],
  },
  unit: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[400],
  },
  track: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
});

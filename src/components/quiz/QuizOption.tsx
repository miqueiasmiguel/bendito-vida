import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

export interface QuizOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function QuizOption({ label, selected, onPress }: QuizOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 52,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.white,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardSelected: {
    borderColor: colors.primary[700],
    backgroundColor: colors.primary[100],
  },
  label: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[900],
  },
  labelSelected: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary[700],
  },
});

import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Checkin } from '@/stores/useProgressStore';
import { colors, radii, spacing, typography } from '@/theme';

export interface InsightBannerProps {
  checkins: Checkin[];
}

function avgScore(c: Checkin): number {
  return (c.energyScore + c.sleepScore + c.focusScore) / 3;
}

function buildInsight(checkins: Checkin[]): string {
  if (checkins.length < 2) {
    return 'Continue registrando seu check-in para ver tendências de evolução.';
  }

  const sorted = [...checkins].sort((a, b) => a.createdAt - b.createdAt);
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  const latestAvg = avgScore(latest);
  const prevAvg = avgScore(previous);

  if (latestAvg > prevAvg) {
    const pct = Math.round(((latestAvg - prevAvg) / prevAvg) * 100);
    return `Sua disposição geral melhorou ${pct}% esta semana. Continue assim!`;
  }

  if (latestAvg < prevAvg) {
    return 'Esta semana foi mais desafiadora. Lembre-se de cuidar do seu mix!';
  }

  return 'Continue registrando seu check-in para ver tendências de evolução.';
}

export function InsightBanner({ checkins }: InsightBannerProps) {
  const message = buildInsight(checkins);

  return (
    <View style={styles.banner} accessibilityLabel={`Insight: ${message}`}>
      <Sparkles
        color={colors.primary[700]}
        size={18}
        strokeWidth={1.5}
        accessibilityElementsHidden
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary[100],
    borderRadius: radii.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  message: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.primary[700],
    flex: 1,
    lineHeight: typography.lineHeight.body,
  },
});

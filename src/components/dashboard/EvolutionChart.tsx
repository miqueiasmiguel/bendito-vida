import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import type { Checkin } from '@/stores/useProgressStore';
import { colors, radii, spacing, typography } from '@/theme';

export interface EvolutionChartProps {
  checkins: Checkin[];
}

const MAX_WEEKS = 8;
const CHART_WIDTH = Dimensions.get('window').width - spacing.lg * 2;
const CHART_HEIGHT = 180;

function avgScore(c: Checkin): number {
  return parseFloat(((c.energyScore + c.sleepScore + c.focusScore) / 3).toFixed(2));
}

export function EvolutionChart({ checkins }: EvolutionChartProps) {
  const sorted = [...checkins].sort((a, b) => a.createdAt - b.createdAt).slice(-MAX_WEEKS);

  if (sorted.length === 0) {
    return (
      <View style={styles.emptyWrapper} accessibilityLabel="Sem dados de evolução ainda">
        <Text style={styles.emptyTitle}>Sua evolução aparece aqui</Text>
        <Text style={styles.emptyBody}>Faça seu primeiro check-in para ver sua evolução!</Text>
      </View>
    );
  }

  const labels = sorted.map((c) => {
    // "2026-W15" → "S15"
    const weekNum = c.week.split('-W')[1] ?? c.week;
    return `S${weekNum}`;
  });

  const data = sorted.map(avgScore);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Evolução semanal</Text>
      <View accessibilityLabel="Gráfico de evolução semanal" accessible>
        <LineChart
          data={{
            labels,
            datasets: [{ data, color: () => colors.primary[500] }],
          }}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          yAxisInterval={1}
          fromZero={false}
          chartConfig={{
            backgroundGradientFrom: colors.white,
            backgroundGradientTo: colors.white,
            decimalPlaces: 1,
            color: () => colors.primary[500],
            labelColor: () => colors.neutral[700],
            style: { borderRadius: radii.card },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: colors.primary[700],
            },
            propsForBackgroundLines: {
              stroke: colors.neutral[200],
              strokeDasharray: '4',
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines
          withOuterLines={false}
          segments={4}
          yLabelsOffset={8}
        />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendLabel}>Score médio (Disposição + Sono + Foco) / 3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  chart: {
    marginLeft: -spacing.md,
    borderRadius: radii.card,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[500],
  },
  legendLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[400],
    flex: 1,
  },
  emptyWrapper: {
    backgroundColor: colors.primary[100],
    borderRadius: radii.card,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.primary[700],
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.primary[700],
    textAlign: 'center',
    lineHeight: typography.lineHeight.body,
  },
});

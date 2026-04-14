import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Line, Polygon, Svg, Text as SvgText } from 'react-native-svg';

import { colors, typography } from '@/theme';

export interface RadarDataPoint {
  label: string;
  value: number;
  maxValue: number;
}

export interface BioactiveRadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  accessibilityLabel?: string;
}

const LABEL_PADDING = 28;
const GRID_LEVELS = [0.25, 0.5, 0.75, 1.0];

function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) : str;
}

function getAxisAngle(index: number, total: number): number {
  return (2 * Math.PI * index) / total - Math.PI / 2;
}

export function BioactiveRadarChart({
  data,
  size = 220,
  accessibilityLabel = 'Gráfico de nutrientes bioativos',
}: BioactiveRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - LABEL_PADDING;
  const n = data.length;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const polygonPoints = data
    .map((d, i) => {
      const angle = getAxisAngle(i, n);
      const r = Math.max(0, Math.min(1, d.value / d.maxValue)) * radius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(' ');

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={size} height={size}>
        {GRID_LEVELS.map((level, i) => (
          <Circle
            key={`grid-${i}`}
            cx={cx}
            cy={cy}
            r={radius * level}
            stroke={colors.neutral[200]}
            strokeWidth={1}
            fill="none"
          />
        ))}

        {data.map((_, i) => {
          const angle = getAxisAngle(i, n);
          return (
            <Line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={cx + radius * Math.cos(angle)}
              y2={cy + radius * Math.sin(angle)}
              stroke={colors.neutral[200]}
              strokeWidth={1}
            />
          );
        })}

        <Polygon
          points={polygonPoints}
          fill={colors.primary[500]}
          fillOpacity={0.3}
          stroke={colors.primary[700]}
          strokeWidth={2}
        />

        {data.map((d, i) => {
          const angle = getAxisAngle(i, n);
          const labelR = radius + LABEL_PADDING * 0.75;
          return (
            <SvgText
              key={`label-${i}`}
              x={cx + labelR * Math.cos(angle)}
              y={cy + labelR * Math.sin(angle)}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontFamily={typography.fontFamily.regular}
              fontSize={typography.fontSize.small}
              fill={colors.neutral[700]}
            >
              {truncate(d.label, 8)}
            </SvgText>
          );
        })}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

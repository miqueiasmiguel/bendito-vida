import { router } from 'expo-router';
import { Brain, ClipboardList, Moon, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/ui';
import type { DailyCheckin } from '@/types/database';
import { colors, spacing, typography } from '@/theme';

export interface TodayStatusCardProps {
  checkin?: DailyCheckin | null;
  onPress?: () => void;
}

interface ScoreItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  accessibilityLabel: string;
}

function ScoreItem({ icon, value, label, accessibilityLabel }: ScoreItemProps) {
  return (
    <View style={styles.scoreItem} accessibilityLabel={accessibilityLabel}>
      {icon}
      <Text style={styles.scoreValue}>{value}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

export function TodayStatusCard({ checkin, onPress }: TodayStatusCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/progress');
    }
  };

  if (checkin) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Ver check-in de hoje na aba Evolução"
        activeOpacity={0.8}
      >
        <Text style={styles.doneLabel}>Check-in de hoje realizado ✓</Text>
        <View style={styles.scoresRow}>
          <ScoreItem
            icon={<Zap size={20} color={colors.semantic.warning} strokeWidth={1.5} />}
            value={checkin.energy_score}
            label="Energia"
            accessibilityLabel={`Energia: ${checkin.energy_score} de 5`}
          />
          <ScoreItem
            icon={<Moon size={20} color={colors.primary[500]} strokeWidth={1.5} />}
            value={checkin.sleep_score}
            label="Sono"
            accessibilityLabel={`Sono: ${checkin.sleep_score} de 5`}
          />
          <ScoreItem
            icon={<Brain size={20} color={colors.semantic.info} strokeWidth={1.5} />}
            value={checkin.focus_score}
            label="Foco"
            accessibilityLabel={`Foco: ${checkin.focus_score} de 5`}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <ClipboardList size={28} color={colors.neutral[400]} strokeWidth={1.5} />
      <Text style={styles.headline}>Como você está hoje?</Text>
      <Button variant="secondary" label="Registrar meu dia" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    gap: spacing.sm,
  },
  doneLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.semantic.success,
    alignSelf: 'flex-start',
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: spacing.xs,
  },
  scoreItem: {
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  scoreValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    color: colors.neutral[900],
  },
  scoreLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[700],
  },
  headline: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
    textAlign: 'center',
  },
});

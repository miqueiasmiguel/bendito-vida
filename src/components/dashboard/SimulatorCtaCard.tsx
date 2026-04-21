import { router } from 'expo-router';
import { FlaskConical } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

export interface SimulatorCtaCardProps {
  onPress?: () => void;
}

export function SimulatorCtaCard({ onPress }: SimulatorCtaCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/simulator');
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Montar meu Mix — acessar simulador"
    >
      <View style={styles.row}>
        <FlaskConical size={32} color={colors.neutral[50]} strokeWidth={1.5} />
        <View style={styles.textBlock}>
          <Text style={styles.headline}>Monte seu Mix do dia</Text>
          <Text style={styles.subtitle}>
            Combine ingredientes e descubra a mistura ideal para você
          </Text>
        </View>
      </View>
      <Button variant="primary" label="Montar meu Mix" onPress={handlePress} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary[700],
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  headline: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.white,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.primary[100],
  },
});

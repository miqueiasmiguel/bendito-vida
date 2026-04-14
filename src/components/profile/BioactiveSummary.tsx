import {
  Activity,
  Circle,
  Droplets,
  Dumbbell,
  Heart,
  Leaf,
  Shield,
  Star,
  Sun,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';
import type { NutrientTag } from '@/data/quiz-questions';
import type { NutritionProfile } from '@/utils/match-profile';

export interface BioactiveSummaryProps {
  profile: NutritionProfile | null;
  onQuizPress: () => void;
}

interface NutrientMeta {
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
}

const NUTRIENT_META: Record<NutrientTag, NutrientMeta> = {
  ferro: { label: 'Ferro', Icon: Zap },
  'vitamina-c': { label: 'Vitamina C', Icon: Sun },
  'vitamina-b12': { label: 'Vitamina B12', Icon: Zap },
  'vitamina-e': { label: 'Vitamina E', Icon: Heart },
  omega3: { label: 'Ômega 3', Icon: Droplets },
  calcio: { label: 'Cálcio', Icon: Shield },
  magnesio: { label: 'Magnésio', Icon: Activity },
  zinco: { label: 'Zinco', Icon: Star },
  selenio: { label: 'Selênio', Icon: Circle },
  fibra: { label: 'Fibra', Icon: Leaf },
  proteina: { label: 'Proteína', Icon: Dumbbell },
  prebiotico: { label: 'Prebiótico', Icon: Leaf },
  cromo: { label: 'Cromo', Icon: Circle },
};

export function BioactiveSummary({ profile, onQuizPress }: BioactiveSummaryProps) {
  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel="Meu Mapa Bioativo">
      <Text style={styles.title}>Meu Mapa Bioativo</Text>

      {profile && profile.topNutrients.length > 0 ? (
        profile.topNutrients.slice(0, 3).map((tag) => {
          const meta = NUTRIENT_META[tag] ?? { label: tag, Icon: Circle };
          const { Icon, label } = meta;
          return (
            <View key={tag} style={styles.nutrientRow} accessibilityLabel={label}>
              <Icon size={20} color={colors.primary[700]} strokeWidth={1.75} />
              <Text style={styles.nutrientLabel}>{label}</Text>
              <View style={styles.barTrack}>
                <View style={styles.barFill} />
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Complete o quiz para ver seu Mapa Bioativo</Text>
          <Button variant="secondary" label="Fazer Quiz" onPress={onQuizPress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  nutrientLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[700],
    width: 110,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.primary[100],
    borderRadius: radii.badge,
    overflow: 'hidden',
  },
  barFill: {
    width: '80%',
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: radii.badge,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[700],
    textAlign: 'center',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Ingredient } from '@/data/ingredients';
import type { NutrientTag } from '@/data/quiz-questions';
import { colors, radii, spacing, typography } from '@/theme';

import { BioactiveRadarChart } from './BioactiveRadarChart';
import type { RadarDataPoint } from './BioactiveRadarChart';

const NUTRIENT_SHORT: Record<NutrientTag, string> = {
  'vitamina-c': 'Vit. C',
  'vitamina-b12': 'Vit. B12',
  'vitamina-e': 'Vit. E',
  omega3: 'Ômega-3',
  ferro: 'Ferro',
  calcio: 'Cálcio',
  magnesio: 'Magnésio',
  zinco: 'Zinco',
  selenio: 'Selênio',
  fibra: 'Fibras',
  proteina: 'Proteína',
  prebiotico: 'Prebiótic',
  cromo: 'Cromo',
};

// Representative fill levels (visual only — no exact quantity data)
const RADAR_VALUES = [100, 82, 68, 55, 44, 35];

function buildRadarData(nutrients: NutrientTag[]): RadarDataPoint[] {
  return nutrients.slice(0, 6).map((tag, i) => ({
    label: NUTRIENT_SHORT[tag],
    value: RADAR_VALUES[i] ?? 35,
    maxValue: 100,
  }));
}

export interface BioactiveMapProps {
  topNutrients: NutrientTag[];
  recommendedIngredients: Ingredient[];
  onQuizPress?: () => void;
}

export function BioactiveMap({
  topNutrients,
  recommendedIngredients,
  onQuizPress,
}: BioactiveMapProps) {
  if (topNutrients.length === 0) {
    return (
      <View style={styles.card} accessibilityLabel="Mapa Bioativo — quiz não concluído">
        <Text style={styles.cardTitle}>Mapa Bioativo</Text>
        <Text style={styles.emptyText}>
          Complete o quiz para ver seus nutrientes prioritários e ingredientes recomendados.
        </Text>
        {onQuizPress && (
          <Text
            style={styles.quizLink}
            onPress={onQuizPress}
            accessibilityRole="button"
            accessibilityLabel="Fazer Quiz"
          >
            Fazer Quiz →
          </Text>
        )}
      </View>
    );
  }

  const radarData = buildRadarData(topNutrients);
  const displayedIngredients = recommendedIngredients.slice(0, 5);

  return (
    <View style={styles.card} accessibilityLabel="Mapa Bioativo">
      <Text style={styles.cardTitle}>Mapa Bioativo</Text>

      <View style={styles.chartSection}>
        <BioactiveRadarChart data={radarData} />
      </View>

      <Text style={styles.sectionSubtitle}>Ingredientes recomendados</Text>
      <View style={styles.ingredientsRow}>
        {displayedIngredients.map((ingredient) => (
          <View key={ingredient.id} style={styles.ingredientChip}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            {ingredient.isParaibano && (
              <View style={styles.badge} accessibilityLabel="Ingrediente paraibano">
                <Text style={styles.badgeText}>Paraibano</Text>
              </View>
            )}
          </View>
        ))}
      </View>
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
  cardTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[100],
    borderRadius: radii.badge,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  ingredientName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.primary[700],
  },
  badge: {
    backgroundColor: colors.primary[700],
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.small,
    color: colors.white,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[700],
    marginBottom: spacing.md,
  },
  quizLink: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.primary[700],
  },
});

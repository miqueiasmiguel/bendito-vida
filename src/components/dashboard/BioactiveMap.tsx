import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Ingredient } from '@/data/ingredients';
import type { NutrientTag } from '@/data/quiz-questions';
import { colors, radii, spacing, typography } from '@/theme';

// Maps each nutrient tag to a display label and bar color
const NUTRIENT_META: Record<NutrientTag, { label: string; color: string }> = {
  'vitamina-c': { label: 'Vitamina C', color: colors.semantic.warning },
  'vitamina-b12': { label: 'Vitamina B12', color: colors.semantic.info },
  'vitamina-e': { label: 'Vitamina E', color: colors.accent[500] },
  omega3: { label: 'Ômega-3', color: colors.semantic.info },
  ferro: { label: 'Ferro', color: colors.semantic.error },
  calcio: { label: 'Cálcio', color: colors.primary[500] },
  magnesio: { label: 'Magnésio', color: colors.primary[700] },
  zinco: { label: 'Zinco', color: colors.neutral[700] },
  selenio: { label: 'Selênio', color: colors.accent[500] },
  fibra: { label: 'Fibras', color: colors.semantic.success },
  proteina: { label: 'Proteína', color: colors.primary[500] },
  prebiotico: { label: 'Prebiótico', color: colors.semantic.success },
  cromo: { label: 'Cromo', color: colors.neutral[400] },
};

// Fixed representative fill levels (visual only — no exact quantity data)
const FILL_LEVELS = [0.75, 0.6, 0.5];

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

  const displayedNutrients = topNutrients.slice(0, 3);
  const displayedIngredients = recommendedIngredients.slice(0, 5);

  return (
    <View style={styles.card} accessibilityLabel="Mapa Bioativo">
      <Text style={styles.cardTitle}>Mapa Bioativo</Text>

      <View style={styles.nutrientsSection}>
        {displayedNutrients.map((tag, index) => {
          const meta = NUTRIENT_META[tag];
          const fill = FILL_LEVELS[index] ?? 0.5;
          return (
            <View key={tag} style={styles.nutrientRow} accessibilityLabel={meta.label}>
              <Text style={styles.nutrientLabel}>{meta.label}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, { width: `${fill * 100}%`, backgroundColor: meta.color }]}
                />
              </View>
            </View>
          );
        })}
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
  nutrientsSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  nutrientRow: {
    gap: spacing.xs,
  },
  nutrientLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
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

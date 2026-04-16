import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { NutritionSummary } from '@/data/nutrition-engine';
import type { MixItem } from '@/stores/useSimulatorStore';
import { colors, radii, spacing, typography } from '@/theme';

export interface RecipeCardProps {
  title: string;
  ingredients: MixItem[];
  nutrition: NutritionSummary;
}

export function RecipeCard({ title, ingredients, nutrition }: RecipeCardProps) {
  const hasParaibano = ingredients.some((item) => item.ingredient.isParaibano);

  return (
    <View style={styles.card} accessibilityLabel="Cartão de receita">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.accentBar} />
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      </View>

      {/* Paraibano badge */}
      {hasParaibano && (
        <View
          style={styles.paraibaBadge}
          accessibilityLabel="Contém ingredientes da biodiversidade paraibana"
        >
          <Text style={styles.paraibaBadgeText}>
            🌿 Contém ingredientes da biodiversidade paraibana
          </Text>
        </View>
      )}

      {/* Ingredients list */}
      <Text style={styles.sectionTitle}>Ingredientes</Text>
      <View style={styles.ingredientsList}>
        {ingredients.map((item) => (
          <View key={item.ingredient.id} style={styles.ingredientRow}>
            <View style={[styles.colorDot, { backgroundColor: item.ingredient.color }]} />
            <Text style={styles.ingredientName}>{item.ingredient.name}</Text>
            <Text style={styles.ingredientGrams}>{item.grams}g</Text>
            {item.ingredient.isParaibano && (
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>PB</Text>
              </View>
            )}
            <Text style={styles.ingredientCalories}>
              {Math.round((item.ingredient.nutrition.calories * item.grams) / 100)} kcal
            </Text>
          </View>
        ))}
      </View>

      {/* Nutritional summary */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Resumo Nutricional</Text>
      <View style={styles.nutritionGrid}>
        <NutritionIndicator
          label="Calorias"
          value={Math.round(nutrition.calories)}
          unit="kcal"
          color={colors.semantic.error}
        />
        <NutritionIndicator
          label="Fibras"
          value={+nutrition.fiber.toFixed(1)}
          unit="g"
          color={colors.semantic.success}
        />
        <NutritionIndicator
          label="Proteínas"
          value={+nutrition.protein.toFixed(1)}
          unit="g"
          color={colors.semantic.info}
        />
        <NutritionIndicator
          label="Ômega-3"
          value={+nutrition.omega3.toFixed(1)}
          unit="g"
          color="#B8860B"
        />
      </View>

      {/* Footer branding */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Criado com Bendito Vida</Text>
        <Text style={styles.footerSubText}>Bendito Grão Store · Paraíba</Text>
      </View>
    </View>
  );
}

interface NutritionIndicatorProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

function NutritionIndicator({ label, value, unit, color }: NutritionIndicatorProps) {
  return (
    <View style={styles.nutritionCell}>
      <Text style={[styles.nutritionValue, { color }]}>{value}</Text>
      <Text style={styles.nutritionUnit}>{unit}</Text>
      <Text style={styles.nutritionLabel}>{label}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  accentBar: {
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: colors.accent[500],
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
    flex: 1,
  },
  paraibaBadge: {
    backgroundColor: colors.primary[100],
    borderRadius: radii.badge,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  paraibaBadgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.primary[700],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[400],
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientsList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ingredientName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.neutral[900],
    flex: 1,
  },
  ingredientGrams: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
  },
  smallBadge: {
    backgroundColor: colors.primary[700],
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  smallBadgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.small,
    color: colors.white,
  },
  ingredientCalories: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[400],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginBottom: spacing.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  nutritionCell: {
    alignItems: 'center',
    gap: 2,
  },
  nutritionValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
  },
  nutritionUnit: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[400],
  },
  nutritionLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingTop: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  footerText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.primary[700],
  },
  footerSubText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[400],
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Ingredient } from '@/data/ingredients';
import { colors, radii, spacing, typography } from '@/theme';

export interface IngredientCardProps {
  ingredient: Ingredient;
  selected: boolean;
  onPress: (ingredient: Ingredient) => void;
}

export function IngredientCard({ ingredient, selected, onPress }: IngredientCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={() => onPress(ingredient)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${ingredient.name}${selected ? ', selecionado' : ''}`}
      accessibilityState={{ selected }}
    >
      {ingredient.isParaibano && (
        <View style={styles.badge} accessibilityLabel="Ingrediente paraibano">
          <Text style={styles.badgeText}>Paraibano</Text>
        </View>
      )}
      <View style={[styles.colorDot, { backgroundColor: ingredient.color }]} />
      <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={2}>
        {ingredient.name}
      </Text>
      <Text style={styles.calories}>{ingredient.nutrition.calories} kcal</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 96,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.primary[700],
    backgroundColor: colors.primary[100],
  },
  badge: {
    backgroundColor: colors.primary[100],
    borderRadius: radii.badge,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginBottom: spacing.xs,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.small,
    color: colors.primary[700],
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[900],
    textAlign: 'center',
    lineHeight: 18,
  },
  nameSelected: {
    color: colors.primary[700],
  },
  calories: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[400],
    marginTop: spacing.xs,
  },
});

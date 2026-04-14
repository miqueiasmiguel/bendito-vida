import { Leaf } from 'lucide-react-native';
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
        <View style={styles.seal} accessibilityLabel="Ingrediente paraibano">
          <Leaf size={10} color={colors.neutral[50]} strokeWidth={2} />
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
    overflow: 'visible',
  },
  cardSelected: {
    borderColor: colors.primary[700],
    backgroundColor: colors.primary[100],
  },
  seal: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[700],
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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

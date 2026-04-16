import { Leaf } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { Ingredient } from '@/data/ingredients';
import { colors, radii, spacing, typography } from '@/theme';
import { GrainIcon } from '@/components/ui/GrainIcon';

export interface IngredientCardProps {
  ingredient: Ingredient;
  grams: number;
  cardWidth: number;
  onPress: (ingredient: Ingredient) => void;
  onRemove: (id: string) => void;
}

export function IngredientCard({
  ingredient,
  grams,
  cardWidth,
  onPress,
  onRemove,
}: IngredientCardProps) {
  const hasGrams = grams > 0;

  const flashAnim = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(flashAnim.value, [0, 1], [colors.white, colors.primary[100]]),
  }));

  const handlePress = () => {
    flashAnim.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    );
    onPress(ingredient);
  };

  // Origin text (task 4.3)
  const originText = ingredient.isParaibano ? 'Nativo da PB' : ingredient.origin;

  return (
    <Animated.View style={[styles.card, { width: cardWidth }, animatedStyle]}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={handlePress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={hasGrams ? `${ingredient.name}, ${grams}g no mix` : ingredient.name}
        accessibilityState={{ selected: hasGrams }}
      >
        {/* Paraibano seal — top-right */}
        {ingredient.isParaibano && (
          <View style={styles.seal} accessibilityLabel="Ingrediente paraibano">
            <Leaf size={10} color={colors.neutral[50]} strokeWidth={2} />
          </View>
        )}

        {/* Quantity badge — top-left, visible when grams > 0 */}
        {hasGrams && (
          <TouchableOpacity
            style={styles.badge}
            onPress={() => onRemove(ingredient.id)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Remover ${ingredient.name} do mix`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.badgeText}>{grams}g</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.iconCircle, { backgroundColor: ingredient.color }]}>
          <GrainIcon ingredientId={ingredient.id} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {ingredient.name}
          </Text>
        </View>
        <Text style={styles.origin} numberOfLines={1}>
          {originText}
        </Text>
        <Text style={styles.calories}>{ingredient.nutrition.calories} kcal</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120, // task 4.1: increased from 100px
    borderRadius: radii.card,
    borderWidth: 1, // task 4.4: refined from 1.5px
    borderColor: colors.neutral[200],
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 }, // task 4.4: softer shadow
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    overflow: 'visible',
  },
  cardTouchable: {
    flex: 1,
    padding: spacing.sm,
    alignItems: 'center',
    width: '100%',
    overflow: 'visible',
  },
  seal: {
    position: 'absolute',
    top: -6,
    right: -6,
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
  badge: {
    position: 'absolute',
    top: -6,
    left: -6,
    minWidth: 28,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent[500],
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.small,
    color: colors.white,
    lineHeight: 14,
  },
  iconCircle: {
    width: 44, // task 4.2: increased from 40px
    height: 44,
    borderRadius: 22,
    marginBottom: 2,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[900],
    textAlign: 'center',
    lineHeight: 16,
  },
  origin: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[700],
    textAlign: 'center',
    marginBottom: 1,
  },
  calories: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.neutral[400],
  },
});

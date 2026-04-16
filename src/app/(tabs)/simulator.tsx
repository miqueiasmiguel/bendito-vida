import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IngredientCard } from '@/components/simulator/IngredientCard';
import { MixJar } from '@/components/simulator/MixJar';
import { NudgeAlert } from '@/components/simulator/NudgeAlert';
import { Button } from '@/components/ui';
import type { Ingredient } from '@/data/ingredients';
import { INGREDIENTS } from '@/data/ingredients';
import { calculateNutritionFromMix, generateNudges, MAX_CALORIES } from '@/data/nutrition-engine';
import type { NudgeMessage } from '@/data/nutrition-engine';
import { useQuizStore } from '@/stores/useQuizStore';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { colors, spacing, typography } from '@/theme';

const PADDING_HORIZONTAL = spacing.lg; // 24px each side
const COLUMN_GAP = spacing.sm; // 8px between columns
const NUDGE_PRIORITY: Record<string, number> = { warning: 2, suggestion: 1, info: 0 };

export default function SimulatorScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - PADDING_HORIZONTAL * 2 - COLUMN_GAP * 2) / 3;

  const { mixItems, addGrams, removeIngredient, resetMix } = useSimulatorStore();
  const nutritionProfile = useQuizStore((s) => s.nutritionProfile);
  const userTags = nutritionProfile?.topNutrients ?? [];

  const mixEntries = Object.values(mixItems);
  const hasItems = mixEntries.length > 0;
  const totalGrams = mixEntries.reduce((sum, item) => sum + item.grams, 0);

  const nutrition = calculateNutritionFromMix(mixItems);
  const fillLevel = Math.min(nutrition.calories / MAX_CALORIES, 1);

  const fillStops = mixEntries.map((item) => ({
    color: item.ingredient.color,
    weight: item.grams,
  }));

  // Nudge: latest-wins — new selection immediately replaces current nudge
  const [currentNudge, setCurrentNudge] = useState<NudgeMessage | null>(null);
  const [nudgeKey, setNudgeKey] = useState(0);
  const prevItemCount = useRef(mixEntries.length);

  useEffect(() => {
    if (mixEntries.length === prevItemCount.current) return;
    prevItemCount.current = mixEntries.length;

    const ingredientList = mixEntries.map((i) => i.ingredient);
    const nudges = generateNudges(nutrition, ingredientList, userTags as string[]);
    if (nudges.length === 0) return;

    const top = nudges.reduce((best, n) =>
      NUDGE_PRIORITY[n.type] >= NUDGE_PRIORITY[best.type] ? n : best,
    );
    setCurrentNudge(top);
    setNudgeKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mixEntries.length, nutrition, userTags]);

  const handleDismissNudge = useCallback(() => {
    setCurrentNudge(null);
  }, []);

  const handlePress = useCallback(
    (ingredient: Ingredient) => {
      addGrams(ingredient, 30);
    },
    [addGrams],
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeIngredient(id);
    },
    [removeIngredient],
  );

  const handleReset = useCallback(() => {
    resetMix();
  }, [resetMix]);

  const renderItem = useCallback(
    ({ item }: { item: Ingredient }) => {
      const grams = mixItems[item.id]?.grams ?? 0;
      return (
        <IngredientCard
          ingredient={item}
          grams={grams}
          cardWidth={cardWidth}
          onPress={handlePress}
          onRemove={handleRemove}
        />
      );
    },
    [mixItems, cardWidth, handlePress, handleRemove],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top section — Jar */}
      <View style={styles.jarSection}>
        <Text style={styles.title} accessibilityRole="header">
          Meu Mix
        </Text>
        <Text style={styles.subtitle}>
          {!hasItems ? 'Toque nos ingredientes para montar seu mix' : `${totalGrams}g no mix`}
        </Text>

        <MixJar fillLevel={fillLevel} fillStops={fillStops} />
      </View>

      {/* Bottom section — Ingredient grid */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Ingredientes</Text>
        <FlatList
          data={INGREDIENTS}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderItem}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Lista de ingredientes disponíveis"
        />
      </View>

      {/* Nudge toast */}
      <NudgeAlert key={nudgeKey} nudge={currentNudge} onDismiss={handleDismissNudge} />

      {/* CTA button */}
      <View style={styles.ctaContainer}>
        {hasItems && (
          <View style={styles.resetButton}>
            <Button variant="secondary" label="Limpar Mix" onPress={handleReset} />
          </View>
        )}
        <Button
          variant="primary"
          label="Gerar Minha Receita"
          onPress={() => router.push('/result')}
          disabled={!hasItems}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  jarSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    color: colors.neutral[900],
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[400],
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  listSection: {
    flex: 1,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  listTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  columnWrapper: {
    gap: COLUMN_GAP,
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: COLUMN_GAP,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  ctaContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  resetButton: {
    marginBottom: spacing.sm,
  },
});

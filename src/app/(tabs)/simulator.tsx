import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IngredientCard } from '@/components/simulator/IngredientCard';
import { MixJar } from '@/components/simulator/MixJar';
import { NudgeAlert } from '@/components/simulator/NudgeAlert';
import { Button } from '@/components/ui';
import { INGREDIENTS } from '@/data/ingredients';
import { calculateNutrition, generateNudges, MAX_CALORIES } from '@/data/nutrition-engine';
import type { NudgeMessage } from '@/data/nutrition-engine';
import { useQuizStore } from '@/stores/useQuizStore';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { colors, spacing, typography } from '@/theme';

export default function SimulatorScreen() {
  const { selectedIngredients, toggleIngredient } = useSimulatorStore();
  const nutritionProfile = useQuizStore((s) => s.nutritionProfile);
  const userTags = useMemo(() => nutritionProfile?.topNutrients ?? [], [nutritionProfile]);

  const nutrition = useMemo(() => calculateNutrition(selectedIngredients), [selectedIngredients]);

  const fillLevel = Math.min(nutrition.calories / MAX_CALORIES, 1);
  const fillColor =
    selectedIngredients.length > 0
      ? (selectedIngredients[selectedIngredients.length - 1]?.color ?? colors.primary[500])
      : colors.neutral[200];

  // Nudge queue (FIFO, 1 visible at a time)
  const [currentNudge, setCurrentNudge] = useState<NudgeMessage | null>(null);
  const nudgeQueue = useRef<NudgeMessage[]>([]);
  const prevSelectedLength = useRef(selectedIngredients.length);

  const showNextNudge = useCallback(() => {
    const next = nudgeQueue.current.shift() ?? null;
    setCurrentNudge(next);
  }, []);

  useEffect(() => {
    if (selectedIngredients.length === prevSelectedLength.current) return;
    prevSelectedLength.current = selectedIngredients.length;

    const nudges = generateNudges(nutrition, selectedIngredients, userTags as string[]);
    nudgeQueue.current.push(...nudges);
    if (!currentNudge) showNextNudge();
  }, [selectedIngredients, nutrition, userTags, currentNudge, showNextNudge]);

  const handleDismissNudge = useCallback(() => {
    setCurrentNudge(null);
    if (nudgeQueue.current.length > 0) showNextNudge();
  }, [showNextNudge]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top section — Jar (40%) */}
      <View style={styles.jarSection}>
        <Text style={styles.title} accessibilityRole="header">
          Meu Mix
        </Text>
        <Text style={styles.subtitle}>
          {selectedIngredients.length === 0
            ? 'Toque nos ingredientes para montar seu mix'
            : `${selectedIngredients.length} ingrediente${selectedIngredients.length > 1 ? 's' : ''} selecionado${selectedIngredients.length > 1 ? 's' : ''}`}
        </Text>

        <MixJar fillLevel={fillLevel} fillColor={fillColor} />
      </View>

      {/* Bottom section — Ingredient list (60%) */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Ingredientes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          accessibilityLabel="Lista de ingredientes disponíveis"
        >
          {INGREDIENTS.map((ingredient) => {
            const isSelected = selectedIngredients.some((i) => i.id === ingredient.id);
            return (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                selected={isSelected}
                onPress={toggleIngredient}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Nudge toast */}
      <NudgeAlert nudge={currentNudge} onDismiss={handleDismissNudge} />

      {/* CTA button */}
      <View style={styles.ctaContainer}>
        <Button
          variant="primary"
          label="Gerar Minha Receita"
          onPress={() => router.push('/result')}
          disabled={selectedIngredients.length === 0}
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
  listContent: {
    paddingHorizontal: spacing.lg,
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
});

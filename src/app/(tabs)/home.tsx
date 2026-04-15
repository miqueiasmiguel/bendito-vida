import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BioactiveMap } from '@/components/dashboard/BioactiveMap';
import { DailyTip } from '@/components/dashboard/DailyTip';
import type { CheckinValues } from '@/components/dashboard/WeeklyCheckinCard';
import { WeeklyCheckinCard } from '@/components/dashboard/WeeklyCheckinCard';
import { Button } from '@/components/ui';
import { INGREDIENTS } from '@/data/ingredients';
import { useProgressStore } from '@/stores/useProgressStore';
import { useQuizStore } from '@/stores/useQuizStore';
import { colors, spacing, typography } from '@/theme';

function getDailyTipIngredient() {
  return INGREDIENTS[new Date().getDay() % INGREDIENTS.length];
}

export default function HomeScreen() {
  const nutritionProfile = useQuizStore((s) => s.nutritionProfile);
  const checkins = useProgressStore((s) => s.checkins);

  const today = new Date().toLocaleDateString('en-CA');
  const todayRaw = checkins.find((c) => c.date === today);
  const existingCheckin: CheckinValues | undefined = todayRaw
    ? {
        energyScore: todayRaw.energy_score,
        sleepScore: todayRaw.sleep_score,
        focusScore: todayRaw.focus_score,
      }
    : undefined;

  const topNutrients = nutritionProfile?.topNutrients ?? [];
  const recommendedIngredients = nutritionProfile?.suggestedIngredients ?? [];
  const dailyIngredient = getDailyTipIngredient();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting} accessibilityRole="header">
          Olá!
        </Text>
        <Text style={styles.subtitle}>Veja seu perfil nutricional de hoje.</Text>

        <View style={styles.section}>
          <BioactiveMap
            topNutrients={topNutrients}
            recommendedIngredients={recommendedIngredients}
            onQuizPress={() => router.push('/(onboarding)/quiz')}
          />
        </View>

        {topNutrients.length > 0 && (
          <View style={styles.section}>
            <Button
              variant="primary"
              label="Montar meu Mix"
              onPress={() => router.push('/(tabs)/simulator')}
            />
          </View>
        )}

        <View style={styles.section}>
          <WeeklyCheckinCard
            compact
            existingCheckin={existingCheckin}
            onPress={() => router.push('/(tabs)/progress')}
          />
        </View>

        <View style={styles.section}>
          <DailyTip ingredient={dailyIngredient} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  greeting: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h1,
    lineHeight: typography.lineHeight.h1,
    color: colors.neutral[900],
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[700],
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
});

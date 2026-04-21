import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BioactiveMap } from '@/components/dashboard/BioactiveMap';
import { DailyTip } from '@/components/dashboard/DailyTip';
import { SimulatorCtaCard } from '@/components/dashboard/SimulatorCtaCard';
import { TodayStatusCard } from '@/components/dashboard/TodayStatusCard';
import { INGREDIENTS } from '@/data/ingredients';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useQuizStore } from '@/stores/useQuizStore';
import { colors, spacing, typography } from '@/theme';

function getDailyTipIngredient() {
  return INGREDIENTS[new Date().getDay() % INGREDIENTS.length];
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const nutritionProfile = useQuizStore((s) => s.nutritionProfile);
  const todayCheckin = useProgressStore((s) => {
    const today = new Date().toLocaleDateString('en-CA');
    return s.checkins.find((c) => c.date === today);
  });
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
          {user?.name ? `Olá, ${user.name.split(' ')[0]}!` : 'Olá!'}
        </Text>
        <Text style={styles.subtitle}>Veja o que preparamos para você hoje.</Text>

        <View style={styles.section}>
          <SimulatorCtaCard onPress={() => router.push('/(tabs)/simulator')} />
        </View>

        <View style={styles.section}>
          <BioactiveMap
            topNutrients={topNutrients}
            recommendedIngredients={recommendedIngredients}
            onQuizPress={() => router.push('/(onboarding)/quiz')}
            onRetakeQuiz={() => router.push('/(onboarding)/quiz')}
          />
        </View>

        <View style={styles.section}>
          <TodayStatusCard checkin={todayCheckin} onPress={() => router.push('/(tabs)/progress')} />
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

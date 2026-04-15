import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EvolutionChart } from '@/components/dashboard/EvolutionChart';
import { InsightBanner } from '@/components/dashboard/InsightBanner';
import type { CheckinValues } from '@/components/dashboard/WeeklyCheckinCard';
import { WeeklyCheckinCard } from '@/components/dashboard/WeeklyCheckinCard';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { colors, spacing, typography } from '@/theme';

export default function ProgressScreen() {
  const user = useAuthStore((s) => s.user);
  const checkins = useProgressStore((s) => s.checkins);
  const addCheckin = useProgressStore((s) => s.addCheckin);

  const today = new Date().toLocaleDateString('en-CA');
  const currentCheckin = checkins.find((c) => c.date === today);

  const existingCheckin: CheckinValues | undefined = currentCheckin
    ? {
        energyScore: currentCheckin.energy_score,
        sleepScore: currentCheckin.sleep_score,
        focusScore: currentCheckin.focus_score,
      }
    : undefined;

  const handleSubmit = (values: CheckinValues) => {
    if (user) {
      void addCheckin(user.id, values);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading} accessibilityRole="header">
          Minha Evolução
        </Text>
        <Text style={styles.subtitle}>Acompanhe como você está se sentindo.</Text>

        <View style={styles.section}>
          <WeeklyCheckinCard existingCheckin={existingCheckin} onSubmit={handleSubmit} />
        </View>

        <View style={styles.section}>
          <EvolutionChart checkins={checkins} />
        </View>

        <View style={styles.section}>
          <InsightBanner checkins={checkins} />
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
  heading: {
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

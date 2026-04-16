import { ChevronRight, ListMusic, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BioactiveMap } from '@/components/dashboard/BioactiveMap';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useQuizStore } from '@/stores/useQuizStore';
import { colors, radii, spacing, typography } from '@/theme';

function formatMemberDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function calcDaysOfUse(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
}

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const nutritionProfile = useQuizStore((s) => s.nutritionProfile);
  const { mixes, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const displayName = user?.name ?? 'Usuário';
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = user?.createdAt ? `Membro desde ${formatMemberDate(user.createdAt)}` : '';

  const topNutrients = nutritionProfile?.topNutrients ?? [];
  const recommendedIngredients = nutritionProfile?.suggestedIngredients ?? [];

  const totalMixes = mixes.length;
  const daysOfUse = user?.createdAt ? calcDaysOfUse(user.createdAt) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={styles.avatar}
            accessibilityLabel={`Avatar do usuário ${displayName}`}
            accessibilityRole="image"
          >
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          {memberSince.length > 0 && <Text style={styles.memberSince}>{memberSince}</Text>}
        </View>

        <View style={styles.content}>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard} accessibilityLabel={`${totalMixes} mixes criados`}>
              <Text style={styles.statValue}>{totalMixes}</Text>
              <Text style={styles.statLabel}>Mixes</Text>
            </View>
            <View style={styles.statCard} accessibilityLabel={`${daysOfUse} dias de uso`}>
              <Text style={styles.statValue}>{daysOfUse}</Text>
              <Text style={styles.statLabel}>Dias de uso</Text>
            </View>
          </View>

          {/* Bioactive Map */}
          <Text style={styles.sectionTitle}>Meu Mapa Bioativo</Text>
          <BioactiveMap
            topNutrients={topNutrients}
            recommendedIngredients={recommendedIngredients}
            onQuizPress={() => router.push('/(onboarding)/quiz')}
          />

          {/* Navigation */}
          <View style={[styles.navCard, styles.navSpacing]}>
            <TouchableOpacity
              style={styles.navRow}
              onPress={() => router.push('/(tabs)/profile/my-mixes')}
              accessibilityRole="button"
              accessibilityLabel="Meus Mixes"
            >
              <ListMusic size={20} color={colors.primary[700]} strokeWidth={1.75} />
              <Text style={styles.navLabel}>Meus Mixes</Text>
              <ChevronRight size={18} color={colors.neutral[400]} strokeWidth={1.75} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.navRow}
              onPress={() => router.push('/(tabs)/profile/settings')}
              accessibilityRole="button"
              accessibilityLabel="Configurações"
            >
              <Settings size={20} color={colors.primary[700]} strokeWidth={1.75} />
              <Text style={styles.navLabel}>Configurações</Text>
              <ChevronRight size={18} color={colors.neutral[400]} strokeWidth={1.75} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    backgroundColor: colors.primary[700],
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarInitial: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    color: colors.white,
  },
  userName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    color: colors.white,
  },
  memberSince: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.primary[100],
    marginTop: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    color: colors.primary[700],
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  navCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  navSpacing: {
    marginTop: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  navLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[900],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginLeft: spacing.md + 20 + spacing.md,
  },
});

import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BioactiveSummary, SavedMixCard } from '@/components/profile';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useQuizStore } from '@/stores/useQuizStore';
import { colors, radii, spacing, typography } from '@/theme';
import type { Mix } from '@/types/database';

function formatMemberDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function SkeletonCard() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.skeletonCard, animatedStyle]} />;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { nutritionProfile } = useQuizStore();
  const { mixes, isLoading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const displayName = user?.name ?? 'Usuário';
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = user?.createdAt ? `Membro desde ${formatMemberDate(user.createdAt)}` : '';

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
          {/* Mapa Bioativo */}
          <Text style={styles.sectionTitle}>Meu Mapa Bioativo</Text>
          <BioactiveSummary
            profile={nutritionProfile}
            onQuizPress={() => router.push('/(onboarding)/quiz')}
          />

          {/* Mixes Salvos */}
          <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Meus Mixes</Text>

          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!isLoading && error !== null && (
            <Text style={styles.errorText}>Não foi possível carregar seus mixes</Text>
          )}

          {!isLoading && error === null && mixes.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Você ainda não salvou nenhum mix.</Text>
              <Button
                variant="primary"
                label="Criar meu Mix"
                onPress={() => router.push('/(tabs)/simulator')}
              />
            </View>
          )}

          {!isLoading && mixes.length > 0 && (
            <FlatList<Mix>
              data={mixes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SavedMixCard mix={item} />}
              scrollEnabled={false}
            />
          )}

          {/* Configurações */}
          <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Configurações</Text>
          <Button variant="secondary" label="Sair da conta" onPress={handleSignOut} />
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
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  sectionSpacing: {
    marginTop: spacing.lg,
  },
  skeletonCard: {
    backgroundColor: colors.neutral[200],
    borderRadius: radii.card,
    height: 80,
    marginBottom: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[700],
    textAlign: 'center',
  },
  errorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.semantic.error,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});

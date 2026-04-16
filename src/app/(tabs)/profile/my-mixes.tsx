import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SavedMixCard } from '@/components/profile';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { colors, radii, spacing, typography } from '@/theme';
import type { Mix } from '@/types/database';

function SkeletonCard() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.skeletonCard, animatedStyle]} />;
}

export default function MyMixesScreen() {
  const { user } = useAuthStore();
  const { mixes, isLoading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ChevronLeft size={24} color={colors.white} strokeWidth={1.75} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Mixes</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading && (
        <View style={styles.listContent}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      )}

      {!isLoading && error !== null && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Não foi possível carregar seus mixes.</Text>
        </View>
      )}

      {!isLoading && error === null && mixes.length === 0 && (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Você ainda não salvou nenhum mix.</Text>
          <Button
            variant="primary"
            label="Criar meu Mix"
            onPress={() => router.replace('/(tabs)/simulator')}
          />
        </View>
      )}

      {!isLoading && mixes.length > 0 && (
        <FlatList<Mix>
          data={mixes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SavedMixCard
              mix={item}
              onPress={() => router.push(`/(tabs)/profile/mix-detail?mixId=${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.white,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.lg,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  skeletonCard: {
    backgroundColor: colors.neutral[200],
    borderRadius: radii.card,
    height: 80,
    marginBottom: spacing.sm,
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
  },
});

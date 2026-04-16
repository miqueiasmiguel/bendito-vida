import * as Sharing from 'expo-sharing';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

import { NutrientBar } from '@/components/simulator/NutrientBar';
import { Button, RecipeCard } from '@/components/ui';
import { INGREDIENTS } from '@/data/ingredients';
import { MAX_CALORIES } from '@/data/nutrition-engine';
import type { MixItem } from '@/stores/useSimulatorStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { colors, spacing, typography } from '@/theme';

const BAR_MAX = { calories: MAX_CALORIES, fiber: 25, protein: 50, omega3: 10 };

export default function MixDetailScreen() {
  const { mixId } = useLocalSearchParams<{ mixId: string }>();
  const { user } = useAuthStore();
  const { mixes, isLoading, fetchProfile } = useProfileStore();

  const viewShotRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (mixes.length === 0 && !isLoading && user?.id) {
      void fetchProfile(user.id);
    }
  }, [mixes.length, isLoading, user?.id, fetchProfile]);

  const mix = mixes.find((m) => m.id === mixId);

  const handleShare = useCallback(async () => {
    if (!viewShotRef.current?.capture) return;

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Compartilhamento indisponível',
        'Este dispositivo não suporta compartilhamento.',
      );
      return;
    }

    setSharing(true);
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Compartilhar Receita' });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar a receita. Tente novamente.');
    } finally {
      setSharing(false);
    }
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[700]} />
        </View>
      </SafeAreaView>
    );
  }

  if (!mix) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Mix não encontrado.</Text>
          <Button variant="secondary" label="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const ingredientObjects: MixItem[] = mix.ingredients
    .map(({ id, grams }) => {
      const ingredient = INGREDIENTS.find((i) => i.id === id);
      return ingredient ? { ingredient, grams } : null;
    })
    .filter((i): i is MixItem => i !== null);

  const { calories, fiber, protein, omega3 } = mix.nutrition;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar para Meus Mixes"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe do Mix</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Nutrient bars */}
        <View style={styles.nutritionSection}>
          <Text style={styles.nutritionTitle}>Perfil Nutricional</Text>
          <View style={styles.barsContainer}>
            <NutrientBar
              label="Fibras"
              value={fiber}
              unit="g"
              maxValue={BAR_MAX.fiber}
              color={colors.semantic.success}
            />
            <NutrientBar
              label="Proteínas"
              value={protein}
              unit="g"
              maxValue={BAR_MAX.protein}
              color={colors.semantic.info}
            />
            <NutrientBar
              label="Ômega-3"
              value={omega3}
              unit="g"
              maxValue={BAR_MAX.omega3}
              color={colors.semantic.warning}
            />
            <NutrientBar
              label="Calorias"
              value={calories}
              unit="kcal"
              maxValue={BAR_MAX.calories}
              color={calories > 500 ? colors.semantic.error : colors.neutral[400]}
            />
          </View>
        </View>

        {/* Shareable recipe card */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.95 }}
          style={styles.viewShot}
        >
          <RecipeCard title={mix.name} ingredients={ingredientObjects} nutrition={mix.nutrition} />
        </ViewShot>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.shareButton, sharing && styles.buttonLoading]}
          onPress={handleShare}
          disabled={sharing}
          accessibilityRole="button"
          accessibilityLabel="Compartilhar receita"
        >
          {sharing ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.shareButtonText}>Compartilhar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.primary[700],
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
    textAlign: 'center',
  },
  headerSpacer: {
    minWidth: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  nutritionSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  nutritionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  barsContainer: {
    gap: spacing.sm,
  },
  viewShot: {
    backgroundColor: colors.neutral[50],
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  shareButton: {
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  shareButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.white,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.neutral[700],
    textAlign: 'center',
  },
});

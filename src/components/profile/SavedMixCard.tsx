import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { INGREDIENTS } from '@/data/ingredients';
import { colors, radii, spacing, typography } from '@/theme';
import type { SavedMix } from '@/types/profile';

export interface SavedMixCardProps {
  mix: SavedMix;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function SavedMixCard({ mix }: SavedMixCardProps) {
  const formattedDate = formatDate(mix.createdAt);

  const ingredientNames = mix.ingredientIds
    .map((id) => INGREDIENTS.find((i) => i.id === id)?.name ?? id)
    .filter(Boolean);

  const displayed = ingredientNames.slice(0, 3);
  const extra = ingredientNames.length - displayed.length;
  const ingredientText = extra > 0 ? `${displayed.join(', ')} +${extra}` : displayed.join(', ');

  return (
    <View
      style={styles.card}
      accessibilityLabel={`Mix ${mix.name}, criado em ${formattedDate}`}
      accessibilityRole="none"
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {mix.name}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {ingredientText.length > 0 && (
        <Text style={styles.ingredients} numberOfLines={1}>
          {ingredientText}
        </Text>
      )}

      <View style={styles.nutritionRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{mix.calories} kcal</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{mix.proteins}g proteína</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[900],
    flex: 1,
    marginRight: spacing.sm,
  },
  date: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[400],
  },
  ingredients: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary[100],
    borderRadius: radii.badge,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.primary[700],
  },
});

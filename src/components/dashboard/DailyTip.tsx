import { Lightbulb } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Ingredient } from '@/data/ingredients';
import { colors, radii, spacing, typography } from '@/theme';

export interface DailyTipProps {
  ingredient: Ingredient;
}

// Maps the first NutrientTag to a human-readable benefit phrase
function getBenefit(ingredient: Ingredient): string {
  const tag = ingredient.nutrients[0];
  const benefitMap: Record<string, string> = {
    'vitamina-c': 'Reforça o sistema imune',
    'vitamina-b12': 'Combate o cansaço',
    'vitamina-e': 'Antioxidante poderoso',
    omega3: 'Ótimo para o cérebro',
    ferro: 'Combate a anemia',
    calcio: 'Fortalece os ossos',
    magnesio: 'Ajuda na disposição',
    zinco: 'Protege as células',
    selenio: 'Ação antioxidante',
    fibra: 'Regula o intestino',
    proteina: 'Constrói músculos',
    prebiotico: 'Alimenta a microbiota',
    cromo: 'Regula o açúcar no sangue',
  };
  return tag ? (benefitMap[tag] ?? ingredient.description) : ingredient.description;
}

export function DailyTip({ ingredient }: DailyTipProps) {
  return (
    <View style={styles.card} accessibilityLabel={`Dica do dia: ${ingredient.name}`}>
      <View style={styles.iconRow}>
        <Lightbulb
          color={colors.accent[500]}
          size={18}
          strokeWidth={2}
          accessibilityElementsHidden
        />
        <Text style={styles.label}>Dica do dia</Text>
      </View>
      <Text style={styles.name}>{ingredient.name}</Text>
      <Text style={styles.benefit}>{getBenefit(ingredient)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent[100],
    borderRadius: radii.card,
    padding: spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.accent[500],
  },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  benefit: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
  },
});

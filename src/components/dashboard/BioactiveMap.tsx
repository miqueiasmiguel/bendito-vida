import { Leaf, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Ingredient } from '@/data/ingredients';
import type { NutrientTag } from '@/data/quiz-questions';
import { colors, radii, spacing, typography } from '@/theme';

import { BioactiveRadarChart } from './BioactiveRadarChart';
import type { RadarDataPoint } from './BioactiveRadarChart';

const OVERLAY_BG = 'rgba(0, 0, 0, 0.4)';

const NUTRIENT_SHORT: Record<NutrientTag, string> = {
  'vitamina-c': 'Vit. C',
  'vitamina-b12': 'Vit. B12',
  'vitamina-e': 'Vit. E',
  omega3: 'Ômega-3',
  ferro: 'Ferro',
  calcio: 'Cálcio',
  magnesio: 'Magnésio',
  zinco: 'Zinco',
  selenio: 'Selênio',
  fibra: 'Fibras',
  proteina: 'Proteína',
  prebiotico: 'Prebiótic',
  cromo: 'Cromo',
};

// Representative fill levels (visual only — no exact quantity data)
const RADAR_VALUES = [100, 82, 68, 55, 44, 35];

function buildRadarData(nutrients: NutrientTag[]): RadarDataPoint[] {
  return nutrients.slice(0, 6).map((tag, i) => ({
    label: NUTRIENT_SHORT[tag],
    value: RADAR_VALUES[i] ?? 35,
    maxValue: 100,
  }));
}

export interface BioactiveMapProps {
  topNutrients: NutrientTag[];
  recommendedIngredients: Ingredient[];
  onQuizPress?: () => void;
  onRetakeQuiz?: () => void;
}

export function BioactiveMap({
  topNutrients,
  recommendedIngredients,
  onQuizPress,
  onRetakeQuiz,
}: BioactiveMapProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  function handleRetakeQuiz() {
    setMenuVisible(false);
    onRetakeQuiz?.();
  }

  const cardHeader = (
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>Mapa Bioativo</Text>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
        accessibilityLabel="Opções do Mapa Bioativo"
        accessibilityRole="button"
      >
        <MoreVertical size={20} color={colors.neutral[700]} strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );

  const contextMenu = (
    <Modal
      visible={menuVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
        <View style={styles.menuSheet}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleRetakeQuiz}
            accessibilityRole="button"
            accessibilityLabel="Refazer quiz"
          >
            <Text style={styles.menuItemText}>Refazer quiz</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setMenuVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
          >
            <Text style={styles.menuCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  if (topNutrients.length === 0) {
    return (
      <View style={styles.card} accessibilityLabel="Mapa Bioativo — quiz não concluído">
        {cardHeader}
        {contextMenu}
        <Text style={styles.emptyText}>
          Complete o quiz para ver seus nutrientes prioritários e ingredientes recomendados.
        </Text>
        {onQuizPress && (
          <Text
            style={styles.quizLink}
            onPress={onQuizPress}
            accessibilityRole="button"
            accessibilityLabel="Fazer Quiz"
          >
            Fazer Quiz →
          </Text>
        )}
      </View>
    );
  }

  const radarData = buildRadarData(topNutrients);
  const displayedIngredients = recommendedIngredients.slice(0, 5);

  return (
    <View style={styles.card} accessibilityLabel="Mapa Bioativo">
      {cardHeader}
      {contextMenu}

      <View style={styles.chartSection}>
        <BioactiveRadarChart data={radarData} />
      </View>

      <Text style={styles.sectionSubtitle}>Ingredientes recomendados</Text>
      <View style={styles.ingredientsRow}>
        {displayedIngredients.map((ingredient) => (
          <View key={ingredient.id} style={styles.ingredientChip}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            {ingredient.isParaibano && (
              <View style={styles.leafSeal} accessibilityLabel="Ingrediente paraibano">
                <Leaf size={10} color={colors.neutral[50]} strokeWidth={2} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.neutral[900],
  },
  menuButton: {
    padding: spacing.sm,
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[100],
    borderRadius: radii.badge,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    overflow: 'visible',
  },
  ingredientName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.primary[700],
  },
  leafSeal: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[700],
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[700],
    marginBottom: spacing.md,
  },
  quizLink: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.primary[700],
  },
  // Context menu modal
  overlay: {
    flex: 1,
    backgroundColor: OVERLAY_BG,
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  menuItem: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.neutral[200],
  },
  menuItemText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.primary[700],
  },
  menuCancelText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.neutral[700],
  },
});

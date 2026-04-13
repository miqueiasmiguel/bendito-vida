import { ClipboardList } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

// ─── Shared types ────────────────────────────────────────────────────────────

export interface CheckinValues {
  energyScore: number;
  sleepScore: number;
  focusScore: number;
}

export interface WeeklyCheckinCardProps {
  /**
   * compact=true → home screen teaser with a single "Responder" button.
   * compact=false (default) → full form with 3 scales.
   */
  compact?: boolean;
  /** Called when the compact card's "Responder" button is pressed. */
  onPress?: () => void;
  /** Pre-filled values when check-in is already done (full mode → read-only). */
  existingCheckin?: CheckinValues;
  /** Called with final scores when the user submits the full form. */
  onSubmit?: (values: CheckinValues) => void;
}

// ─── Scale labels ─────────────────────────────────────────────────────────────

const SCALE_LABELS = [1, 2, 3, 4, 5] as const;

const SCALE_DESCRIPTIONS: Record<number, string> = {
  1: 'Muito ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Ótimo',
};

// ─── Sub-component: ScaleRow ──────────────────────────────────────────────────

interface ScaleRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  readonly: boolean;
}

function ScaleRow({ label, value, onChange, readonly }: ScaleRowProps) {
  return (
    <View style={scale.row}>
      <Text style={scale.label}>{label}</Text>
      <View
        style={scale.dots}
        accessibilityLabel={`${label}: ${value ? SCALE_DESCRIPTIONS[value] : 'Não selecionado'}`}
      >
        {SCALE_LABELS.map((n) => (
          <TouchableOpacity
            key={n}
            style={[scale.dot, value === n && scale.dotActive]}
            onPress={() => !readonly && onChange(n)}
            disabled={readonly}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityLabel={`${n} — ${SCALE_DESCRIPTIONS[n]}`}
            accessibilityState={{ selected: value === n, disabled: readonly }}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text style={[scale.dotLabel, value === n && scale.dotLabelActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WeeklyCheckinCard({
  compact = false,
  onPress,
  existingCheckin,
  onSubmit,
}: WeeklyCheckinCardProps) {
  const [energy, setEnergy] = useState(existingCheckin?.energyScore ?? 0);
  const [sleep, setSleep] = useState(existingCheckin?.sleepScore ?? 0);
  const [focus, setFocus] = useState(existingCheckin?.focusScore ?? 0);

  const isReadOnly = !!existingCheckin;
  const canSubmit = energy > 0 && sleep > 0 && focus > 0 && !isReadOnly;

  // ── Compact (home teaser) ────────────────────────────────────────────────
  if (compact) {
    return (
      <View style={styles.card} accessibilityLabel="Check-in da semana">
        <View style={styles.content}>
          <ClipboardList
            color={colors.primary[700]}
            size={22}
            strokeWidth={1.5}
            accessibilityElementsHidden
          />
          <View style={styles.text}>
            <Text style={styles.title}>Check-in da semana</Text>
            <Text style={styles.subtitle}>Como você está se sentindo?</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Responder check-in da semana"
          activeOpacity={0.8}
        >
          <Text style={styles.buttonLabel}>Responder</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Full form ────────────────────────────────────────────────────────────
  return (
    <View style={styles.card} accessibilityLabel="Formulário de check-in semanal">
      <View style={styles.formHeader}>
        <ClipboardList
          color={colors.primary[700]}
          size={22}
          strokeWidth={1.5}
          accessibilityElementsHidden
        />
        <Text style={styles.title}>Check-in da semana</Text>
      </View>

      {isReadOnly && <Text style={styles.doneLabel}>Check-in da semana realizado ✓</Text>}

      <View style={styles.scales}>
        <ScaleRow label="Disposição" value={energy} onChange={setEnergy} readonly={isReadOnly} />
        <ScaleRow label="Sono" value={sleep} onChange={setSleep} readonly={isReadOnly} />
        <ScaleRow label="Foco" value={focus} onChange={setFocus} readonly={isReadOnly} />
      </View>

      {!isReadOnly && (
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={() => {
            if (canSubmit && onSubmit) {
              onSubmit({ energyScore: energy, sleepScore: sleep, focusScore: focus });
            }
          }}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityLabel="Registrar check-in"
          accessibilityState={{ disabled: !canSubmit }}
          activeOpacity={0.8}
        >
          <Text style={styles.submitLabel}>Registrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  text: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.neutral[900],
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
  },
  button: {
    backgroundColor: colors.primary[100],
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.primary[700],
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  doneLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.semantic.success,
    marginBottom: spacing.md,
  },
  scales: {
    gap: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.accent[500],
    borderRadius: radii.button,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.neutral[200],
  },
  submitLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.white,
  },
});

const scale = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
    flex: 1,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dotActive: {
    backgroundColor: colors.primary[700],
    borderColor: colors.primary[700],
  },
  dotLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[400],
  },
  dotLabelActive: {
    color: colors.white,
  },
});

import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { NudgeMessage } from '@/data/nutrition-engine';
import { colors, radii, spacing, typography } from '@/theme';

const TYPE_COLORS: Record<NudgeMessage['type'], string> = {
  warning: colors.accent[500],
  suggestion: colors.primary[700],
  info: colors.semantic.info,
};

export interface NudgeAlertProps {
  nudge: NudgeMessage | null;
  onDismiss: () => void;
}

export function NudgeAlert({ nudge, onDismiss }: NudgeAlertProps) {
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!nudge) return;

    // Slide up and fade in, hold, then fade out
    translateY.value = 60;
    opacity.value = 0;

    translateY.value = withSequence(
      withTiming(0, { duration: 300 }),
      withDelay(2700, withTiming(60, { duration: 300 })),
    );

    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(
        2700,
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) runOnJS(onDismiss)();
        }),
      ),
    );
  }, [nudge, translateY, opacity, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!nudge) return null;

  const bgColor = TYPE_COLORS[nudge.type];

  return (
    <Animated.View
      style={[styles.toast, { backgroundColor: bgColor }, animatedStyle]}
      accessibilityRole="alert"
      accessibilityLabel={nudge.message}
      pointerEvents="none"
    >
      <Text style={styles.text}>{nudge.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 80,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radii.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.white,
    textAlign: 'center',
  },
});

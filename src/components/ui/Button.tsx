import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

export interface ButtonProps {
  variant: 'primary' | 'secondary';
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  leftIcon?: React.ReactNode;
}

export function Button({
  variant,
  label,
  onPress,
  disabled = false,
  accessibilityLabel,
  leftIcon,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      activeOpacity={0.8}
    >
      <View style={styles.inner}>
        {leftIcon ? <View style={styles.iconWrapper}>{leftIcon}</View> : null}
        <Text
          style={[
            styles.label,
            variant === 'primary' ? styles.labelPrimary : styles.labelSecondary,
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radii.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: spacing.sm,
  },
  primary: {
    backgroundColor: colors.accent[500],
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: colors.primary[700],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  labelPrimary: {
    color: colors.white,
  },
  labelSecondary: {
    color: colors.primary[700],
  },
});

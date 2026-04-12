import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

interface DecorativeCircleProps {
  color: string;
  delay: number;
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

function DecorativeCircle({ color, delay, size, top, bottom, left, right }: DecorativeCircleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, [delay, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.decorativeCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          bottom,
          left,
          right,
        },
        animStyle,
      ]}
    />
  );
}

export default function WelcomeScreen() {
  const logoScale = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { stiffness: 100, damping: 15 });
  }, [logoScale]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/register');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <DecorativeCircle color={colors.accent[500]} delay={0} size={120} top={60} right={-20} />
      <DecorativeCircle color={colors.primary[500]} delay={100} size={80} top={160} left={-10} />
      <DecorativeCircle color={colors.accent[100]} delay={200} size={60} bottom={200} right={30} />
      <DecorativeCircle color={colors.primary[100]} delay={300} size={100} bottom={100} left={20} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Text style={styles.logoText}>Bendito Vida</Text>
          <Text style={styles.tagline}>Alimentação saudável com os sabores da Paraíba</Text>
        </Animated.View>

        <View style={styles.ctaContainer}>
          <Button variant="primary" label="Começar" onPress={handleStart} />
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginLink}
            accessibilityRole="link"
            accessibilityLabel="Já tenho conta"
          >
            <Text style={styles.loginText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  decorativeCircle: {
    position: 'absolute',
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary[700],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h1,
    lineHeight: typography.lineHeight.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  loginLink: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.white,
    textDecorationLine: 'underline',
  },
});

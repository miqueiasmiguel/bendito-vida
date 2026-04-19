import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, GoogleIcon } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { colors, spacing, typography } from '@/theme';

WebBrowser.maybeCompleteAuthSession();

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
  const { user, isLoading, error, sessionChecked, signInWithGoogle, clearError } = useAuthStore();

  useEffect(() => {
    logoScale.value = withSpring(1, { stiffness: 100, damping: 15 });
  }, [logoScale]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  // Redirect when authenticated
  useEffect(() => {
    if (user && sessionChecked) {
      router.replace('/(tabs)/home');
    }
  }, [user, sessionChecked]);

  // Show spinner while Supabase checks the persisted session
  if (!sessionChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    );
  }

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
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.errorDismiss} onPress={clearError}>
                Fechar
              </Text>
            </View>
          ) : null}

          <Button
            variant="primary"
            label={isLoading ? 'Entrando…' : 'Entrar com Google'}
            onPress={signInWithGoogle}
            disabled={isLoading}
            accessibilityLabel="Entrar com Google"
            leftIcon={<GoogleIcon size={20} />}
          />

          <Text style={styles.privacyNotice}>
            Ao continuar, você concorda com nossa{' '}
            <Text
              style={styles.privacyLink}
              onPress={() => {
                Linking.openURL(
                  'https://miqueiasmiguel.github.io/bendito-vida/privacy-policy.html',
                ).catch(() => {});
              }}
              accessibilityRole="link"
              accessibilityLabel="política de privacidade"
            >
              política de privacidade
            </Text>
          </Text>

          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.white}
              accessibilityLabel="Carregando autenticação"
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const WHITE_80 = `${colors.white}CC`;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
  },
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
  errorContainer: {
    width: '100%',
    backgroundColor: colors.accent[100],
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.neutral[900],
    textAlign: 'center',
  },
  errorDismiss: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.body,
    color: colors.primary[700],
    minHeight: 44,
    paddingVertical: spacing.sm,
    textDecorationLine: 'underline',
  },
  privacyNotice: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: WHITE_80,
    textAlign: 'center',
  },
  privacyLink: {
    color: colors.white,
    textDecorationLine: 'underline',
  },
});

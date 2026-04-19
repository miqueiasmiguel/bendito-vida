import '@/lib/crypto-polyfill';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PoppinsRegular from '@/assets/fonts/Poppins-Regular.ttf';
import PoppinsSemiBold from '@/assets/fonts/Poppins-SemiBold.ttf';
import { useAuthStore } from '@/stores/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': PoppinsRegular,
    'Poppins-SemiBold': PoppinsSemiBold,
  });

  const { user, sessionChecked, onboardingChecked, onboardingCompleted } = useAuthStore();

  // appReady when: fonts done AND session known AND (no user OR profile fetched)
  const appReady =
    (fontsLoaded || !!fontError) && sessionChecked && (user === null || onboardingChecked);

  // Hide splash only after fonts AND auth/onboarding state are resolved
  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Onboarding gate: authenticated users who never completed onboarding go to quiz
  useEffect(() => {
    if (!appReady) return;
    if (user && !onboardingCompleted) {
      router.replace('/(onboarding)/quiz');
    }
  }, [appReady, user, onboardingCompleted]);

  // Keep splash visible until everything is ready
  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

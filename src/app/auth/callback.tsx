import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { supabase } from '@/lib/supabase';
import { colors } from '@/theme';

// Android delivers the OAuth deep link as a navigation intent, so Expo Router
// routes to this screen instead of returning the URL inside openAuthSessionAsync.
// This screen exchanges the PKCE code for a session and navigates to home.
export default function AuthCallbackScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();

  useEffect(() => {
    if (!code) {
      router.replace('/');
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          console.error('[AuthCallback] exchangeCodeForSession error:', error.message);
          router.replace('/');
        } else {
          router.replace('/(tabs)/home');
        }
      })
      .catch(() => {
        router.replace('/');
      });
  }, [code]);

  return (
    <View style={styles.container}>
      <ActivityIndicator testID="auth-callback-loading" size="large" color={colors.primary[700]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
  },
});

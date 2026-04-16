import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { colors, radii, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const { user, setUser, signOut } = useAuthStore();
  const { updateName } = useProfileStore();

  const [name, setName] = useState(user?.name ?? '');
  const [nameError, setNameError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (name.trim().length === 0) {
      setNameError('O nome não pode ser vazio.');
      return;
    }
    setNameError('');
    setIsSaving(true);
    try {
      await updateName(user!.id, name.trim());
      setUser({ ...user!, name: name.trim() });
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ChevronLeft size={24} color={colors.white} strokeWidth={1.75} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Nome de exibição</Text>
          <TextInput
            style={[styles.input, nameError.length > 0 && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError('');
              if (saveStatus !== 'idle') setSaveStatus('idle');
            }}
            placeholder="Seu nome"
            placeholderTextColor={colors.neutral[400]}
            accessibilityLabel="Campo de nome"
          />
          {nameError.length > 0 && <Text style={styles.fieldError}>{nameError}</Text>}

          {saveStatus === 'success' && (
            <Text style={styles.successText}>Nome atualizado com sucesso!</Text>
          )}
          {saveStatus === 'error' && (
            <Text style={styles.errorFeedback}>Não foi possível salvar. Tente novamente.</Text>
          )}

          <View style={styles.saveButton}>
            <Button
              variant="primary"
              label={isSaving ? 'Salvando...' : 'Salvar'}
              onPress={handleSave}
            />
          </View>

          <View style={styles.signOutSection}>
            <Button variant="secondary" label="Sair da conta" onPress={handleSignOut} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary[700],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    color: colors.white,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.caption,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: radii.input,
    padding: spacing.md,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.neutral[900],
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.semantic.error,
  },
  fieldError: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small,
    color: colors.semantic.error,
    marginTop: spacing.xs,
  },
  successText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.semantic.success,
    marginTop: spacing.sm,
  },
  errorFeedback: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    color: colors.semantic.error,
    marginTop: spacing.sm,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  signOutSection: {
    marginTop: spacing.xxl,
  },
});

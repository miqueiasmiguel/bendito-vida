import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuizOption } from '@/components/quiz/QuizOption';
import { QuizProgressBar } from '@/components/quiz/QuizProgressBar';
import { Button } from '@/components/ui';
import { QUIZ_QUESTIONS, type QuizQuestion } from '@/data/quiz-questions';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuizStore } from '@/stores/useQuizStore';
import { colors, spacing, typography } from '@/theme';
import { matchProfile } from '@/utils/match-profile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL = QUIZ_QUESTIONS.length;

interface QuizPageProps {
  question: QuizQuestion;
  selectedIds: string[];
  onSelect: (optionId: string) => void;
}

function QuizPage({ question, selectedIds, onSelect }: QuizPageProps) {
  return (
    <ScrollView
      style={[styles.page, { width: SCREEN_WIDTH }]}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.questionText}>{question.text}</Text>
      <View style={styles.optionsList}>
        {question.options.map((option) => (
          <QuizOption
            key={option.id}
            label={option.label}
            selected={selectedIds.includes(option.id)}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

export default function QuizScreen() {
  const [step, setStep] = useState(0);
  const flatListRef = useRef<FlatList<QuizQuestion>>(null);
  const { answers, setAnswer, setProfile } = useQuizStore();
  const { markOnboardingComplete } = useAuthStore();
  const buttonOpacity = useSharedValue(0);

  const currentQuestion = QUIZ_QUESTIONS[step];
  const currentAnswers = answers[currentQuestion.id] ?? [];
  const hasSelection = currentAnswers.length > 0;
  const isLastStep = step === TOTAL - 1;

  // Animate button in/out based on selection
  useEffect(() => {
    buttonOpacity.value = withTiming(hasSelection ? 1 : 0, { duration: 300 });
  }, [hasSelection, buttonOpacity]);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleSelect = useCallback(
    (optionId: string) => {
      setAnswer(currentQuestion.id, optionId, currentQuestion.multiSelect);
    },
    [currentQuestion.id, currentQuestion.multiSelect, setAnswer],
  );

  const handleBack = useCallback(() => {
    if (step === 0) {
      router.back();
    } else {
      const prevStep = step - 1;
      setStep(prevStep);
      flatListRef.current?.scrollToIndex({ index: prevStep, animated: true });
    }
  }, [step]);

  const handleNext = useCallback(async () => {
    if (isLastStep) {
      const profile = matchProfile(answers);
      setProfile(profile);
      try {
        await markOnboardingComplete(profile);
      } catch (err) {
        console.error('[Quiz] Failed to persist onboarding flag:', err);
      }
      router.replace('/(tabs)/home');
    } else {
      const nextStep = step + 1;
      setStep(nextStep);
      flatListRef.current?.scrollToIndex({ index: nextStep, animated: true });
    }
  }, [isLastStep, step, answers, setProfile, markOnboardingComplete]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ChevronLeft color={colors.neutral[700]} size={24} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.progressWrapper}>
          <QuizProgressBar current={step + 1} total={TOTAL} />
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        ref={flatListRef}
        data={QUIZ_QUESTIONS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <QuizPage
            question={item}
            selectedIds={answers[item.id] ?? []}
            onSelect={
              item.id === currentQuestion.id
                ? handleSelect
                : (optionId) => setAnswer(item.id, optionId, item.multiSelect)
            }
          />
        )}
        style={styles.flatList}
      />

      <View style={styles.actionArea}>
        {step > 0 && (
          <View style={styles.buttonFlex}>
            <Button
              variant="secondary"
              label="Voltar"
              onPress={handleBack}
              accessibilityLabel="Voltar para a pergunta anterior"
            />
          </View>
        )}
        <Animated.View
          style={[styles.buttonFlex, buttonAnimStyle]}
          pointerEvents={hasSelection ? 'auto' : 'none'}
        >
          <Button
            variant="primary"
            label={isLastStep ? 'Concluir' : 'Próximo'}
            onPress={handleNext}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  flatList: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  questionText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
  },
  optionsList: {
    gap: spacing.xs,
  },
  actionArea: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  buttonFlex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrapper: {
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
});

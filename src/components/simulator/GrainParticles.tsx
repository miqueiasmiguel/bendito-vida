import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const PARTICLE_COUNT = 6;
const FALL_DURATION = 400; // ms per particle
const STAGGER_MAX = 200; // max stagger between particles
const HORIZONTAL_SPREAD = 15; // ±px from center
const CONTAINER_HEIGHT = 250; // overlay height matching jar area
const DROP_START_Y = 20; // start above jar opening
const DROP_DISTANCE = 180; // total fall distance

export interface GrainParticlesProps {
  /** Color of the grain being added */
  color: string;
  /** Incremented each time a grain is added — triggers animation */
  trigger: number;
}

interface ParticleConfig {
  delay: number;
  offsetX: number;
  size: number;
}

function generateParticles(): ParticleConfig[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    delay: Math.random() * STAGGER_MAX,
    offsetX: (Math.random() - 0.5) * 2 * HORIZONTAL_SPREAD,
    size: 4 + Math.random() * 4, // 4-8px diameter
  }));
}

function Particle({
  config,
  color,
  trigger,
}: {
  config: ParticleConfig;
  color: string;
  trigger: number;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    // Reset instantly
    translateY.value = 0;
    opacity.value = 1;
    // Animate fall
    translateY.value = withDelay(
      config.delay,
      withTiming(DROP_DISTANCE, { duration: FALL_DURATION }),
    );
    // Fade out in last 100ms
    opacity.value = withDelay(config.delay + FALL_DURATION - 100, withTiming(0, { duration: 100 }));
  }, [trigger, config.delay, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: color,
          left: CONTAINER_HEIGHT / 2 + config.offsetX - config.size / 2,
          top: DROP_START_Y,
        },
        animatedStyle,
      ]}
    />
  );
}

export function GrainParticles({ color, trigger }: GrainParticlesProps) {
  // Re-gen particle configs on each trigger to vary appearance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const particles = useMemo(() => generateParticles(), [trigger]);

  if (trigger === 0) return null;

  return (
    <View
      style={styles.container}
      pointerEvents="none"
      accessibilityLabel="Animação de grãos caindo"
    >
      {particles.map((config, index) => (
        <Particle key={`${trigger}-${index}`} config={config} color={color} trigger={trigger} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop, Svg } from 'react-native-svg';

import { colors } from '@/theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const JAR_WIDTH = 140;
const JAR_HEIGHT = 180;
const JAR_NECK_WIDTH = 80;
const JAR_BODY_WIDTH = 130;
const LIQUID_MAX_HEIGHT = 140; // max fill area (excluding jar walls top/bottom)
const LIQUID_Y_BOTTOM = 160; // y coordinate of liquid bottom edge

export interface MixJarProps {
  fillLevel: number; // 0–1
  fillColor: string;
}

export function MixJar({ fillLevel, fillColor }: MixJarProps) {
  const animatedFill = useSharedValue(fillLevel);

  React.useEffect(() => {
    animatedFill.value = withTiming(fillLevel, { duration: 300 });
  }, [fillLevel, animatedFill]);

  const animatedProps = useAnimatedProps(() => {
    const liquidHeight = animatedFill.value * LIQUID_MAX_HEIGHT;
    return {
      height: liquidHeight,
      y: LIQUID_Y_BOTTOM - liquidHeight,
    };
  });

  // Jar shape: body + neck + lid area
  // Centered at x=70
  const bodyLeft = (JAR_WIDTH - JAR_BODY_WIDTH) / 2;
  const neckLeft = (JAR_WIDTH - JAR_NECK_WIDTH) / 2;

  // Jar outline path (rough mason jar silhouette)
  const jarPath = [
    `M ${neckLeft} 20`,
    `L ${neckLeft} 35`,
    `Q ${neckLeft - 10} 45 ${bodyLeft} 55`,
    `L ${bodyLeft} ${LIQUID_Y_BOTTOM}`,
    `Q ${bodyLeft} ${LIQUID_Y_BOTTOM + 12} ${bodyLeft + 10} ${LIQUID_Y_BOTTOM + 12}`,
    `L ${bodyLeft + JAR_BODY_WIDTH - 10} ${LIQUID_Y_BOTTOM + 12}`,
    `Q ${bodyLeft + JAR_BODY_WIDTH} ${LIQUID_Y_BOTTOM + 12} ${bodyLeft + JAR_BODY_WIDTH} ${LIQUID_Y_BOTTOM}`,
    `L ${bodyLeft + JAR_BODY_WIDTH} 55`,
    `Q ${neckLeft + JAR_NECK_WIDTH + 10} 45 ${neckLeft + JAR_NECK_WIDTH} 35`,
    `L ${neckLeft + JAR_NECK_WIDTH} 20`,
    `Z`,
  ].join(' ');

  // Clip path for liquid (same shape as jar interior)
  const clipPath = [
    `M ${bodyLeft + 2} 55`,
    `L ${bodyLeft + 2} ${LIQUID_Y_BOTTOM}`,
    `L ${bodyLeft + JAR_BODY_WIDTH - 2} ${LIQUID_Y_BOTTOM}`,
    `L ${bodyLeft + JAR_BODY_WIDTH - 2} 55`,
    `Z`,
  ].join(' ');

  return (
    <View style={styles.container} accessibilityLabel="Jarro com ingredientes selecionados">
      <Svg width={JAR_WIDTH} height={JAR_HEIGHT + 20}>
        <Defs>
          <LinearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={fillColor} stopOpacity="0.85" />
            <Stop offset="1" stopColor={fillColor} stopOpacity="0.6" />
          </LinearGradient>
          <ClipPath id="jarBodyClip">
            <Path d={clipPath} />
          </ClipPath>
        </Defs>

        {/* Jar body fill (white) */}
        <Path d={jarPath} fill={colors.white} stroke="none" />

        {/* Liquid fill (animated, clipped to jar interior) */}
        <G clipPath="url(#jarBodyClip)">
          <AnimatedRect
            x={bodyLeft + 2}
            width={JAR_BODY_WIDTH - 4}
            fill="url(#liquidGrad)"
            animatedProps={animatedProps}
          />
        </G>

        {/* Jar outline */}
        <Path d={jarPath} fill="none" stroke={colors.neutral[200]} strokeWidth={2} />

        {/* Lid */}
        <Rect
          x={neckLeft - 4}
          y={12}
          width={JAR_NECK_WIDTH + 8}
          height={10}
          rx={3}
          fill={colors.primary[700]}
        />
        <Rect
          x={neckLeft + 2}
          y={8}
          width={JAR_NECK_WIDTH - 4}
          height={6}
          rx={2}
          fill={colors.primary[500]}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

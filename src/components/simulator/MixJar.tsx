import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { ClipPath, Defs, G, Line, Path, Rect, Svg } from 'react-native-svg';

import { colors } from '@/theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

// New jar dimensions (task 1.1)
const JAR_WIDTH = 180;
const JAR_HEIGHT = 220;
const SVG_HEIGHT = JAR_HEIGHT + 30; // extra space for lid

// Jar body geometry
const BODY_WIDTH = 160;
const BODY_LEFT = (JAR_WIDTH - BODY_WIDTH) / 2; // 10
const BODY_RIGHT = BODY_LEFT + BODY_WIDTH; // 170
const BODY_TOP = 65;
const BODY_BOTTOM = 215;
const BODY_RADIUS = 16;

// Neck geometry
const NECK_WIDTH = 80;
const NECK_LEFT = (JAR_WIDTH - NECK_WIDTH) / 2; // 50
const NECK_RIGHT = NECK_LEFT + NECK_WIDTH; // 130

// Liquid fill area
const LIQUID_Y_TOP = BODY_TOP + 2;
const LIQUID_Y_BOTTOM = BODY_BOTTOM - 2;
const LIQUID_MAX_HEIGHT = LIQUID_Y_BOTTOM - LIQUID_Y_TOP;
const LIQUID_X_LEFT = BODY_LEFT + 2;
const LIQUID_X_RIGHT = BODY_RIGHT - 2;
const LIQUID_WIDTH = LIQUID_X_RIGHT - LIQUID_X_LEFT;

export interface FillStop {
  color: string;
  weight: number;
}

export interface MixJarProps {
  fillLevel: number; // 0–1
  fillStops: FillStop[];
}

export interface LayerRect {
  y: number;
  height: number;
  color: string;
  opacity: number;
}

export function computeLayerRects(fillStops: FillStop[], fillLevel: number): LayerRect[] {
  const totalWeight = fillStops.reduce((sum, s) => sum + s.weight, 0);
  if (fillStops.length === 0 || totalWeight === 0 || fillLevel === 0) {
    return [];
  }

  const fillHeight = fillLevel * LIQUID_MAX_HEIGHT;
  const layers: LayerRect[] = [];
  let currentY = LIQUID_Y_BOTTOM;

  for (let i = 0; i < fillStops.length; i++) {
    const stop = fillStops[i];
    const proportion = stop.weight / totalWeight;
    const layerHeight = proportion * fillHeight;
    const y = currentY - layerHeight;
    // Alternate subtle opacity for texture
    const opacity = i % 2 === 0 ? 1.0 : 0.88;
    layers.push({ y, height: layerHeight, color: stop.color, opacity });
    currentY = y;
  }

  return layers;
}

/** Animated single layer rect — animates y and height via Reanimated 4 (task 2.4) */
function AnimatedLayer({ layer }: { layer: LayerRect }) {
  const animY = useSharedValue(layer.y);
  const animH = useSharedValue(layer.height);

  React.useEffect(() => {
    animY.value = withTiming(layer.y, { duration: 300 });
    animH.value = withTiming(layer.height, { duration: 300 });
  }, [layer.y, layer.height, animY, animH]);

  const props = useAnimatedProps(() => ({
    y: animY.value,
    height: animH.value,
  }));

  return (
    <AnimatedRect
      x={LIQUID_X_LEFT}
      width={LIQUID_WIDTH}
      fill={layer.color}
      opacity={layer.opacity}
      animatedProps={props}
    />
  );
}

export function MixJar({ fillLevel, fillStops }: MixJarProps) {
  // Build layer rects
  const layers = computeLayerRects(fillStops, fillLevel);

  // Mason-jar silhouette (task 1.1): body with rounded bottom, shoulder curve, neck with thread lines, detailed lid
  const jarPath = [
    // Start at neck top-left
    `M ${NECK_LEFT} 40`,
    // Neck left side
    `L ${NECK_LEFT} 52`,
    // Shoulder curve left (neck → body)
    `Q ${NECK_LEFT - 15} 58 ${BODY_LEFT} ${BODY_TOP}`,
    // Body left side
    `L ${BODY_LEFT} ${BODY_BOTTOM - BODY_RADIUS}`,
    // Bottom-left curve
    `Q ${BODY_LEFT} ${BODY_BOTTOM} ${BODY_LEFT + BODY_RADIUS} ${BODY_BOTTOM}`,
    // Bottom edge
    `L ${BODY_RIGHT - BODY_RADIUS} ${BODY_BOTTOM}`,
    // Bottom-right curve
    `Q ${BODY_RIGHT} ${BODY_BOTTOM} ${BODY_RIGHT} ${BODY_BOTTOM - BODY_RADIUS}`,
    // Body right side
    `L ${BODY_RIGHT} ${BODY_TOP}`,
    // Shoulder curve right (body → neck)
    `Q ${NECK_RIGHT + 15} 58 ${NECK_RIGHT} 52`,
    // Neck right side
    `L ${NECK_RIGHT} 40`,
    `Z`,
  ].join(' ');

  // Clip path for liquid (task 1.3): matches jar interior
  const clipPath = [
    `M ${LIQUID_X_LEFT} ${BODY_TOP}`,
    `L ${LIQUID_X_LEFT} ${LIQUID_Y_BOTTOM}`,
    `Q ${LIQUID_X_LEFT} ${BODY_BOTTOM - 4} ${LIQUID_X_LEFT + 14} ${BODY_BOTTOM - 4}`,
    `L ${LIQUID_X_RIGHT - 14} ${BODY_BOTTOM - 4}`,
    `Q ${LIQUID_X_RIGHT} ${BODY_BOTTOM - 4} ${LIQUID_X_RIGHT} ${LIQUID_Y_BOTTOM}`,
    `L ${LIQUID_X_RIGHT} ${BODY_TOP}`,
    `Z`,
  ].join(' ');

  return (
    <View style={styles.container} accessibilityLabel="Jarro com ingredientes selecionados">
      <Svg width={JAR_WIDTH} height={SVG_HEIGHT}>
        <Defs>
          <ClipPath id="jarBodyClip">
            <Path d={clipPath} />
          </ClipPath>
        </Defs>

        {/* Jar body fill (white) */}
        <Path d={jarPath} fill={colors.white} stroke="none" />

        {/* Stacked layer Rects (tasks 2.1-2.4), clipped to jar interior */}
        <G clipPath="url(#jarBodyClip)">
          {layers.map((layer, index) => (
            <React.Fragment key={`layer-${index}-${layer.color}`}>
              <AnimatedLayer layer={layer} />
              {/* Separator line between layers (task 2.3) */}
              {index > 0 && (
                <Line
                  x1={LIQUID_X_LEFT}
                  y1={layer.y + layer.height}
                  x2={LIQUID_X_RIGHT}
                  y2={layer.y + layer.height}
                  stroke="white"
                  strokeWidth={1}
                  opacity={0.2}
                />
              )}
            </React.Fragment>
          ))}
        </G>

        {/* Jar outline */}
        <Path d={jarPath} fill="none" stroke={colors.neutral[200]} strokeWidth={2} />

        {/* Thread lines on neck (task 1.1) */}
        <Line
          x1={NECK_LEFT}
          y1={44}
          x2={NECK_RIGHT}
          y2={44}
          stroke={colors.neutral[200]}
          strokeWidth={1}
          opacity={0.5}
        />
        <Line
          x1={NECK_LEFT}
          y1={48}
          x2={NECK_RIGHT}
          y2={48}
          stroke={colors.neutral[200]}
          strokeWidth={1}
          opacity={0.4}
        />

        {/* Lid — main cap */}
        <Rect
          x={NECK_LEFT - 6}
          y={28}
          width={NECK_WIDTH + 12}
          height={14}
          rx={4}
          fill={colors.primary[700]}
        />
        {/* Lid — top knob with texture */}
        <Rect
          x={NECK_LEFT + 4}
          y={22}
          width={NECK_WIDTH - 8}
          height={8}
          rx={3}
          fill={colors.primary[500]}
        />
        {/* Lid texture lines */}
        <Line
          x1={NECK_LEFT - 2}
          y1={33}
          x2={NECK_RIGHT + 2}
          y2={33}
          stroke={colors.primary[500]}
          strokeWidth={0.8}
          opacity={0.4}
        />
        <Line
          x1={NECK_LEFT - 2}
          y1={37}
          x2={NECK_RIGHT + 2}
          y2={37}
          stroke={colors.primary[500]}
          strokeWidth={0.8}
          opacity={0.3}
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

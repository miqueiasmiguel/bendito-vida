// Manual mock for react-native-reanimated v4 in Jest
// Reanimated v4 uses react-native-worklets which requires native bindings,
// so we mock at this level to avoid native initialization errors in tests.
const React = require('react');

const useSharedValue = (initial) => ({ value: initial });

const useAnimatedStyle = (fn) => {
  try {
    return fn();
  } catch {
    return {};
  }
};

const withTiming = (value) => value;
const withSpring = (value) => value;
const withDelay = (_delay, value) => value;
const withSequence = (...values) => values[values.length - 1];
const interpolateColor = (_value, _inputRange, outputRange) => outputRange[0];

const Animated = {
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  ScrollView: 'ScrollView',
  FlatList: 'FlatList',
  createAnimatedComponent: (Component) => Component,
};

module.exports = {
  default: Animated,
  ...Animated,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  interpolateColor,
  Easing: { out: (fn) => fn, linear: (t) => t, ease: (t) => t, cubic: (t) => t * t * t },
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  cancelAnimation: () => {},
  measure: () => {},
  scrollTo: () => {},
};

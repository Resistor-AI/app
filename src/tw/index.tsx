import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
} from "react-native";

// In NativeWind v4, standard components are patched via Babel to support className.
// We re-export them here to maintain compatibility with existing imports.

export const View = RNView;
export const Text = RNText;
export const Pressable = RNPressable;
export const ScrollView = RNScrollView;

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#F7FAF8',
    backgroundElement: '#EAF1EC',
    backgroundSelected: '#D9EAE0',
    textSecondary: '#5B6760',
    tint: '#1B7A43',
    tintText: '#ffffff',
    border: '#D7E5DC',
    danger: '#C53D3D',
  },
  dark: {
    text: '#ffffff',
    background: '#0A0F0C',
    backgroundElement: '#1A2420',
    backgroundSelected: '#24352B',
    textSecondary: '#A9B6AE',
    tint: '#2FBD7E',
    tintText: '#00210F',
    border: '#2C3B32',
    danger: '#FF6B6B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Fixed accent colours per exercise category, used for badges/icons across Library and Progress.
 * Inspired by snooker ball colours (yellow, green, brown, blue, pink, red).
 */
export const CategoryColors: Record<string, string> = {
  potting: '#B8860B',
  safety: '#1B6FE0',
  break_building: '#1B7A43',
  positional_play: '#8B5A2B',
  cueing_fundamentals: '#C2447A',
  match_practice: '#D6383D',
};

export const CategoryLabels: Record<string, string> = {
  potting: 'Potting',
  safety: 'Safety',
  break_building: 'Break building',
  positional_play: 'Positional play',
  cueing_fundamentals: 'Cueing fundamentals',
  match_practice: 'Match practice',
};

export const Radius = {
  small: 8,
  medium: 12,
  large: 16,
  pill: 999,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

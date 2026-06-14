import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'large' | 'medium';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  size = 'large',
  loading,
  fullWidth,
  disabled,
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  const backgroundColor = {
    primary: theme.tint,
    secondary: theme.backgroundElement,
    ghost: 'transparent',
  }[variant];

  const textColor = {
    primary: theme.tintText,
    secondary: theme.text,
    ghost: theme.tint,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        size === 'large' ? styles.large : styles.medium,
        { backgroundColor },
        fullWidth && styles.fullWidth,
        (pressed || disabled || loading) && styles.pressed,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText type={size === 'large' ? 'default' : 'smallBold'} style={{ color: textColor }}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: Spacing.four,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.6,
  },
});

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = TouchableOpacityProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title: string;
  loading?: boolean;
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
};

export function Button({
  style,
  variant = 'primary',
  size = 'md',
  title,
  loading = false,
  disabled,
  lightColor,
  darkColor,
  textLightColor,
  textDarkColor,
  ...rest
}: ButtonProps) {
  const backgroundColor = useThemeColor(
    {
      light: lightColor || (variant === 'primary' ? '#007AFF' : 'transparent'),
      dark: darkColor || (variant === 'primary' ? '#0A84FF' : 'transparent'),
    },
    'background'
  );

  const textColor = useThemeColor(
    {
      light: textLightColor || (variant === 'primary' ? '#FFFFFF' : '#007AFF'),
      dark: textDarkColor || (variant === 'primary' ? '#FFFFFF' : '#0A84FF'),
    },
    'text'
  );

  const borderColor = useThemeColor(
    {
      light: variant === 'outline' ? '#007AFF' : 'transparent',
      dark: variant === 'outline' ? '#0A84FF' : 'transparent',
    },
    'border'
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        {
          backgroundColor: disabled ? '#E5E5E7' : backgroundColor,
          borderColor: disabled ? '#E5E5E7' : borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#007AFF'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`],
            {
              color: disabled ? '#8E8E93' : textColor,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 44,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 52,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSm: {
    fontSize: 14,
    lineHeight: 20,
  },
  textMd: {
    fontSize: 16,
    lineHeight: 24,
  },
  textLg: {
    fontSize: 18,
    lineHeight: 28,
  },
});
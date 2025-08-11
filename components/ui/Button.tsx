import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';

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
  // Use themed colors with explicit light/dark variants
  const primaryColor = useThemeColor({ light: '#7C3AED', dark: '#A855F7' }, 'tint');
  const accentColor = useColorScheme() === 'dark' ? '#FDBA74' : '#FB923C';
  const secondaryColor = useColorScheme() === 'dark' ? '#2A2A3E' : '#F3F0FF';
  const textColorPrimary = useThemeColor({}, 'text');
  const borderColorDefault = useColorScheme() === 'dark' ? '#3A3A4E' : '#E9E5F5';

  const getBackgroundColor = () => {
    if (disabled) return '#E5E5E7';
    if (lightColor) return lightColor;
    
    switch (variant) {
      case 'primary':
        return primaryColor;
      case 'secondary':
        return secondaryColor;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return primaryColor;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#8E8E93';
    if (textLightColor) return textLightColor;
    
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return primaryColor;
      case 'outline':
        return primaryColor;
      case 'ghost':
        return textColorPrimary;
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (disabled) return '#E5E5E7';
    
    switch (variant) {
      case 'outline':
        return primaryColor;
      default:
        return 'transparent';
    }
  };

  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();
  const borderColor = getBorderColor();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          shadowColor: variant === 'primary' && !disabled ? primaryColor : 'transparent',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: variant === 'primary' && !disabled ? 0.15 : 0,
          shadowRadius: 8,
          elevation: variant === 'primary' && !disabled ? 4 : 0,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : primaryColor}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`],
            {
              color: textColor,
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
    borderRadius: 16, // More rounded corners for magical feel
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
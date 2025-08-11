import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

interface BadgeProps {
  children?: React.ReactNode;
  title?: string;
  variant?: 'default' | 'secondary' | 'success' | 'accent' | 'primary' | 'outline';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  title,
  variant = 'default', 
  style 
}) => {
  const theme = useColorScheme() ?? 'light';
  
  // Use themed colors with explicit light/dark variants
  const primaryColor = useThemeColor({ light: '#7C3AED', dark: '#A855F7' }, 'tint');
  const accentColor = useColorScheme() === 'dark' ? '#FDBA74' : '#FB923C';
  const successColor = useColorScheme() === 'dark' ? '#10B981' : '#059669';
  const warningColor = useColorScheme() === 'dark' ? '#F59E0B' : '#D97706';
  const secondaryColor = useColorScheme() === 'dark' ? '#2A2A3E' : '#F3F0FF';
  const textColorDefault = useThemeColor({}, 'text');
  
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          borderColor: primaryColor,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: primaryColor,
          borderWidth: 1,
        };
      case 'success':
        return {
          backgroundColor: successColor,
          borderColor: successColor,
          borderWidth: 1,
        };
      case 'accent':
        return {
          backgroundColor: accentColor,
          borderColor: accentColor,
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: secondaryColor,
          borderColor: primaryColor,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: primaryColor,
          borderColor: primaryColor,
          borderWidth: 1,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return primaryColor;
    }
    if (variant === 'secondary') {
      return primaryColor;
    }
    return '#ffffff';
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View style={[styles.badge, badgeStyle, style]}>
      <ThemedText style={[styles.badgeText, { color: getTextColor() }]}>
        {title || children}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
});
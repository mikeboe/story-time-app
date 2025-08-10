import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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
  
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: Colors[theme].tint,
          borderColor: Colors[theme].tint,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: Colors[theme].tint,
          borderWidth: 1,
        };
      case 'success':
        return {
          backgroundColor: '#22c55e',
          borderColor: '#16a34a',
          borderWidth: 1,
        };
      case 'accent':
        return {
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: Colors[theme].tabIconDefault,
          borderColor: Colors[theme].tabIconDefault,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: Colors[theme].tint,
          borderColor: Colors[theme].tint,
          borderWidth: 1,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return Colors[theme].tint;
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
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ProgressProps {
  value: number; // 0-100
  style?: ViewStyle;
  height?: number;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  style, 
  height = 8 
}) => {
  const theme = useColorScheme() ?? 'light';
  
  const clampedValue = Math.max(0, Math.min(100, value));
  
  return (
    <View style={[styles.container, { height }, style]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${clampedValue}%`,
            backgroundColor: Colors[theme].tint,
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
});
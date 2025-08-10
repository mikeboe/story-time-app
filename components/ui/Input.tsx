import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '../ThemedText';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  lightColor?: string;
  darkColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
};

export function Input({
  style,
  label,
  error,
  lightColor,
  darkColor,
  lightBorderColor,
  darkBorderColor,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const backgroundColor = useThemeColor(
    {
      light: lightColor || '#F2F2F7',
      dark: darkColor || '#1C1C1E',
    },
    'background'
  );

  const borderColor = useThemeColor(
    {
      light: lightBorderColor || (error ? '#FF3B30' : isFocused ? '#007AFF' : '#D1D1D6'),
      dark: darkBorderColor || (error ? '#FF453A' : isFocused ? '#0A84FF' : '#48484A'),
    },
    'border'
  );

  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const placeholderColor = useThemeColor(
    { light: '#8E8E93', dark: '#8E8E93' },
    'text'
  );

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={styles.label} type="defaultSemiBold">
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            borderColor,
            color: textColor,
          },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {error && (
        <ThemedText style={styles.error} lightColor="#FF3B30" darkColor="#FF453A">
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    marginTop: 4,
    fontSize: 14,
  },
});
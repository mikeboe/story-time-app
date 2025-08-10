import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type LabelProps = TextProps & {
  required?: boolean;
  lightColor?: string;
  darkColor?: string;
};

export function Label({
  style,
  required = false,
  lightColor,
  darkColor,
  children,
  ...rest
}: LabelProps) {
  const color = useThemeColor(
    { light: lightColor || '#000000', dark: darkColor || '#FFFFFF' },
    'text'
  );

  return (
    <Text
      style={[
        styles.label,
        { color },
        style,
      ]}
      {...rest}
    >
      {children}
      {required && (
        <Text style={[styles.required, { color: '#FF3B30' }]}>
          {' *'}
        </Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    fontSize: 16,
    fontWeight: '600',
  },
});
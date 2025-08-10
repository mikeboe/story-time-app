import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardContent } from '../ui/Card';
import { ThemedText } from '../ThemedText';

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientColors: string[];
  onPress?: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  gradientColors,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <Card>
        <CardContent style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: gradientColors[0] }]}>
            {icon}
          </View>
          <View style={styles.textContainer}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText style={styles.description}>
              {description}
            </ThemedText>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
});
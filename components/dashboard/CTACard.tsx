import React from 'react';
import { View, StyleSheet, TouchableOpacity, LinearGradient } from 'react-native';
import { Card } from '../ui/Card';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface CTACardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress?: () => void;
  gradientColors?: string[];
}

export const CTACard: React.FC<CTACardProps> = ({
  title,
  description,
  buttonText,
  onPress,
  gradientColors = ['#3b82f6', '#8b5cf6'],
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.gradientCard, { backgroundColor: gradientColors[0] }]}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={styles.description}>
            {description}
          </ThemedText>
          <TouchableOpacity 
            onPress={onPress}
            style={styles.button}
          >
            <Ionicons name="add" size={20} color={gradientColors[0]} />
            <ThemedText style={[styles.buttonText, { color: gradientColors[0] }]}>
              {buttonText}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  gradientCard: {
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#ffffff',
  },
});
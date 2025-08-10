import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <ThemedView style={[styles.card, style]}>
      {children}
    </ThemedView>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardHeader, style]}>
      {children}
    </View>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  return (
    <ThemedText type="subtitle" style={[styles.cardTitle, style]}>
      {children}
    </ThemedText>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => {
  return (
    <ThemedText style={[styles.cardDescription, style]}>
      {children}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 0,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});
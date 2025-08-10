import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardContent } from '../ui/Card';
import { ThemedText } from '../ThemedText';
import { Progress } from '../ui/Progress';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color?: string;
  showProgress?: boolean;
  progressValue?: number;
  progressMax?: number;
  progressLabel?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  color = '#3b82f6',
  showProgress = false,
  progressValue,
  progressMax,
  progressLabel,
}) => {
  return (
    <Card>
      <CardContent>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            {icon}
          </View>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {title}
          </ThemedText>
        </View>
        <ThemedText style={[styles.value, { color }]}>
          {value}
        </ThemedText>
        {showProgress && progressValue !== undefined && progressMax && (
          <View style={styles.progressContainer}>
            <Progress 
              value={(progressValue / progressMax) * 100} 
              style={styles.progress}
            />
            {progressLabel && (
              <ThemedText style={styles.progressLabel}>
                {progressLabel}
              </ThemedText>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 14,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progress: {
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
});
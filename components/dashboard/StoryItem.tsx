import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface StoryItemProps {
  story: {
    id: number;
    title: string;
    status: string;
    createdAt: string;
    duration?: string | null;
    childName: string;
  };
  onPress?: () => void;
  onPlayPress?: () => void;
  onDownloadPress?: () => void;
}

export const StoryItem: React.FC<StoryItemProps> = ({
  story,
  onPress,
  onPlayPress,
  onDownloadPress,
}) => {
  const theme = useColorScheme() ?? 'light';
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success">Complete</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'audio_ready':
        return <Badge variant="accent">Audio Ready</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: Colors[theme].tint + '20' }]}>
            <Ionicons 
              name="book" 
              size={20} 
              color={Colors[theme].tint} 
            />
          </View>
          <View style={styles.textContainer}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {story.title}
            </ThemedText>
            <View style={styles.metaContainer}>
              <ThemedText style={styles.metaText}>
                For {story.childName}
              </ThemedText>
              <ThemedText style={styles.metaText}> • </ThemedText>
              <ThemedText style={styles.metaText}>
                {story.createdAt}
              </ThemedText>
              {story.duration && (
                <>
                  <ThemedText style={styles.metaText}> • </ThemedText>
                  <ThemedText style={styles.metaText}>
                    {story.duration}
                  </ThemedText>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.rightContent}>
          {getStatusBadge(story.status)}
          <View style={styles.actionButtons}>
            {story.status === 'audio_ready' && (
              <TouchableOpacity 
                onPress={onPlayPress}
                style={[styles.actionButton, { backgroundColor: Colors[theme].tint + '20' }]}
              >
                <Ionicons 
                  name="play" 
                  size={16} 
                  color={Colors[theme].tint} 
                />
              </TouchableOpacity>
            )}
            {story.status === 'ready' && (
              <TouchableOpacity 
                onPress={onDownloadPress}
                style={[styles.actionButton, { backgroundColor: Colors[theme].tint + '20' }]}
              >
                <Ionicons 
                  name="download" 
                  size={16} 
                  color={Colors[theme].tint} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    opacity: 0.7,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
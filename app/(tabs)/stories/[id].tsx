import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StoryApi, Story } from '@/lib/story-api';
import { Ionicons } from '@expo/vector-icons';
import StoryWorkshop from '@/components/story/story-workshop';

export default function StoryDetailScreen() {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWorkshop, setShowWorkshop] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const router = useRouter();
  const { id, story: storyParam } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: '#FAFAFF', dark: '#0F0F1A' }, 'background');
  const cardBackgroundColor = colorScheme === 'dark' ? '#1A1A2E' : '#FFFFFF';
  const textColor = useThemeColor({ light: '#2B2A40', dark: '#E5E5F0' }, 'text');
  const primaryColor = useThemeColor({ light: '#7C3AED', dark: '#A855F7' }, 'tint');
  const accentColor = colorScheme === 'dark' ? '#FDBA74' : '#FB923C';
  const borderColor = colorScheme === 'dark' ? '#3A3A4E' : '#E9E5F5';
  const successColor = colorScheme === 'dark' ? '#10B981' : '#059669';

  useEffect(() => {
    const loadStory = async () => {
      try {
        if (storyParam && typeof storyParam === 'string') {
          // Story data passed from navigation
          const parsedStory = JSON.parse(storyParam);
          setStory(parsedStory);
          setIsLoading(false);
        } else if (id) {
          // Fetch story by ID
          const response = await StoryApi.getStory(id as string);
          if (response.success && response.data) {
            setStory(response.data);
          } else {
            Alert.alert('Error', response.error || 'Failed to load story');
            router.back();
          }
          setIsLoading(false);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load story');
        router.back();
      }
    };

    loadStory();
  }, [id, storyParam]);

  const handleBack = () => {
    router.back();
  };

  const handleEditStory = () => {
    setShowWorkshop(true);
  };

  const handleWorkshopBack = () => {
    setShowWorkshop(false);
  };

  const handleWorkshopSave = (updatedStory: Story) => {
    setStory(updatedStory);
    setShowWorkshop(false);
  };

  const handleDeleteStory = () => {
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (story) {
              const response = await StoryApi.deleteStory(story.id);
              if (response.success) {
                router.back();
              } else {
                Alert.alert('Error', response.error || 'Failed to delete story');
              }
            }
          },
        },
      ]
    );
  };

  const handleGenerateAudioPreview = async () => {
    if (!story) return;
    
    try {
      const response = await StoryApi.generateAudioPreview(story.id);
      if (response.success && response.data) {
        setStory({
          ...story,
          audioPreviewUrl: response.data.audioUrl,
        });
      } else {
        Alert.alert('Error', response.error || 'Failed to generate audio preview');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate audio preview');
    }
  };

  const handlePlayPause = () => {
    if (isPlayingPreview) {
      setIsPlayingPreview(false);
    } else {
      setIsPlayingPreview(true);
      // Simulate audio progress
      const timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingPreview(false);
            clearInterval(timer);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  const handleGenerateFullAudio = () => {
    Alert.alert(
      'Generate Full Audio',
      "You'll be charged $2.99 to generate the full audio story. This includes professional narration and download rights.\n\n• Full story narration (~5-8 minutes)\n• High-quality MP3 download\n• Professional voice acting\n• Background music & sound effects",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay $2.99',
          onPress: async () => {
            if (story) {
              try {
                const response = await StoryApi.generateFullAudio(story.id);
                if (response.success && response.data) {
                  setStory({
                    ...story,
                    status: 'audio_ready',
                    audioFullUrl: response.data.audioUrl,
                  });
                } else {
                  Alert.alert('Error', response.error || 'Failed to generate full audio');
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to generate full audio');
              }
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge title="Complete" variant="success" />;
      case 'draft':
        return <Badge title="Draft" variant="secondary" />;
      case 'audio_ready':
        return <Badge title="Audio Ready" variant="primary" />;
      case 'published':
        return <Badge title="Published" variant="accent" />;
      default:
        return <Badge title="Unknown" variant="secondary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatText = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim()) {
        return (
          <ThemedText key={index} style={styles.paragraph}>
            {paragraph}
          </ThemedText>
        );
      }
      return <View key={index} style={styles.paragraphBreak} />;
    });
  };

  if (showWorkshop && story) {
    return (
      <StoryWorkshop
        story={story}
        onBack={handleWorkshopBack}
        onSave={handleWorkshopSave}
      />
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={styles.loadingText}>Loading story...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!story) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={accentColor} />
          <ThemedText style={styles.errorText}>Story not found</ThemedText>
          <Button title="Go Back" onPress={handleBack} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerLeft}>
          <Button title="← Back" variant="ghost" size="sm" onPress={handleBack} />
        </View>
        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {story.title}
          </ThemedText>
          <View style={styles.headerInfo}>
            <Badge title={story.tone} variant="outline" />
            <Badge title={story.style} variant="outline" />
            {getStatusBadge(story.status)}
          </View>
        </View>
        <View style={styles.headerRight}>
          <Button
            title="Edit"
            variant="outline"
            size="sm"
            onPress={handleEditStory}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Story Info */}
        <Card style={styles.section}>
          <CardHeader>
            <CardTitle>Story Details</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>Created</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {formatDate(story.createdAt)}
                </ThemedText>
              </View>
              <View style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>Word Count</ThemedText>
                <ThemedText style={styles.infoValue}>{story.wordCount}</ThemedText>
              </View>
              {story.childName && (
                <View style={styles.infoItem}>
                  <ThemedText style={styles.infoLabel}>Hero</ThemedText>
                  <ThemedText style={styles.infoValue}>{story.childName}</ThemedText>
                </View>
              )}
              <View style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>Last Updated</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {formatDate(story.updatedAt)}
                </ThemedText>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Audio Section */}
        <Card style={styles.section}>
          <CardHeader>
            <CardTitle>🔊 Audio</CardTitle>
          </CardHeader>
          <CardContent>
            {!story.audioPreviewUrl ? (
              <Button
                title="▶️ Generate 30s Preview (Free)"
                variant="primary"
                size="lg"
                onPress={handleGenerateAudioPreview}
              />
            ) : (
              <View style={styles.audioPlayer}>
                <View style={styles.audioControls}>
                  <Button
                    title={isPlayingPreview ? '⏸️ Pause' : '▶️ Play'}
                    variant="outline"
                    size="sm"
                    onPress={handlePlayPause}
                  />
                  <View style={styles.progressContainer}>
                    <Progress value={audioProgress} style={styles.audioProgress} height={6} />
                    <ThemedText style={styles.audioDuration}>0:30</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.audioInfo}>
                  30-second preview • Full audio requires generation
                </ThemedText>
              </View>
            )}
            
            {story.status !== 'audio_ready' && (
              <View style={styles.audioActions}>
                <Button
                  title="Generate Full MP3 ($2.99)"
                  variant="primary"
                  size="lg"
                  onPress={handleGenerateFullAudio}
                  style={styles.fullAudioButton}
                />
              </View>
            )}

            {story.status === 'audio_ready' && story.audioFullUrl && (
              <View style={[styles.audioReady, { 
                backgroundColor: successColor + '20',
                borderColor: successColor,
              }]}>
                <View style={styles.audioReadyHeader}>
                  <Ionicons name="checkmark-circle" size={24} color={successColor} />
                  <ThemedText style={[styles.audioReadyTitle, { color: successColor }]}>Full Audio Ready!</ThemedText>
                </View>
                <ThemedText style={styles.audioReadyDescription}>
                  Your complete audio story is ready for download and listening.
                </ThemedText>
                <View style={styles.audioReadyActions}>
                  <Button title="▶️ Play Full Audio" variant="primary" size="md" />
                  <Button title="⬇️ Download MP3" variant="outline" size="md" />
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Story Content */}
        <Card style={styles.section}>
          <CardHeader>
            <CardTitle>Story Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollView style={styles.storyContainer} showsVerticalScrollIndicator={false}>
              {story.content ? formatText(story.content) : (
                <ThemedText style={styles.noContent}>
                  No content available for this story.
                </ThemedText>
              )}
            </ScrollView>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card style={[styles.section, styles.actionsCard]}>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.actionButtons}>
              <Button
                title="✏️ Edit Story"
                variant="primary"
                size="lg"
                onPress={handleEditStory}
                style={styles.actionButton}
              />
              <Button
                title="🗑️ Delete Story"
                variant="destructive"
                size="lg"
                onPress={handleDeleteStory}
                style={styles.actionButton}
              />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  audioPlayer: {
    gap: 12,
    marginBottom: 16,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioProgress: {
    flex: 1,
  },
  audioDuration: {
    fontSize: 12,
    opacity: 0.7,
    minWidth: 30,
  },
  audioInfo: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  audioActions: {
    marginTop: 16,
  },
  fullAudioButton: {
    alignSelf: 'stretch',
  },
  audioReady: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  audioReadyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  audioReadyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  audioReadyDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  audioReadyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  storyContainer: {
    maxHeight: 400,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  paragraphBreak: {
    height: 16,
  },
  noContent: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsCard: {
    marginBottom: 32,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    alignSelf: 'stretch',
  },
});
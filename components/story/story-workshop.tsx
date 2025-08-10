import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StoryApi } from '@/lib/story-api';

const { width } = Dimensions.get('window');

interface StoryWorkshopProps {
  story: any;
  onBack: () => void;
  onSave: (updatedStory: any) => void;
}

interface RegenerateOption {
  id: string;
  label: string;
  description: string;
  emoji: string;
}

const regenerateOptions: RegenerateOption[] = [
  {
    id: 'shorter',
    label: 'Make Shorter',
    description: 'Reduce to key moments',
    emoji: '✂️',
  },
  {
    id: 'bedtime',
    label: 'More Bedtime',
    description: 'Calmer and sleepier',
    emoji: '🌙',
  },
  {
    id: 'adventurous',
    label: 'More Adventurous',
    description: 'Add excitement and action',
    emoji: '⚡',
  },
  {
    id: 'funny',
    label: 'Funnier',
    description: 'Add humor and giggles',
    emoji: '😄',
  },
  {
    id: 'gentle',
    label: 'Gentler Tone',
    description: 'Softer and more peaceful',
    emoji: '🕊️',
  },
];

export default function StoryWorkshop({ story: initialStory, onBack, onSave }: StoryWorkshopProps) {
  const [story, setStory] = useState(initialStory);
  const [currentText, setCurrentText] = useState(initialStory.content);
  const [lastSaved, setLastSaved] = useState(initialStory.content);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingType, setRegeneratingType] = useState('');
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentText !== lastSaved && currentText.trim()) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentText, lastSaved]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    
    try {
      const response = await StoryApi.updateStory(story.id, {
        content: currentText,
      });

      if (response.success) {
        setLastSaved(currentText);
        setStory({ ...story, content: currentText });
        onSave({ ...story, content: currentText });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleRevert = () => {
    Alert.alert(
      'Revert Changes',
      'Are you sure you want to revert to the last saved version?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revert',
          style: 'destructive',
          onPress: () => setCurrentText(lastSaved),
        },
      ]
    );
  };

  const handleRegenerate = async (type: string) => {
    setIsRegenerating(true);
    setRegeneratingType(type);

    try {
      const response = await StoryApi.regenerateStory(story.id, {
        regenerateOption: type as any,
      });

      if (response.success && response.data) {
        const newVariant = response.data.variant;
        setVariants([...variants, newVariant]);
        setSelectedVariant(newVariant);
      } else {
        throw new Error(response.error || 'Failed to regenerate story');
      }
    } catch (error) {
      Alert.alert(
        'Regeneration Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRegenerating(false);
      setRegeneratingType('');
    }
  };

  const handleApplyVariant = () => {
    if (selectedVariant) {
      setCurrentText(selectedVariant);
      setSelectedVariant('');
    }
  };

  const handleGenerateAudioPreview = async () => {
    setIsGeneratingAudio(true);
    
    try {
      const response = await StoryApi.generateAudioPreview(story.id);

      if (response.success && response.data) {
        setAudioPreviewUrl(response.data.audioUrl);
      } else {
        throw new Error(response.error || 'Failed to generate audio preview');
      }
    } catch (error) {
      Alert.alert(
        'Audio Generation Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingAudio(false);
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

  const handleGenerateFullMP3 = () => {
    Alert.alert(
      'Generate Full Audio',
      "You'll be charged $2.99 to generate the full audio story. This includes professional narration and download rights.\n\n• Full story narration (~5-8 minutes)\n• High-quality MP3 download\n• Professional voice acting\n• Background music & sound effects",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay $2.99',
          onPress: async () => {
            try {
              const response = await StoryApi.generateFullAudio(story.id);

              if (response.success && response.data) {
                const updatedStory = {
                  ...story,
                  status: 'audio_ready' as const,
                  audioFullUrl: response.data.audioUrl,
                  content: currentText,
                };
                setStory(updatedStory);
                onSave(updatedStory);
              } else {
                throw new Error(response.error || 'Failed to generate full audio');
              }
            } catch (error) {
              Alert.alert(
                'Audio Generation Failed',
                error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const formatText = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim()) {
        return (
          <ThemedText key={index} style={localStyles.paragraph}>
            {paragraph}
          </ThemedText>
        );
      }
      return <View key={index} style={localStyles.paragraphBreak} />;
    });
  };

  return (
    <SafeAreaView style={[localStyles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[localStyles.header, { borderBottomColor: '#E5E5EA' }]}>
        <View style={localStyles.headerLeft}>
          <Button title="← Back" variant="ghost" size="sm" onPress={onBack} />
        </View>
        <View style={localStyles.headerCenter}>
          <ThemedText style={localStyles.headerTitle} numberOfLines={1}>
            {story.title}
          </ThemedText>
          <View style={localStyles.headerInfo}>
            <Badge title={story.tone} variant="outline" />
            <Badge title={story.style} variant="outline" />
            <ThemedText style={localStyles.wordCount}>
              {currentText.split(' ').length} words
            </ThemedText>
            {isAutoSaving && (
              <ThemedText style={localStyles.savingText}>Saving...</ThemedText>
            )}
          </View>
        </View>
        <View style={localStyles.headerRight}>
          <Button
            title="Generate Full MP3 ($2.99)"
            variant="primary"
            size="sm"
            onPress={handleGenerateFullMP3}
          />
        </View>
      </View>

      <ScrollView style={localStyles.content} showsVerticalScrollIndicator={false}>
        {/* Story Editor */}
        <Card style={localStyles.section}>
          <CardHeader>
            <CardTitle>✨ Story Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <TextInput
              style={[
                localStyles.textEditor,
                {
                  backgroundColor: cardBackgroundColor,
                  color: textColor,
                  borderColor: '#E5E5EA',
                },
              ]}
              value={currentText}
              onChangeText={setCurrentText}
              multiline
              textAlignVertical="top"
              placeholder="Start writing your magical story..."
              placeholderTextColor="#8E8E93"
            />
            <View style={localStyles.editorActions}>
              <Button
                title="Revert Changes"
                variant="outline"
                size="sm"
                onPress={handleRevert}
                disabled={currentText === lastSaved}
              />
            </View>
          </CardContent>
        </Card>

        {/* Quick Regenerate Options */}
        <Card style={localStyles.section}>
          <CardHeader>
            <CardTitle>Quick Regenerate</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={localStyles.regenerateGrid}>
              {regenerateOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    localStyles.regenerateOption,
                    { backgroundColor: cardBackgroundColor },
                  ]}
                  onPress={() => handleRegenerate(option.id)}
                  disabled={isRegenerating}
                >
                  <ThemedText style={localStyles.regenerateEmoji}>
                    {isRegenerating && regeneratingType === option.id ? '⏳' : option.emoji}
                  </ThemedText>
                  <ThemedText style={localStyles.regenerateLabel}>{option.label}</ThemedText>
                  <ThemedText style={localStyles.regenerateDescription}>
                    {option.description}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Audio Preview */}
        <Card style={localStyles.section}>
          <CardHeader>
            <CardTitle>🔊 Audio Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {!audioPreviewUrl ? (
              <Button
                title={isGeneratingAudio ? 'Generating Preview...' : '▶️ Generate 30s Preview (Free)'}
                variant="primary"
                size="lg"
                onPress={handleGenerateAudioPreview}
                disabled={isGeneratingAudio}
                loading={isGeneratingAudio}
              />
            ) : (
              <View style={localStyles.audioPlayer}>
                <View style={localStyles.audioControls}>
                  <Button
                    title={isPlayingPreview ? '⏸️ Pause' : '▶️ Play'}
                    variant="outline"
                    size="sm"
                    onPress={handlePlayPause}
                  />
                  <View style={localStyles.progressContainer}>
                    <Progress value={audioProgress} style={localStyles.audioProgress} height={6} />
                    <ThemedText style={localStyles.audioDuration}>0:30</ThemedText>
                  </View>
                </View>
                <ThemedText style={localStyles.audioInfo}>
                  30-second preview • Full audio requires generation
                </ThemedText>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card style={localStyles.section}>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollView style={localStyles.previewContainer} showsVerticalScrollIndicator={false}>
              {formatText(currentText)}
            </ScrollView>
          </CardContent>
        </Card>

        {/* Variant Preview */}
        {selectedVariant && (
          <Card style={[localStyles.section, localStyles.variantCard]}>
            <CardHeader>
              <View style={localStyles.variantHeader}>
                <CardTitle>Generated Variant</CardTitle>
                <View style={localStyles.variantActions}>
                  <Button
                    title="Dismiss"
                    variant="outline"
                    size="sm"
                    onPress={() => setSelectedVariant('')}
                  />
                  <Button
                    title="✓ Apply"
                    variant="primary"
                    size="sm"
                    onPress={handleApplyVariant}
                  />
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <ScrollView style={localStyles.previewContainer} showsVerticalScrollIndicator={false}>
                {formatText(selectedVariant)}
              </ScrollView>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
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
  wordCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  savingText: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  textEditor: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
    textAlignVertical: 'top',
  },
  editorActions: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  regenerateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  regenerateOption: {
    width: (width - 64) / 2 - 6, // Account for padding and gap
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  regenerateEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  regenerateLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  regenerateDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 16,
  },
  audioPlayer: {
    gap: 12,
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
  previewContainer: {
    maxHeight: 300,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  paragraphBreak: {
    height: 16,
  },
  variantCard: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variantActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
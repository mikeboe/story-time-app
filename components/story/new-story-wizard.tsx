import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StoryApi } from '@/lib/story-api';

const { width } = Dimensions.get('window');

interface NewStoryWizardProps {
  visible: boolean;
  onComplete: (storyData: any) => void;
  onClose: () => void;
}

interface ToneOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

interface StyleOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const tones: ToneOption[] = [
  {
    id: 'bedtime',
    label: 'Bedtime',
    emoji: '🌙',
    description: 'Calm and soothing for sleepy time',
  },
  {
    id: 'adventurous',
    label: 'Adventurous',
    emoji: '⚡',
    description: 'Exciting quests and journeys',
  },
  {
    id: 'funny',
    label: 'Funny',
    emoji: '😄',
    description: 'Silly and humorous tales',
  },
  {
    id: 'magical',
    label: 'Magical',
    emoji: '✨',
    description: 'Enchanted worlds and spells',
  },
  {
    id: 'heartwarming',
    label: 'Heartwarming',
    emoji: '❤️',
    description: 'Feel-good stories about friendship',
  },
];

const styles_options: StyleOption[] = [
  {
    id: 'fairy-tale',
    label: 'Fairy Tale',
    emoji: '🏰',
    description: 'Classic once upon a time stories',
  },
  {
    id: 'sci-fi',
    label: 'Sci-Fi',
    emoji: '🚀',
    description: 'Space adventures and future worlds',
  },
  {
    id: 'mystery',
    label: 'Mystery',
    emoji: '🕵️',
    description: 'Puzzles and gentle detective stories',
  },
  {
    id: 'slice-of-life',
    label: 'Everyday Life',
    emoji: '🏠',
    description: 'Relatable daily adventures',
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    emoji: '🧙',
    description: 'Dragons, wizards, and magic',
  },
];

export default function NewStoryWizard({ visible, onComplete, onClose }: NewStoryWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    tone: '',
    style: '',
    promptInput: '',
    childName: '',
  });

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await StoryApi.createStory({
        tone: formData.tone,
        style: formData.style,
        prompt: formData.promptInput,
        childName: formData.childName || undefined,
      });

      if (response.success && response.data) {
        const storyData = {
          id: response.data.id,
          title: response.data.title,
          content: response.data.content,
          tone: response.data.tone,
          style: response.data.style,
          childName: response.data.childName,
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          wordCount: response.data.wordCount,
        };

        setIsGenerating(false);
        onComplete(storyData);
      } else {
        throw new Error(response.error || 'Failed to create story');
      }
    } catch (error) {
      setIsGenerating(false);
      Alert.alert(
        'Story Generation Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.tone && formData.style;
      case 2:
        return formData.promptInput.trim().length > 10;
      default:
        return false;
    }
  };

  const renderToneCard = (tone: ToneOption) => (
    <TouchableOpacity
      key={tone.id}
      style={[
        localStyles.optionCard,
        {
          backgroundColor: cardBackgroundColor,
          borderColor: formData.tone === tone.id ? '#007AFF' : '#E5E5EA',
          borderWidth: formData.tone === tone.id ? 2 : 1,
        },
      ]}
      onPress={() => setFormData({ ...formData, tone: tone.id })}
    >
      <ThemedText style={localStyles.optionEmoji}>{tone.emoji}</ThemedText>
      <ThemedText style={localStyles.optionLabel}>{tone.label}</ThemedText>
      <ThemedText style={localStyles.optionDescription}>{tone.description}</ThemedText>
    </TouchableOpacity>
  );

  const renderStyleCard = (style: StyleOption) => (
    <TouchableOpacity
      key={style.id}
      style={[
        localStyles.optionCard,
        {
          backgroundColor: cardBackgroundColor,
          borderColor: formData.style === style.id ? '#FF9500' : '#E5E5EA',
          borderWidth: formData.style === style.id ? 2 : 1,
        },
      ]}
      onPress={() => setFormData({ ...formData, style: style.id })}
    >
      <ThemedText style={localStyles.optionEmoji}>{style.emoji}</ThemedText>
      <ThemedText style={localStyles.optionLabel}>{style.label}</ThemedText>
      <ThemedText style={localStyles.optionDescription}>{style.description}</ThemedText>
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView style={localStyles.stepContent} showsVerticalScrollIndicator={false}>
            <View style={localStyles.stepHeader}>
              <ThemedText style={localStyles.stepTitle}>Choose Your Story Style</ThemedText>
              <ThemedText style={localStyles.stepDescription}>
                Select the tone and style for your magical story
              </ThemedText>
            </View>

            <View style={localStyles.section}>
              <ThemedText style={localStyles.sectionLabel}>Story Tone</ThemedText>
              <View style={localStyles.optionsGrid}>
                {tones.map(renderToneCard)}
              </View>
            </View>

            <View style={localStyles.section}>
              <ThemedText style={localStyles.sectionLabel}>Story Style</ThemedText>
              <View style={localStyles.optionsGrid}>
                {styles_options.map(renderStyleCard)}
              </View>
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <ScrollView style={localStyles.stepContent} showsVerticalScrollIndicator={false}>
            <View style={localStyles.stepHeader}>
              <ThemedText style={localStyles.stepTitle}>Tell Us About Your Story</ThemedText>
              <ThemedText style={localStyles.stepDescription}>
                What magical adventure would you like to create?
              </ThemedText>
            </View>

            <View style={localStyles.section}>
              <Input
                label="Child's Name (Optional)"
                placeholder="Enter your child's name"
                value={formData.childName}
                onChangeText={(text) => setFormData({ ...formData, childName: text })}
              />
              <ThemedText style={localStyles.helpText}>
                We'll make them the hero of the story!
              </ThemedText>
            </View>

            <View style={localStyles.section}>
              <ThemedText style={localStyles.inputLabel}>Story Prompt *</ThemedText>
              <ThemedText style={localStyles.helpText}>
                Describe what you'd like the story to be about
              </ThemedText>
              <TextInput
                style={[
                  localStyles.textArea,
                  {
                    backgroundColor: cardBackgroundColor,
                    color: textColor,
                    borderColor: '#E5E5EA',
                  },
                ]}
                placeholder="Example: A young explorer discovers a hidden garden where flowers can talk and needs to help them solve a mystery..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={formData.promptInput}
                onChangeText={(text) => setFormData({ ...formData, promptInput: text })}
              />
              <View style={localStyles.textInfo}>
                <ThemedText style={localStyles.characterCount}>
                  {formData.promptInput.length} characters
                </ThemedText>
                {formData.promptInput.length > 10 && (
                  <Badge title="Great! ✨" variant="primary" />
                )}
              </View>
            </View>

            <View style={[localStyles.previewCard, { backgroundColor: cardBackgroundColor }]}>
              <ThemedText style={localStyles.previewTitle}>Story Preview:</ThemedText>
              <View style={localStyles.previewContent}>
                <ThemedText style={localStyles.previewText}>
                  A <Badge title={formData.tone} variant="outline" />{' '}
                  <Badge title={formData.style} variant="outline" /> story
                  {formData.childName && ` featuring ${formData.childName}`}
                  {formData.promptInput &&
                    ` about "${formData.promptInput.slice(0, 50)}${
                      formData.promptInput.length > 50 ? '...' : ''
                    }"`}
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        );

      case 3:
        return (
          <View style={localStyles.generateContent}>
            <View style={localStyles.generateIcon}>
              <ThemedText style={localStyles.generateEmoji}>✨</ThemedText>
            </View>
            <ThemedText style={localStyles.stepTitle}>Creating Your Magical Story</ThemedText>
            <ThemedText style={localStyles.stepDescription}>
              Our AI storyteller is crafting your unique adventure...
            </ThemedText>

            <View style={localStyles.progressContainer}>
              <Progress value={isGenerating ? 75 : 0} style={localStyles.progressBar} height={12} />
              <ThemedText style={localStyles.progressText}>
                {isGenerating ? 'Weaving magic into words...' : 'Ready to generate'}
              </ThemedText>
            </View>

            <View style={[localStyles.summaryCard, { backgroundColor: cardBackgroundColor }]}>
              <ThemedText style={localStyles.summaryTitle}>Your Story Details:</ThemedText>
              <View style={localStyles.summaryItem}>
                <ThemedText style={localStyles.summaryLabel}>Tone:</ThemedText>
                <Badge title={formData.tone} variant="outline" />
              </View>
              <View style={localStyles.summaryItem}>
                <ThemedText style={localStyles.summaryLabel}>Style:</ThemedText>
                <Badge title={formData.style} variant="outline" />
              </View>
              {formData.childName && (
                <View style={localStyles.summaryItem}>
                  <ThemedText style={localStyles.summaryLabel}>Hero:</ThemedText>
                  <Badge title={formData.childName} variant="outline" />
                </View>
              )}
              <View style={localStyles.summaryPrompt}>
                <ThemedText style={localStyles.summaryLabel}>Prompt:</ThemedText>
                <ThemedText style={localStyles.summaryPromptText}>{formData.promptInput}</ThemedText>
              </View>
            </View>

            {!isGenerating && (
              <Button
                title="✨ Generate Story"
                variant="primary"
                size="lg"
                onPress={handleGenerate}
                style={localStyles.generateButton}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={[localStyles.container, { backgroundColor }]}>
          <View style={localStyles.content}>{renderStep()}</View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[localStyles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={localStyles.header}>
          <View style={localStyles.headerLeft}>
            <Button
              title="Close"
              variant="ghost"
              size="sm"
              onPress={onClose}
            />
          </View>
          <View style={localStyles.headerCenter}>
            <ThemedText style={localStyles.headerTitle}>Create New Story</ThemedText>
            <ThemedText style={localStyles.headerStep}>Step {currentStep} of 3</ThemedText>
          </View>
          <View style={localStyles.headerRight}>
            <Progress value={(currentStep / 3) * 100} style={localStyles.headerProgress} />
          </View>
        </View>

        {/* Content */}
        <View style={localStyles.content}>{renderStep()}</View>

        {/* Navigation */}
        {currentStep < 3 && (
          <View style={localStyles.navigation}>
            <Button
              title="← Previous"
              variant="outline"
              size="md"
              onPress={handlePrevious}
              disabled={currentStep === 1}
              style={localStyles.navButton}
            />
            <Button
              title="Next →"
              variant="primary"
              size="md"
              onPress={handleNext}
              disabled={!canProceed()}
              style={localStyles.navButton}
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
  },
  headerStep: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  headerProgress: {
    width: 80,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    padding: 16,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  textInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  generateContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  generateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  generateEmoji: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  progressContainer: {
    width: '100%',
    maxWidth: 300,
    marginVertical: 32,
  },
  progressBar: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryPrompt: {
    marginTop: 8,
  },
  summaryPromptText: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  generateButton: {
    width: '100%',
    maxWidth: 300,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
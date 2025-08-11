import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StoryApi } from "@/lib/story-api";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Moon,
  Zap,
  Laugh,
  Heart,
  BookOpen,
  Wand2,
  Rocket,
  Castle,
  Home,
} from "lucide-react-native";
import { ThemedView } from "@/components/ThemedView";
import { useGenerationProgress } from "@/hooks/use-generation-progress";

const { width } = Dimensions.get("window");

interface ToneOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface StyleOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const tones = [
  {
    id: "bedtime",
    label: "Bedtime",
    icon: Moon,
    description: "Calm and soothing for sleepy time",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    icon: Zap,
    description: "Exciting quests and journeys",
  },
  {
    id: "funny",
    label: "Funny",
    icon: Laugh,
    description: "Silly and humorous tales",
  },
  {
    id: "magical",
    label: "Magical",
    icon: Sparkles,
    description: "Enchanted worlds and spells",
  },
  {
    id: "heartwarming",
    label: "Heartwarming",
    icon: Heart,
    description: "Feel-good stories about friendship",
  },
];

const styles_options = [
  {
    id: "fairy-tale",
    label: "Fairy Tale",
    icon: Castle,
    description: "Classic once upon a time stories",
  },
  {
    id: "sci-fi",
    label: "Sci-Fi",
    icon: Rocket,
    description: "Space adventures and future worlds",
  },
  {
    id: "mystery",
    label: "Mystery",
    icon: BookOpen,
    description: "Puzzles and gentle detective stories",
  },
  {
    id: "slice-of-life",
    label: "Everyday Life",
    icon: Home,
    description: "Relatable daily adventures",
  },
  {
    id: "fantasy",
    label: "Fantasy",
    icon: Wand2,
    description: "Dragons, wizards, and magic",
  },
];

export default function NewStoryModal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    tone: "",
    style: "",
    promptInput: "",
    childName: "",
  });

  const { currentStep: generationStep, progress: generationProgress } =
    useGenerationProgress(isGenerating);

  const router = useRouter();

  // Use themed colors with explicit light/dark variants
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor(
    { light: "#FAFAFF", dark: "#0F0F1A" },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#2B2A40", dark: "#E5E5F0" },
    "text"
  );
  const cardBackgroundColor = colorScheme === "dark" ? "#1A1A2E" : "#FFFFFF";
  const primaryColor = useThemeColor(
    { light: "#7C3AED", dark: "#A855F7" },
    "tint"
  );
  const accentColor = colorScheme === "dark" ? "#FDBA74" : "#FB923C";
  const secondaryColor = colorScheme === "dark" ? "#2A2A3E" : "#F3F0FF";
  const borderColor = colorScheme === "dark" ? "#3A3A4E" : "#E9E5F5";
  const inputColor = colorScheme === "dark" ? "#252540" : "#F5F3FF";

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
          status: "ready" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          wordCount: response.data.wordCount,
        };

        setIsGenerating(false);
        router.push({
          pathname: `/(tabs)/stories/[id]`,
          params: { id: storyData.id, story: JSON.stringify(storyData) },
        });
      } else {
        throw new Error(response.error || "Failed to create story");
      }
    } catch (error) {
      setIsGenerating(false);
      Alert.alert(
        "Story Generation Failed",
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
        [{ text: "OK" }]
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

  const getHeaderTitle = () => {
    if (isGenerating) return "Creating Story...";
    switch (currentStep) {
      case 1:
        return "Choose Style";
      case 2:
        return "Story Details";
      case 3:
        return "Generate Story";
      default:
        return "New Story";
    }
  };

  const getHeaderRight = () => {
    if (isGenerating) return null;
    if (currentStep < 3) {
      return (
        <Progress
          value={(currentStep / 3) * 100}
          style={styles.headerProgress}
        />
      );
    }
    return null;
  };

  const renderToneCard = (tone: ToneOption) => {
    const isSelected = formData.tone === tone.id;
    const IconComponent = tone.icon;
    return (
      <TouchableOpacity
        key={tone.id}
        style={[
          styles.optionCard,
          {
            backgroundColor: isSelected ? secondaryColor : cardBackgroundColor,
            borderColor: isSelected ? primaryColor : borderColor,
            borderWidth: isSelected ? 2 : 1,
            shadowColor: isSelected ? primaryColor : "transparent",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isSelected ? 0.15 : 0,
            shadowRadius: 8,
            elevation: isSelected ? 4 : 0,
          },
        ]}
        onPress={() => setFormData({ ...formData, tone: tone.id })}
      >
        <View style={styles.optionIcon}>
          <IconComponent
            size={32}
            color={isSelected ? primaryColor : accentColor}
          />
        </View>
        <ThemedText style={styles.optionLabel}>{tone.label}</ThemedText>
        <ThemedText style={styles.optionDescription}>
          {tone.description}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderStyleCard = (style: StyleOption) => {
    const isSelected = formData.style === style.id;
    const IconComponent = style.icon;
    return (
      <TouchableOpacity
        key={style.id}
        style={[
          styles.optionCard,
          {
            backgroundColor: isSelected ? "#FFF7ED" : cardBackgroundColor, // Warm accent background
            borderColor: isSelected ? accentColor : borderColor,
            borderWidth: isSelected ? 2 : 1,
            shadowColor: isSelected ? accentColor : "transparent",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isSelected ? 0.15 : 0,
            shadowRadius: 8,
            elevation: isSelected ? 4 : 0,
          },
        ]}
        onPress={() => setFormData({ ...formData, style: style.id })}
      >
        <View style={styles.optionIcon}>
          <IconComponent
            size={32}
            color={isSelected ? accentColor : primaryColor}
          />
        </View>
        <ThemedText style={styles.optionLabel}>{style.label}</ThemedText>
        <ThemedText style={styles.optionDescription}>
          {style.description}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView
            style={styles.stepContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepHeader}>
              <ThemedText style={styles.stepTitle}>
                Choose Your Story Style
              </ThemedText>
              <ThemedText style={styles.stepDescription}>
                Select the tone and style for your magical story
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionLabel}>Story Tone</ThemedText>
              <View style={styles.optionsGrid}>
                {tones.map(renderToneCard)}
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionLabel}>Story Style</ThemedText>
              <View style={styles.optionsGrid}>
                {styles_options.map(renderStyleCard)}
              </View>
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <ScrollView
            style={styles.stepContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepHeader}>
              <ThemedText style={styles.stepTitle}>
                Tell Us About Your Story
              </ThemedText>
              <ThemedText style={styles.stepDescription}>
                What magical adventure would you like to create?
              </ThemedText>
            </View>

            <View style={styles.section}>
              <Input
                label="Child's Name (Optional)"
                placeholder="Enter your child's name"
                value={formData.childName}
                onChangeText={(text) =>
                  setFormData({ ...formData, childName: text })
                }
              />
              <ThemedText style={styles.helpText}>
                We'll make them the hero of the story!
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.inputLabel}>Story Prompt *</ThemedText>
              <ThemedText style={styles.helpText}>
                Describe what you'd like the story to be about
              </ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: inputColor,
                    color: textColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                  },
                ]}
                placeholder="Example: A young explorer discovers a hidden garden where flowers can talk and needs to help them solve a mystery..."
                placeholderTextColor={textColor + "80"} // 50% opacity
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={formData.promptInput}
                onChangeText={(text) =>
                  setFormData({ ...formData, promptInput: text })
                }
              />
              <View style={styles.textInfo}>
                <ThemedText style={styles.characterCount}>
                  {formData.promptInput.length} characters
                </ThemedText>
                {formData.promptInput.length > 10 && (
                  <Badge title="Great! (" variant="primary" />
                )}
              </View>
            </View>

            <View
              style={[
                styles.previewCard,
                { backgroundColor: cardBackgroundColor },
              ]}
            >
              <ThemedText style={styles.previewTitle}>
                Story Preview:
              </ThemedText>
              <View style={styles.previewContent}>
                <ThemedText style={styles.previewText}>
                  A {formData.tone} {formData.style} story
                  {formData.childName && ` featuring ${formData.childName}`}
                  {formData.promptInput &&
                    ` about "${formData.promptInput.slice(0, 50)}${
                      formData.promptInput.length > 50 ? "..." : ""
                    }"`}
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        );

      case 3:
        return (
          <View style={styles.generateContent}>
            <View
              style={[
                styles.generateIcon,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 8,
                },
              ]}
            >
              <Sparkles size={40} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.stepTitle}>
              Creating Your Magical Story
            </ThemedText>
            <ThemedText style={styles.stepDescription}>
              Our AI storyteller is crafting your unique adventure...
            </ThemedText>

            <View style={styles.progressContainer}>
              <Progress
                value={generationProgress}
                style={styles.progressBar}
                height={12}
              />
              <ThemedText style={styles.progressText}>
                {isGenerating ? generationStep : "Ready to generate"}
              </ThemedText>
            </View>

            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: cardBackgroundColor,
                  borderColor: borderColor,
                },
              ]}
            >
              <ThemedText style={styles.summaryTitle}>
                Your Story Details:
              </ThemedText>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>Tone:</ThemedText>
                <Badge title={formData.tone} variant="outline" />
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>Style:</ThemedText>
                <Badge title={formData.style} variant="outline" />
              </View>
              {formData.childName && (
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryLabel}>Hero:</ThemedText>
                  <Badge title={formData.childName} variant="outline" />
                </View>
              )}
              <View style={styles.summaryPrompt}>
                <ThemedText style={styles.summaryLabel}>Prompt:</ThemedText>
                <ThemedText style={styles.summaryPromptText}>
                  {formData.promptInput}
                </ThemedText>
              </View>
            </View>

            {!isGenerating && (
              <Button
                title="Generate Story"
                variant="primary"
                size="lg"
                onPress={handleGenerate}
                style={styles.generateButton}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: getHeaderTitle(),
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ThemedText>Close</ThemedText>
            </Pressable>
          ),
          headerRight: () => getHeaderRight(),
        }}
      />

      {/* Content */}
      <View style={styles.content}>{renderStep()}</View>

      {/* Navigation */}
      {currentStep < 3 && !isGenerating && (
        <View style={[styles.navigation, { borderTopColor: borderColor }]}>
          <Button
            title="Next"
            variant="primary"
            size="lg"
            onPress={handleNext}
            disabled={!canProceed()}
            style={styles.navButton}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: "bold",
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
    fontWeight: "600",
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  optionIcon: {
    marginBottom: 8,
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
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
    textAlignVertical: "top",
  },
  textInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  previewContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  previewText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  generateContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  generateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  generateEmoji: {
    fontSize: 40,
    color: "#FFFFFF",
  },
  progressContainer: {
    width: "100%",
    maxWidth: 300,
    marginVertical: 32,
  },
  progressBar: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  summaryCard: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: "100%",
    maxWidth: 300,
  },
  navigation: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    marginBottom: 32,
  },
  navButton: {
    width: "100%",
  },
});

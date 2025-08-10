import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StoryItem } from "@/components/dashboard/StoryItem";
import { CTACard } from "@/components/dashboard/CTACard";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import NewStoryWizard from "@/components/story/new-story-wizard";

const recentStories = [
  {
    id: 1,
    title: "The Magic Forest Adventure",
    status: "ready",
    createdAt: "2024-01-08",
    duration: "5:30",
    childName: "Emma",
  },
  {
    id: 2,
    title: "Luna the Brave Dragon",
    status: "draft",
    createdAt: "2024-01-07",
    duration: null,
    childName: "Alex",
  },
  {
    id: 3,
    title: "The Sleepy Moonbeam",
    status: "audio_ready",
    createdAt: "2024-01-06",
    duration: "4:15",
    childName: "Sophie",
  },
];

const stats = {
  totalStories: 12,
  completedStories: 8,
  totalListeningTime: "2h 45m",
  monthlyUsage: 3,
  monthlyLimit: 10,
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [wizardVisible, setWizardVisible] = useState(false);

  const handleCreateNewStory = () => {
    setWizardVisible(true);
  };

  const handleWizardComplete = (storyData: any) => {
    setWizardVisible(false);
    // Navigate to the story workshop with the created story
    router.push({
      pathname: '/story-workshop',
      params: { story: JSON.stringify(storyData) }
    });
  };

  const handleWizardClose = () => {
    setWizardVisible(false);
  };

  const handleViewLibrary = () => {
    console.log("Navigate to library");
  };

  const handleViewPreferences = () => {
    console.log("Navigate to preferences");
  };

  const handleViewAllStories = () => {
    console.log("Navigate to all stories");
  };

  const handleStoryPress = (storyId: number) => {
    console.log("Navigate to story:", storyId);
  };

  const handlePlayStory = (storyId: number) => {
    console.log("Play story:", storyId);
  };

  const handleDownloadStory = (storyId: number) => {
    console.log("Download story:", storyId);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            Welcome back, {user?.firstName}! ✨
          </ThemedText>
          <ThemedText style={styles.welcomeDescription}>
            Ready to create more magical stories? Your imagination is the only
            limit!
          </ThemedText>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              icon={<Ionicons name="create" size={24} color="#ffffff" />}
              title="Create New Story"
              description="Start a magical adventure"
              gradientColors={["#3b82f6", "#8b5cf6"]}
              onPress={handleCreateNewStory}
            />
            <QuickActionCard
              icon={<Ionicons name="library" size={24} color="#ffffff" />}
              title="My Library"
              description={`${stats.totalStories} stories created`}
              gradientColors={["#10b981", "#34d399"]}
              onPress={handleViewLibrary}
            />
          </View>
          <QuickActionCard
            icon={<Ionicons name="settings" size={24} color="#3b82f6" />}
            title="Preferences"
            description="Customize your experience"
            gradientColors={["#f3f4f6", "#e5e7eb"]}
            onPress={handleViewPreferences}
          />
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <StatsCard
              icon={<Ionicons name="book" size={16} color="#ffffff" />}
              title="Total Stories"
              value={stats.totalStories.toString()}
              color="#3b82f6"
            />
            <StatsCard
              icon={<Ionicons name="heart" size={16} color="#ffffff" />}
              title="Completed"
              value={stats.completedStories.toString()}
              color="#10b981"
            />
            <StatsCard
              icon={<Ionicons name="time" size={16} color="#ffffff" />}
              title="Listening Time"
              value={stats.totalListeningTime}
              color="#22c55e"
            />
            <StatsCard
              icon={<Ionicons name="trending-up" size={16} color="#ffffff" />}
              title="This Month"
              value={stats.monthlyUsage.toString()}
              color="#f59e0b"
              showProgress={true}
              progressValue={stats.monthlyUsage}
              progressMax={stats.monthlyLimit}
              progressLabel={`${stats.monthlyUsage} of ${stats.monthlyLimit} stories`}
            />
          </View>
        </View>

        {/* Recent Stories */}
        <View style={styles.section}>
          <Card>
            <CardHeader>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <CardTitle>Recent Stories</CardTitle>
                  <CardDescription>
                    Your latest magical creations
                  </CardDescription>
                </View>
                <Button
                  title="View All"
                  onPress={handleViewAllStories}
                  variant="outline"
                />
              </View>
            </CardHeader>
            <CardContent style={styles.storiesContent}>
              {recentStories.map((story) => (
                <StoryItem
                  key={story.id}
                  story={story}
                  onPress={() => handleStoryPress(story.id)}
                  onPlayPress={() => handlePlayStory(story.id)}
                  onDownloadPress={() => handleDownloadStory(story.id)}
                />
              ))}
            </CardContent>
          </Card>
        </View>

        {/* CTA Section */}
        <View style={styles.section}>
          <CTACard
            title="Ready for Another Adventure?"
            description="Create personalized bedtime stories that spark imagination and create lasting memories."
            buttonText="Create New Story"
            onPress={handleCreateNewStory}
            gradientColors={["#3b82f6", "#8b5cf6"]}
          />
        </View>
      </ScrollView>

      {/* New Story Wizard Modal */}
      <NewStoryWizard
        visible={wizardVisible}
        onComplete={handleWizardComplete}
        onClose={handleWizardClose}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  storiesContent: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
});

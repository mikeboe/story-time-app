import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StoryApi, Story } from '@/lib/story-api';
import { Ionicons } from '@expo/vector-icons';

export default function StoriesScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'draft' | 'ready' | 'audio_ready'>('all');
  
  const router = useRouter();
  
  // Use themed colors with explicit light/dark variants
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: "#FAFAFF", dark: "#0F0F1A" }, "background");
  const textColor = useThemeColor({ light: "#2B2A40", dark: "#E5E5F0" }, "text");
  const cardBackgroundColor = colorScheme === 'dark' ? '#1A1A2E' : '#FFFFFF';
  const primaryColor = useThemeColor({ light: '#7C3AED', dark: '#A855F7' }, "tint");
  const accentColor = colorScheme === 'dark' ? '#FDBA74' : '#FB923C';
  const borderColor = colorScheme === 'dark' ? '#3A3A4E' : '#E9E5F5';
  const secondaryColor = colorScheme === 'dark' ? '#2A2A3E' : '#F3F0FF';

  const loadStories = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await StoryApi.getStories(params);

      if (response.success && response.data) {
        setStories(response.data.stories);
      } else {
        Alert.alert('Error', response.error || 'Failed to load stories');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load stories. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, [filter]);

  const handleRefresh = () => {
    loadStories(true);
  };

  const handleStoryPress = (story: Story) => {
    router.push({
      pathname: "/(tabs)/stories/[id]" as any,
      params: { id: story.id, story: JSON.stringify(story) },
    });
  };

  const handleCreateNewStory = () => {
    router.push("/(modals)/new-story");
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
    return date.toLocaleDateString();
  };

  const renderStoryItem = (story: Story) => (
    <TouchableOpacity
      key={story.id}
      style={[styles.storyItem, { 
        backgroundColor: cardBackgroundColor,
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderColor: borderColor,
        borderWidth: 1,
      }]}
      onPress={() => handleStoryPress(story)}
      activeOpacity={0.7}
    >
      <View style={styles.storyHeader}>
        <View style={[styles.storyIcon, { backgroundColor: secondaryColor }]}>
          <Ionicons name="book" size={20} color={primaryColor} />
        </View>
        <View style={styles.storyInfo}>
          <ThemedText style={styles.storyTitle} numberOfLines={1}>
            {story.title}
          </ThemedText>
          <View style={styles.storyMeta}>
            <Badge title={story.tone} variant="outline" />
            <Badge title={story.style} variant="outline" />
            {story.childName && (
              <ThemedText style={styles.childName}>" {story.childName}</ThemedText>
            )}
          </View>
        </View>
        <View style={styles.storyStatus}>
          {getStatusBadge(story.status)}
        </View>
      </View>
      
      <View style={styles.storyDetails}>
        <ThemedText style={styles.storyDate}>
          Created {formatDate(story.createdAt)}
        </ThemedText>
        <ThemedText style={styles.wordCount}>
          {story.wordCount} words
        </ThemedText>
        {story.status === 'audio_ready' && (
          <View style={styles.audioIndicator}>
            <Ionicons name="volume-high" size={12} color={accentColor} />
            <ThemedText style={[styles.audioText, { color: accentColor }]}>Audio Ready</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredStories = filter === 'all' ? stories : stories.filter(story => story.status === filter);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerContent}>
          <ThemedText style={[styles.headerTitle, { color: textColor }]}>My Stories</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: textColor, opacity: 0.6 }]}>
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} created
          </ThemedText>
        </View>
        <Button
          title="+ New Story"
          variant="primary"
          size="sm"
          onPress={handleCreateNewStory}
        />
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { borderBottomColor: borderColor }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { key: 'all', label: 'All Stories', count: stories.length },
            { key: 'draft', label: 'Drafts', count: stories.filter(s => s.status === 'draft').length },
            { key: 'ready', label: 'Complete', count: stories.filter(s => s.status === 'ready').length },
            { key: 'audio_ready', label: 'Audio Ready', count: stories.filter(s => s.status === 'audio_ready').length },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                {
                  backgroundColor: filter === tab.key ? primaryColor : cardBackgroundColor,
                  borderColor: filter === tab.key ? primaryColor : borderColor,
                  shadowColor: filter === tab.key ? primaryColor : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: filter === tab.key ? 0.15 : 0,
                  shadowRadius: 4,
                  elevation: filter === tab.key ? 2 : 0,
                },
              ]}
              onPress={() => setFilter(tab.key as any)}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  { color: filter === tab.key ? '#FFFFFF' : textColor },
                ]}
              >
                {tab.label} ({tab.count})
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stories List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.emptyState}>
            <Ionicons name="hourglass" size={48} color="#8E8E93" />
            <ThemedText style={styles.emptyText}>Loading your stories...</ThemedText>
          </View>
        ) : filteredStories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#8E8E93" />
            <ThemedText style={styles.emptyText}>
              {filter === 'all' ? 'No stories yet' : `No ${filter} stories`}
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              {filter === 'all'
                ? 'Create your first magical story!'
                : `Switch to "All Stories" to see all your content`}
            </ThemedText>
            {filter === 'all' && (
              <Button
                title="Create Your First Story"
                variant="primary"
                size="lg"
                onPress={handleCreateNewStory}
                style={styles.emptyButton}
              />
            )}
          </View>
        ) : (
          <View style={styles.storiesList}>
            {filteredStories.map(renderStoryItem)}
          </View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  storiesList: {
    gap: 12,
  },
  storyItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storyIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storyInfo: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  childName: {
    fontSize: 12,
    opacity: 0.6,
  },
  storyStatus: {
    marginLeft: 12,
  },
  storyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  storyDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  wordCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  audioText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 16,
  },
});
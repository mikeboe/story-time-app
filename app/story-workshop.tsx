import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StoryWorkshop from '@/components/story/story-workshop';

export default function StoryWorkshopPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the story data from params
  let story;
  try {
    story = typeof params.story === 'string' ? JSON.parse(params.story) : params.story;
  } catch (error) {
    // If parsing fails, create a default story
    story = {
      id: Date.now(),
      title: 'My Story',
      tone: 'magical',
      style: 'fairy-tale',
      content: 'Once upon a time...',
      status: 'draft',
      createdAt: new Date().toISOString(),
      wordCount: 4,
    };
  }

  const handleBack = () => {
    router.back();
  };

  const handleSave = (updatedStory: any) => {
    // In a real app, this would save to your backend or local storage
    console.log('Saving story:', updatedStory);
    // You could also navigate back or show a success message
  };

  return (
    <StoryWorkshop
      story={story}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}
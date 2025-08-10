/**
 * Story API Client Library
 * Provides a clean interface to interact with the backend story API
 */

const API_BASE_URL = "https://api.story-time.mikeboe.com";
const STORY_API_BASE = `${API_BASE_URL}/stories`;

import { authenticatedRequest, AuthApiError } from "./auth-api";

// Story data types
export interface Story {
  id: string;
  title: string;
  content?: string;
  tone: string;
  style: string;
  childName?: string;
  status: "draft" | "ready" | "audio_ready" | "published";
  wordCount: number;
  audioPreviewUrl?: string;
  audioFullUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoryRequest {
  tone: string;
  style: string;
  prompt: string;
  childName?: string;
}

export interface UpdateStoryRequest {
  title?: string;
  content?: string;
  tone?: string;
  style?: string;
  childName?: string;
  status?: "draft" | "ready" | "audio_ready" | "published";
}

export interface RegenerateStoryRequest {
  regenerateOption: "shorter" | "bedtime" | "adventurous" | "funny" | "gentle";
  section?: string;
}

export interface GenerateAudioRequest {
  voiceType?: "male" | "female" | "child";
  speed?: number;
  includeBackgroundMusic?: boolean;
}

export interface GetStoriesParams {
  page?: number;
  limit?: number;
  status?: "draft" | "ready" | "audio_ready" | "published";
  tone?: string;
  style?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any[];
}

export interface GenerateStoryResponse {
  id: string;
  title: string;
  content: string;
  tone: string;
  style: string;
  childName?: string;
  wordCount: number;
  generationId: string;
  processingTimeMs: number;
}

export interface StoryListResponse {
  stories: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RegenerateResponse {
  generationId: string;
  variant: string;
  processingTimeMs: number;
}

export interface AudioResponse {
  audioUrl: string;
  duration: number;
  processingTimeMs: number;
  cost?: number; // For full audio generation
}

/**
 * Makes authenticated HTTP requests to story endpoints
 */
async function storyApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STORY_API_BASE}${endpoint}`;

  try {
    const response = await authenticatedRequest(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let errorData: any = {};

      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new AuthApiError(errorMessage, response.status);
    }

    // For 204 No Content responses, return empty response
    if (response.status === 204) {
      return {} as T;
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    throw new AuthApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

/**
 * Story API Client
 */
export class StoryApi {
  /**
   * Create a new story
   */
  static async createStory(
    storyData: CreateStoryRequest
  ): Promise<ApiResponse<GenerateStoryResponse>> {
    try {
      const response = await storyApiRequest<GenerateStoryResponse>("", {
        method: "POST",
        body: JSON.stringify(storyData),
      });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError
            ? error.message
            : "Story creation failed",
      };
    }
  }

  /**
   * Get user's stories with pagination and filtering
   */
  static async getStories(
    params: GetStoriesParams = {}
  ): Promise<ApiResponse<StoryListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const url = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const response = await storyApiRequest<StoryListResponse>(url);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError
            ? error.message
            : "Failed to fetch stories",
      };
    }
  }

  /**
   * Get a specific story by ID
   */
  static async getStory(id: string): Promise<ApiResponse<Story>> {
    try {
      const response = await storyApiRequest<Story>(`/${id}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError
            ? error.message
            : "Failed to fetch story",
      };
    }
  }

  /**
   * Update an existing story
   */
  static async updateStory(
    id: string,
    updateData: UpdateStoryRequest
  ): Promise<ApiResponse<Story>> {
    try {
      const response = await storyApiRequest<Story>(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError ? error.message : "Story update failed",
      };
    }
  }

  /**
   * Delete a story
   */
  static async deleteStory(id: string): Promise<ApiResponse<void>> {
    try {
      await storyApiRequest<void>(`/${id}`, {
        method: "DELETE",
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError
            ? error.message
            : "Story deletion failed",
      };
    }
  }

  /**
   * Regenerate story content with different options
   */
  static async regenerateStory(
    id: string,
    regenerateData: RegenerateStoryRequest
  ): Promise<ApiResponse<RegenerateResponse>> {
    try {
      const response = await storyApiRequest<RegenerateResponse>(
        `/${id}/regenerate`,
        {
          method: "POST",
          body: JSON.stringify(regenerateData),
        }
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError
            ? error.message
            : "Story regeneration failed",
      };
    }
  }

  /**
   * Generate audio preview (30 seconds, free)
   */
  static async generateAudioPreview(
    id: string,
    audioOptions: GenerateAudioRequest = {}
  ): Promise<ApiResponse<AudioResponse>> {
    try {
      const response = await storyApiRequest<AudioResponse>(
        `/${id}/audio/preview`,
        {
          method: "POST",
          body: JSON.stringify(audioOptions),
        }
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError
            ? error.message
            : "Audio preview generation failed",
      };
    }
  }

  /**
   * Generate full audio (paid feature)
   */
  static async generateFullAudio(
    id: string,
    audioOptions: GenerateAudioRequest = {}
  ): Promise<ApiResponse<AudioResponse>> {
    try {
      const response = await storyApiRequest<AudioResponse>(
        `/${id}/audio/full`,
        {
          method: "POST",
          body: JSON.stringify(audioOptions),
        }
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof AuthApiError
            ? error.message
            : "Full audio generation failed",
      };
    }
  }
}

/**
 * Story API error class
 */
export class StoryApiError extends AuthApiError {
  constructor(message: string, public status?: number, public code?: string) {
    super(message, status, code);
    this.name = "StoryApiError";
  }
}

export default StoryApi;

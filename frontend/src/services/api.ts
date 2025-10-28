import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  APODData,
  MarsPhotosResponse,
  AsteroidsResponse,
  ChatResponse,
  PredictionRequest,
  PredictionResponse,
  FavoriteItem,
} from '../types';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// NASA API Services
export const nasaService = {
  // Get Astronomy Picture of the Day
  getAPOD: async (): Promise<APODData> => {
    try {
      const response = await api.get<APODData>('/nasa/apod');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Mars Rover Photos
  getMarsPhotos: async (
    rover: string = 'curiosity',
    sol: number = 1000
  ): Promise<MarsPhotosResponse> => {
    try {
      const response = await api.get<MarsPhotosResponse>('/nasa/mars', {
        params: { rover, sol },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Asteroid Data
  getAsteroids: async (
    startDate?: string,
    endDate?: string
  ): Promise<AsteroidsResponse> => {
    try {
      const response = await api.get<AsteroidsResponse>('/nasa/asteroids', {
        params: { start_date: startDate, end_date: endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// AI Chat Service
export const aiService = {
  // Send chat message to AI
  chat: async (message: string): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse>('/ai/chat', { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ML Prediction Service
export const mlService = {
  // Predict asteroid risk
  predictRisk: async (asteroidData: PredictionRequest): Promise<PredictionResponse> => {
    try {
      const response = await api.post<PredictionResponse>('/ml/predict', asteroidData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Favorites Service (localStorage)
export const favoritesService = {
  // Get all favorites
  getFavorites: (): FavoriteItem[] => {
    try {
      const favorites = localStorage.getItem('astroai_favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  },

  // Add to favorites
  addFavorite: (item: Omit<FavoriteItem, 'id'>): FavoriteItem[] => {
    try {
      const favorites = favoritesService.getFavorites();
      const newItem: FavoriteItem = { ...item, id: Date.now() };
      const newFavorites = [...favorites, newItem];
      localStorage.setItem('astroai_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  // Remove from favorites
  removeFavorite: (id: number): FavoriteItem[] => {
    try {
      const favorites = favoritesService.getFavorites();
      const newFavorites = favorites.filter((item) => item.id !== id);
      localStorage.setItem('astroai_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  // Check if item is favorited
  isFavorite: (title: string): boolean => {
    const favorites = favoritesService.getFavorites();
    return favorites.some((item) => item.title === title);
  },
};

export default api;

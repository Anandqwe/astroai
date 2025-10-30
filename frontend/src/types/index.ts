// NASA API Response Types

export interface APODData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

export interface MarsPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsPhotosResponse {
  photos: MarsPhoto[];
}

// Daily Mars image + weather response
export interface MarsDailyResponse {
  date: string;
  source: 'perseverance' | 'curiosity' | 'images-api';
  photo: MarsPhoto; // when source is images-api, some fields may be placeholders
  weather: {
    source: string;
    sol?: string;
    terrestrial_date?: string;
    min_temp?: number | null;
    max_temp?: number | null;
    pressure?: number | null;
    season?: string | null;
    stale: boolean;
    note?: string;
  };
}

export interface AsteroidData {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
}

export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface AsteroidsResponse {
  element_count: number;
  near_earth_objects: {
    [date: string]: AsteroidData[];
  };
}

// Chat Types
export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

// ML Prediction Types
export interface PredictionRequest {
  velocity: number;
  distance: number;
  diameter: number;
  magnitude: number;
}

export interface PredictionResponse {
  risk_level: 'Low' | 'Medium' | 'High';
  probability: number;
}

// Favorites Types
export interface FavoriteItem {
  id: number;
  type: 'apod' | 'mars' | 'asteroid';
  title: string;
  description?: string;
  imageUrl?: string;
  date: string;
  data?: any;
}

// Component Props Types
export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  className?: string;
}

export interface LoadingProps {
  message?: string;
}

export interface ChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  speed: number;
  distance: number;
  name: string;
}

// API Error Type
export interface APIError {
  message: string;
  status?: number;
  details?: any;
}

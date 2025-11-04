export type AstroSettings = {
  theme: 'dark';
  accentColor: 'indigo' | 'purple' | 'pink';
  autoRefresh: boolean;
  refreshInterval: 30 | 60 | 300;
  defaultRover: 'curiosity' | 'perseverance';
  defaultView: 'carousel' | 'grid';
  notifications: boolean;
  sounds: boolean;
};

const DEFAULT_SETTINGS: AstroSettings = {
  theme: 'dark',
  accentColor: 'indigo',
  autoRefresh: false,
  refreshInterval: 60,
  defaultRover: 'curiosity',
  defaultView: 'carousel',
  notifications: true,
  sounds: false,
};

const STORAGE_KEY = 'astroai_settings';

export const settingsService = {
  get(): AstroSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed } as AstroSettings;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  set(partial: Partial<AstroSettings>): AstroSettings {
    const next = { ...settingsService.get(), ...partial } as AstroSettings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  },
  reset(): AstroSettings {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },
};

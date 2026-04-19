"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

interface Settings {
  showUsageStats: boolean;
  enableNotifications: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  clearAllData: () => void;
  clearRecentTools: () => void;
}

const APP_STORAGE_KEYS = [
  "app-settings",
  "theme",
  "recent-tools"
];

const defaultSettings: Settings = {
  showUsageStats: true,
  enableNotifications: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("app-settings", JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const clearAllData = useCallback(() => {
    APP_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
    window.dispatchEvent(new Event("clear-recent-tools"));
    setSettings(defaultSettings);
    setTheme("system");
    window.location.reload();
  }, [setTheme]);

  const clearRecentTools = useCallback(() => {
    localStorage.removeItem("recent-tools");
    window.dispatchEvent(new Event("clear-recent-tools"));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, clearAllData, clearRecentTools }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

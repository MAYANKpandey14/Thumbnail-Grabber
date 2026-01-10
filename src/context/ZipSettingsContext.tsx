"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FilenamePattern = "default" | "flat-title" | "flat-id";
export type FolderStructure = "nested" | "flat";
export type QualityFilter = ("maxres" | "high" | "medium" | "standard")[];

interface ZipSettings {
    filenamePattern: FilenamePattern;
    folderStructure: FolderStructure;
    qualityFilter: QualityFilter;
}

interface ZipSettingsContextType extends ZipSettings {
    updateSettings: (settings: Partial<ZipSettings>) => void;
    resetSettings: () => void;
}

const defaultSettings: ZipSettings = {
    filenamePattern: "default",
    folderStructure: "nested",
    qualityFilter: ["maxres", "high", "medium", "standard"],
};

const ZipSettingsContext = createContext<ZipSettingsContextType | undefined>(undefined);

export function ZipSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<ZipSettings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("zip-settings");
            if (saved) {
                setSettings({ ...defaultSettings, ...JSON.parse(saved) });
            }
        } catch (e) {
            console.error("Failed to load zip settings", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const updateSettings = (newSettings: Partial<ZipSettings>) => {
        setSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem("zip-settings", JSON.stringify(updated));
            return updated;
        });
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem("zip-settings");
    };

    if (!isLoaded) {
        return null; // Or a loading spinner if preferred
    }

    return (
        <ZipSettingsContext.Provider
            value={{
                ...settings,
                updateSettings,
                resetSettings,
            }}
        >
            {children}
        </ZipSettingsContext.Provider>
    );
}

export function useZipSettings() {
    const context = useContext(ZipSettingsContext);
    if (context === undefined) {
        throw new Error("useZipSettings must be used within a ZipSettingsProvider");
    }
    return context;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageTier = "tier1" | "tier2" | "tier3" | "tier4";

export interface LanguageConfigItem {
  code: string; // ISO 코드 (예: ko, en)
  name: string; // 한국어 표시 이름 (예: 한국어, 영어)
  tier: LanguageTier;
  enabled: boolean;
}

interface LanguageConfigState {
  languages: LanguageConfigItem[];
  tierMultipliers: Record<LanguageTier, number>; // 예: tier1=1, tier2=1.2 등
}

interface LanguageConfigContextType extends LanguageConfigState {
  updateLanguage: (code: string, patch: Partial<LanguageConfigItem>) => void;
  updateTierMultiplier: (tier: LanguageTier, value: number) => void;
  addLanguage: (item: LanguageConfigItem) => void;
  removeLanguage: (code: string) => void;
}

const LanguageConfigContext = createContext<LanguageConfigContextType | undefined>(
  undefined
);

const DEFAULT_LANGUAGES: LanguageConfigItem[] = [
  { code: "ko", name: "한국어", tier: "tier1", enabled: true },
  { code: "en", name: "영어", tier: "tier1", enabled: true },
  { code: "ja", name: "일본어", tier: "tier1", enabled: true },
  { code: "zh", name: "중국어", tier: "tier1", enabled: true },
  { code: "es", name: "스페인어", tier: "tier1", enabled: false },
  { code: "fr", name: "프랑스어", tier: "tier2", enabled: false },
  { code: "de", name: "독일어", tier: "tier2", enabled: false },
  { code: "ru", name: "러시아어", tier: "tier2", enabled: false },
  { code: "vi", name: "베트남어", tier: "tier2", enabled: false },
  { code: "th", name: "태국어", tier: "tier2", enabled: false },
  { code: "ar", name: "아랍어", tier: "tier2", enabled: false },
  { code: "pt", name: "포르투갈어", tier: "tier3", enabled: false },
  { code: "it", name: "이탈리아어", tier: "tier3", enabled: false },
  { code: "tr", name: "터키어", tier: "tier3", enabled: false },
  { code: "nl", name: "네덜란드어", tier: "tier3", enabled: false },
  { code: "sv", name: "스웨덴어", tier: "tier3", enabled: false },
  { code: "pl", name: "폴란드어", tier: "tier3", enabled: false },
  { code: "hi", name: "힌디어", tier: "tier4", enabled: false },
  { code: "id", name: "인도네시아어", tier: "tier4", enabled: false },
  { code: "ms", name: "말레이어", tier: "tier4", enabled: false },
  { code: "bn", name: "벵골어", tier: "tier4", enabled: false },
  { code: "uk", name: "우크라이나어", tier: "tier4", enabled: false },
  { code: "fa", name: "페르시아어", tier: "tier4", enabled: false },
];

const DEFAULT_TIER_MULTIPLIERS: Record<LanguageTier, number> = {
  tier1: 1.0,
  tier2: 1.2,
  tier3: 1.5,
  tier4: 2.0,
};

const STORAGE_KEY = "languageConfig";

export function LanguageConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<LanguageConfigState>({
    languages: DEFAULT_LANGUAGES,
    tierMultipliers: DEFAULT_TIER_MULTIPLIERS,
  });

  // 클라이언트 localStorage에서 불러오기
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<LanguageConfigState>;
        setState((prev) => ({
          languages: parsed.languages ?? prev.languages,
          tierMultipliers: {
            ...prev.tierMultipliers,
            ...(parsed.tierMultipliers ?? {}),
          },
        }));
      }
    } catch (e) {
      console.error("Failed to load language config from localStorage", e);
    }
  }, []);

  const persist = (next: LanguageConfigState) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    } catch (e) {
      console.error("Failed to save language config to localStorage", e);
    }
  };

  const updateLanguage = (code: string, patch: Partial<LanguageConfigItem>) => {
    setState((prev) => {
      const nextLanguages = prev.languages.map((lang) =>
        lang.code === code ? { ...lang, ...patch } : lang
      );
      const next = { ...prev, languages: nextLanguages };
      persist(next);
      return next;
    });
  };

  const updateTierMultiplier = (tier: LanguageTier, value: number) => {
    setState((prev) => {
      const next: LanguageConfigState = {
        ...prev,
        tierMultipliers: { ...prev.tierMultipliers, [tier]: value },
      };
      persist(next);
      return next;
    });
  };

  const addLanguage = (item: LanguageConfigItem) => {
    setState((prev) => {
      // 같은 코드가 이미 있으면 덮어쓰기
      const exists = prev.languages.find((l) => l.code === item.code);
      const nextLanguages = exists
        ? prev.languages.map((l) => (l.code === item.code ? item : l))
        : [...prev.languages, item];
      const next: LanguageConfigState = { ...prev, languages: nextLanguages };
      persist(next);
      return next;
    });
  };

  const removeLanguage = (code: string) => {
    setState((prev) => {
      const next: LanguageConfigState = {
        ...prev,
        languages: prev.languages.filter((l) => l.code !== code),
      };
      persist(next);
      return next;
    });
  };

  return (
    <LanguageConfigContext.Provider
      value={{
        ...state,
        updateLanguage,
        updateTierMultiplier,
        addLanguage,
        removeLanguage,
      }}
    >
      {children}
    </LanguageConfigContext.Provider>
  );
}

export function useLanguageConfig() {
  const ctx = useContext(LanguageConfigContext);
  if (!ctx) {
    throw new Error("useLanguageConfig must be used within LanguageConfigProvider");
  }
  return ctx;
}

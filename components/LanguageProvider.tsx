"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLanguage,
  i18n,
  isLanguage,
  type Language,
  type Translation,
} from "@/lib/i18n";

const STORAGE_KEY = "wssc-language";
const FADE_MS = 220;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [contentOpacity, setContentOpacity] = useState(1);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingLanguageRef = useRef<Language | null>(null);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(savedLanguage)) {
      queueMicrotask(() => setLanguageState(savedLanguage));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "jp" ? "ja" : "en";
  }, [language]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current !== null) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    if (nextLanguage === language) return;

    pendingLanguageRef.current = nextLanguage;

    if (fadeTimeoutRef.current !== null) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    setContentOpacity(0);

    fadeTimeoutRef.current = setTimeout(() => {
      fadeTimeoutRef.current = null;
      const next = pendingLanguageRef.current;
      pendingLanguageRef.current = null;
      if (!next) return;

      setLanguageState(next);
      window.localStorage.setItem(STORAGE_KEY, next);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setContentOpacity(1));
      });
    }, FADE_MS);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: i18n[language],
    }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div
        className={`flex min-h-full flex-col transition-opacity duration-[220ms] ease-in-out ${
          contentOpacity === 0 ? "pointer-events-none" : ""
        }`}
        style={{ opacity: contentOpacity }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }

  return context;
}

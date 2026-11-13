/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

/**
 * Language (i18n) context.
 *
 * - `t(text, vars)` returns the translation of `text` for the active language.
 *   Keys are the source strings as written in the code (some in English, some in
 *   Spanish). If there is no entry for the active language, the key itself is
 *   returned, so a string written in Spanish only needs an `en` entry and vice versa.
 * - `{name}` placeholders are replaced with `vars.name`.
 * - The selected language is persisted in localStorage ("lang").
 */
const STORAGE_KEY = "lang";
const SUPPORTED = ["es", "en"];

function readStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(v)) return v;
  } catch {
    /* storage unavailable */
  }
  const nav = (typeof navigator !== "undefined" && navigator.language) || "es";
  return nav.toLowerCase().startsWith("en") ? "en" : "es";
}

let currentLang = readStoredLang();

/** Translate outside React components (utils, alerts in plain functions). */
export function translate(text, vars, lang = currentLang) {
  if (text == null) return text;
  const dict = translations[lang] || {};
  let out = Object.prototype.hasOwnProperty.call(dict, text) ? dict[text] : text;
  if (vars) {
    out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
  }
  return out;
}

export function getLang() {
  return currentLang;
}

/** BCP-47 locale for Intl / toLocale* calls. */
export function getLocale(lang = currentLang) {
  return lang === "en" ? "en-US" : "es-AR";
}

const LanguageContext = createContext({
  lang: currentLang,
  setLang: () => {},
  t: translate,
  locale: getLocale(),
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(currentLang);

  const setLang = useCallback((next) => {
    if (!SUPPORTED.includes(next)) return;
    currentLang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    setLangState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      locale: getLocale(lang),
      t: (text, vars) => translate(text, vars, lang),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Compact ES / EN switch. */
export function LanguageSwitcher({ className = "" }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      className={`inline-flex items-center rounded-lg border-[1px] border-zinc-700 bg-zinc-800/60 p-0.5 text-xs font-semibold ${className}`}
      role="group"
      aria-label={t("Language")}
      title={t("Language")}
    >
      {[
        { code: "es", label: "ES", full: "Español" },
        { code: "en", label: "EN", full: "English" },
      ].map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.full}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            lang === l.code ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

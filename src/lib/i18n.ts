import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

const resources: Resource = {
  en: { translation: en },
  ar: { translation: ar },
};

interface I18nConfig {
  resources: Resource;
  defaultNS: string;
  fallbackLng: string;
  lng: string;
  interpolation: {
    escapeValue: boolean;
  };
  react: {
    useSuspense: boolean;
  };
}

const i18nConfig: I18nConfig = {
  resources,
  defaultNS: "translation",
  fallbackLng: "en",
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  
};
i18n.use(initReactI18next).init(i18nConfig);

export default i18n;
export { i18nConfig };

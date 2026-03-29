import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('site_lang') || 'en';
  });

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('site_lang', l);
  };

  const t = (key) => {
    const translations = require('./translations').default;
    const map = translations[lang] || translations['en'];
    return map[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
export default LanguageContext;

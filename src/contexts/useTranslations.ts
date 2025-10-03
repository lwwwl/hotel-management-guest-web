import { useLanguage } from './LanguageContext';
import { LANGUAGES } from '../constants';

export const useTranslations = () => {
  const { language } = useLanguage();
  return LANGUAGES[language] || LANGUAGES.zh;
};

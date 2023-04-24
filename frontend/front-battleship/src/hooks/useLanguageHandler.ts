import { useTranslation } from 'react-i18next';
import { useAppDispatch } from './reduxHooks';
import { setLang } from '../store/slices/I18nSlice';

const useLanguageHandler = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const changeLanguage = (lang: string) => {
    dispatch(setLang(lang));
    i18n.changeLanguage(lang);
  };
  return {
    changeLanguage,
  };
};

export default useLanguageHandler;

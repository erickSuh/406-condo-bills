import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './locales/pt-br/common.json';
import errors from './locales/pt-br/errors.json';
import messages from './locales/pt-br/messages.json';
import cashFlowListScreen from './locales/pt-br/cashFlowListScreen.json';
import cashFlowFormScreen from './locales/pt-br/cashFlowFormScreen.json';

const resources = {
  'pt-BR': {
    common,
    errors,
    messages,
    cashFlowListScreen,
    cashFlowFormScreen,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  ns: 'common',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;

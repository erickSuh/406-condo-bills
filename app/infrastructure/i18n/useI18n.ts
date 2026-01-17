// Example of using i18n in your app

import { useTranslation } from './index';

export function useI18n() {
  return useTranslation();
}

// Usage in components:
// import { useI18n } from './app/infrastructure/i18n/useI18n';
//
// export const MyComponent = () => {
//   const { t } = useI18n();
//   return <Text>{t('buttons.continue')}</Text>;
// };

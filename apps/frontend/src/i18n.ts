import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // For now, we'll always use pt-BR
  // In the future, this could be dynamic based on user preferences or Accept-Language header
  const locale = 'pt-BR';

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
});

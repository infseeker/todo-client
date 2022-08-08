import { locales } from '../locales/locales';

export function getFullLocales() {
  return locales;
}

export function getDefaultLocale() {
  const defaultLocale = getFullLocales()[0].code;

  const navigatorLang =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;

  const locale = navigatorLang ? navigatorLang.trim().split(/-|_/)[0] : undefined;

  return locale || defaultLocale;
}

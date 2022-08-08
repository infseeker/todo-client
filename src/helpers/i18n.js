import { locales } from '../locales/locales';

export function getFullLocales() {
  return locales;
}

export function isLocaleExists(locale) {
  return getFullLocales().find(l => l.code === locale) ? true : false;
}

export function getDefaultLocale() {
  const defaultLocale = getFullLocales().find(l => l.default);
  'en'
  const navigatorLang =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;

  const locale = navigatorLang
    ? navigatorLang.trim().split(/-|_/)[0]
    : undefined;

  return isLocaleExists(locale) ? locale  : defaultLocale;
}

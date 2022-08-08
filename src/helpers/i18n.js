export function getBrowserLocale(options = {}) {
  if (localStorage.getItem('locale')) {
    return localStorage.getItem('locale');
  }

  const defaultOptions = { countryCodeOnly: false };

  const opt = { ...defaultOptions, ...options };

  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;
  if (!navigatorLocale) {
    return undefined;
  }

  const trimmedLocale = opt.countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[0]
    : navigatorLocale.trim();

  localStorage.setItem('locale', trimmedLocale);

  return trimmedLocale;
}

export function setBrowserLocale(locale) {
  localStorage.setItem('locale', locale);
}

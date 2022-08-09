import { locales } from '../locales/locales';
import { app } from '../main';

class I18nUtils {
  constructor() {
    this.locales = locales || [];
    this.systemLocale = this.locales.find((l) => l.system) || this.locales[0];
    this.defaultLocale = this.locales.find((l) => l.default) || this.locales[1];
  }

  isLocaleExists(code) {
    return this.locales.find((l) => l.code === code) ? true : false;
  }

  getBrowserLocaleCode() {
    const navigatorLocaleCode =
      navigator.languages !== undefined
        ? navigator.languages[0]
        : navigator.language;

    const code = navigatorLocaleCode
      ? navigatorLocaleCode.trim().split(/-|_/)[0]
      : undefined;

    return code;
  }

  getLocaleByCode(code) {
    return this.locales.find((l) => l.code === code);
  }

  getDefaultLocale() {
    const browserLocaleCode = this.getBrowserLocaleCode();
    return this.isLocaleExists(browserLocaleCode) ? browserLocaleCode : this.defaultLocale;
  }

  setLocale(code) {
    app.config.globalProperties.$i18n.locale =
      code === this.systemLocale.code ? i18nUtils.getDefaultLocale() : code;
  }
}

export const i18nUtils = new I18nUtils();

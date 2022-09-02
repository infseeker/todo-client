import { i18nUtils } from '../helpers/i18n';

class User {
  constructor(data) {
    this.login(data);
  }

  login(data = {}) {
    this.id = data.id || undefined;
    this.username = data.username || undefined;
    this.email = data.email || undefined;
    this.image = data.image || null;
    this.locale = i18nUtils.isLocaleExists(data.locale)
      ? data.locale
      : i18nUtils.getDefaultLocale() || undefined;
    this.isAuth = data.email ? true : false;
    this.isActivated = data.activate || false;
    this.isDeleted = data.deleted || false;
    this.isAdmin = data.admin || false;
  }

  logout() {
    Object.keys(this).forEach(key => delete this[key]);
  }
}

export const user = new User();

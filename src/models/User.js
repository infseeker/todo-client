import { api } from '/public/server-api.js';
import { getDefaultLocale } from '../helpers/i18n';

class User {
  constructor(data) {
    this.login(data);
  }

  login(data = {}) {
    this.isAuth = data.email ? true : false;
    this.isAdmin = data.admin || false;
    this.isDeleted = data.deleted || false;
    this.email = data.email || undefined;
    this.username = data.username || undefined;
    this.image = data.image ? api.user.get_image(data.image) : null;
    this.locale = data.locale || getDefaultLocale() || undefined;
  }

  logout() {
    this.isAuth = false;
    this.isAdmin = false;
    this.isDeleted = false;
    this.username = undefined;
    this.email = undefined;
    this.image = null;
    this.locale = undefined;
  }
}

export const user = new User();

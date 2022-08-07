import { api } from '/public/server-api.js'

class User {
  constructor(data) {
    this.login(data);
  }

  login(data = {}) {
    this.isAuth = data.email ? true : false;
    this.isAdmin = data.admin || false;
    this.isDeleted = data.deleted || false;
    this.email = data.email || false;
    this.username = data.username || false;
    this.image = data.image ? api.user.get_image(data.image) : false;
  }

  logout() {
    this.isAuth = false;
    this.isAdmin = false;
    this.isDeleted = false;
    this.username = false;
    this.email = false;
    this.image = false;
  }
}

export const user = new User();
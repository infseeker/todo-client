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
  }

  logout() {
    this.isAuth = false;
    this.isAdmin = false;
    this.isDeleted = false;
    this.username = false;
    this.email = false;
  }
}

export const user = new User();
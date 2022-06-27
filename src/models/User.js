class User {
  constructor(data) {
    this.setAuthData(data);
  }

  setAuthData(data = {}) {
    this.isAuth = data.login || false;
    this.isAdmin = data.admin || false;
    this.isDeleted = data.deleted || false;
    this.email = data.email || false
  }

  login(data) {
    this.setAuthData(data)
  }

  logout() {
    this.isAuth = false;
    this.isAdmin = false;
    this.email = false;
  }
}

export const user = new User();
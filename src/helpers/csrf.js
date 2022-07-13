class CSRF {
  constructor(token) {
    this.getToken(token);
  }

  setToken(token) {
    this._token = token;
  }

  getToken() {
    return this._token;
  }
}

export const csrf = new CSRF();
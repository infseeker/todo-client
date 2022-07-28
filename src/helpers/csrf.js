export const csrf = {
  _token: '',

  setToken(token) {
    this._token = token;
  },

  getToken() {
    return this._token;
  }
}
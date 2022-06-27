import { api } from '/public/server-api';
import { app } from '../main'

class UserService {
  /**
   * Returns CSRF Protection Token needed for every request to the API
   */
  static async getCSRFToken() {
    return await fetch(api.user.csrf, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
  }

  static async checkUsername(username) {
    return await fetch(api.user.check_username, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async checkEmail(email) {
    return await fetch(api.user.check_email, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async register(username, email, password, token) {
    return await fetch(api.user.register, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        token: token
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * @param {String} accessCode - access code from email after registration
   */
  static async activate(email, accessCode) {
    return await fetch(api.user.activate, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        access_code: accessCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async sendRestorationEmail(email) {
    return await fetch(api.user.restore_email, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * @param {String} accessCode - access code from restoration email
   */
  static async restore(email, accessCode, newPassword) {
    return await fetch(api.user.restore, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        access_code: accessCode,
        password: newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * @param {String} username - username or email
   * @param {String} token - reCaptcha v3 token
   */
  static async login(username, password, token) {
    return await fetch(api.user.login, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
        password: password,
        token: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * Get session of current user. If user logged in - true, not - false.
   */
  static async getSession() {
    return await fetch(api.user.session, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * Get user data if user logged in, else - 401.
   */
  static async getUserData() {
    return await fetch(api.user.user_data, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async logout() {
    return await fetch(api.user.logout, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   *
   * @param {String} password - for now we can change password only
   */
  static async update(password) {
    return await fetch(api.user.update, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * Mark user as deleted in DB (not remove it from DB)
   * @param {String} password - user need to enter password for deleting
   */
  static async delete(password) {
    return await fetch(api.user.delete, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': app.config.globalProperties.$csrf.getToken()
      },
      credentials: 'include',
      body: JSON.stringify({
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }
}

export default UserService;

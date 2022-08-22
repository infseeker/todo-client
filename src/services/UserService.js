import { api } from '/public/server-api';
import { csrf } from '../helpers/csrf';

class UserService {
  /**
   * Returns CSRF Protection Token needed for every request to the API
   */
  static async getCSRFToken() {
    return await fetch(api.user.csrf, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then((r) => {
      csrf.setToken(r.headers.get(['X-CSRFToken']));
      return r.json();
    });
  }

  static async checkUsername(username) {
    return await fetch(api.user.check_username, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
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
        'X-CSRFToken': csrf.getToken(),
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
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        token: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * @param {String} accessCode - access code from email after registration
   */
  static async activate(email, accessCode, token) {
    return await fetch(api.user.activate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        access_code: accessCode,
        token: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async sendRestorationEmail(email, token) {
    return await fetch(api.user.restore_email, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        token: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * @param {String} accessCode - access code from restoration email
   */
  static async restore(email, newPassword, accessCode, token) {
    return await fetch(api.user.restore, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        password: newPassword,
        access_code: accessCode,
        token: token,
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
        'X-CSRFToken': csrf.getToken(),
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
   * Get user image if user logged in, else - 401.
   * @param {String} image - image name
   */
  static getUserImage(image) {
    return image ? api.user.get_image(image) : null;
  }

  /**
   * Change user image if user logged in, else - 401.
   * @param {String} image - image
   */
  static async changeUserImage(image) {
    return await fetch(api.user.image, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        image: image,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * Delete user image if user logged in, else - 401.
   */
  static async deleteUserImage() {
    return await fetch(api.user.image, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * Change user password if user logged in, else - 401.
   * @param {String} oldPassword - current user password
   * @param {String} newPassword - new password
   */
  static async changePassword(oldPassword, newPassword) {
    return await fetch(api.user.password, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        old_password: oldPassword,
        password: newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   * Change user password if user logged in, else - 401.
   * @param {String} localeCode - user locale code
   */
  static async changeLocale(localeCode) {
    return await fetch(api.user.locale, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        locale: localeCode,
      }),
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
   * @param {String} password - user needs to enter password for deleting
   */
  static async delete(password) {
    return await fetch(api.user.delete, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
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

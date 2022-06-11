import { api } from '/public/server-api'

class UserService {
  static async login(credentials) {
    return await fetch(api.user.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  static async getUserData() {
    return await fetch(api.user.user_data)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
}

export default UserService;

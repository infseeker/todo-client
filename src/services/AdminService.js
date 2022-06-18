import { api } from '/public/server-api';

class AdminService {
  static async getUsers() {
    return await fetch(api.admin.users.get_users, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async getUser(user_id) {
    return await fetch(api.admin.users.get_user(user_id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async createUser(user) {
    return await fetch(api.admin.users.create_user(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async updateUser(user) {
    return await fetch(api.admin.users.update_user(user.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async deleteUser(user) {
    return await fetch(api.admin.users.delete_user(user.id), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async getUserLists(user) {
    return await fetch(api.admin.lists.get_user_lists(user.id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async createUserList(user, title) {
    return await fetch(api.admin.lists.create_user_list(user.id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async updateUserList(user, list) {
    return await fetch(api.admin.lists.update_user_list(user.id, list.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(list),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async deleteUserList(user, list) {
    return await fetch(api.admin.lists.delete_user_list(user.id, list.id), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async getUserListItems(user, list) {
    return await fetch(api.admin.lists.get_user_list_items(user.id, list.id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async createUserListItem(user, list, title) {
    return await fetch(api.admin.lists.create_user_list_item(user.id, list.id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async updateUserListItem(user, listItem) {
    return await fetch(api.admin.lists.update_user_list_item(user.id, listItem.list_id, listItem.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(listItem),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async deleteUserListItem(user, listItem) {
    return await fetch(api.admin.lists.delete_user_list_item(user.id, listItem.list_id, listItem.id), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => data);
  }
}

export default AdminService;

// export const API_ROOT = `http://192.168.0.2:5000/todo/api`;
export const API_ROOT = `http://192.168.0.2:8080/todo/api`;

export const api = {
  user: {
    csrf: `${API_ROOT}/user/csrf`,
    check_username: `${API_ROOT}/user/check-username`,
    check_email: `${API_ROOT}/user/check-email`,
    check_password: `${API_ROOT}/user/check-password`,
    register: `${API_ROOT}/user/register`,
    activate: `${API_ROOT}/user/activate`,
    restore_email: `${API_ROOT}/user/restore-email`,
    restore: `${API_ROOT}/user/restore`,
    login: `${API_ROOT}/user/login`,
    session: `${API_ROOT}/user/session`,
    user_data: `${API_ROOT}/user/user-data`,
    logout: `${API_ROOT}/user/logout`,
    update: `${API_ROOT}/user/update`,
    delete: `${API_ROOT}/user/delete`,
  },

  lists: {
    get_lists: `${API_ROOT}/lists`,

    create_list: function () {
      return this.get_lists;
    },
    update_list: function (list_id) {
      return `${this.get_lists}/${list_id}`;
    },
    delete_list: function (list_id) {
      return `${this.get_lists}/${list_id}`;
    },
    get_list_items: function (list_id) {
      return `${this.get_lists}/${list_id}`;
    },
    create_list_item: function (list_id) {
      return `${this.get_lists}/${list_id}`;
    },
    update_list_item: function (list_id, list_item_id) {
      return `${this.get_lists}/${list_id}/${list_item_id}`;
    },
    delete_list_item: function (list_id, list_item_id) {
      return `${this.get_lists}/${list_id}/${list_item_id}`;
    },
  },

  admin: {
    users: {
      get_users: `${API_ROOT}/admin/users`,

      get_user: function (user_id) {
        return `${this.get_users}/${user_id}`;
      },

      create_user: function () {
        return this.get_users;
      },
      update_user: function (user_id) {
        return `${this.get_users}/${user_id}`;
      },
      delete_user: function (user_id) {
        return `${this.get_users}/${user_id}`;
      },
    },

    lists: {
      get_users: `${API_ROOT}/admin/users`,

      get_user_lists: function (user_id) {
        return `${this.get_users}/${user_id}/lists`;
      },
      create_user_list: function (user_id) {
        return `${this.get_users}/${user_id}/lists`;
      },
      update_user_list: function (user_id, user_list_id) {
        return `${this.get_users}/${user_id}/lists/${user_list_id}`;
      },
      delete_user_list: function (user_id, user_list_id) {
        return `${this.get_users}/${user_id}/lists/${user_list_id}`;
      },

      get_user_list_items: function (user_id, user_list_id) {
        return `${this.get_users}/${user_id}/lists/${user_list_id}`;
      },
      create_user_list_item: function (user_id, user_list_id) {
        return `${this.get_users}/${user_id}/lists/${user_list_id}`;
      },
      update_user_list_item: function (
        user_id,
        user_list_id,
        user_list_item_id
      ) {
        return `${this.get_users}/${user_id}/lists/${user_list_id}/${user_list_item_id}`;
      },
      delete_user_list_item: function (
        user_id,
        user_list_id,
        user_list_item_id
      ) {
        return `${this.get_users}/${user_id}/lists/${user_list_id}/${user_list_item_id}`;
      },
    },
  },
};

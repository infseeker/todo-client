export const API_ROOT = `/todo/api`;

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
    image: `${API_ROOT}/user/image`,
    password: `${API_ROOT}/user/password`,
    locale: `${API_ROOT}/user/locale`,
    logout: `${API_ROOT}/user/logout`,
    delete: `${API_ROOT}/user/delete`,

    get_image: function(image) {
      return `${API_ROOT}/user/image/${image}`
    }
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

  admin: `${API_ROOT}/admin/user`,
};

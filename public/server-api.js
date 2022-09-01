export const API_ROOT = `/todo/api`;

const user_api = `${API_ROOT}/user`;
const list_api = `${API_ROOT}/lists`;
const admin_api = `${API_ROOT}/admin`;

export const api = {
  user: {
    csrf: `${user_api}/csrf`,
    check_username: `${user_api}/check-username`,
    check_email: `${user_api}/check-email`,
    check_password: `${user_api}/check-password`,
    register: `${user_api}/register`,
    activate: `${user_api}/activate`,
    restore_email: `${user_api}/restore-email`,
    restore: `${user_api}/restore`,
    login: `${user_api}/login`,
    session: `${user_api}/session`,
    image: `${user_api}/image`,
    password: `${user_api}/password`,
    locale: `${user_api}/locale`,
    logout: `${user_api}/logout`,
    delete: `${user_api}/delete`,

    get_image: function (image) {
      return `${user_api}/image/${image}`;
    },
  },

  lists: {
    get_lists: `${list_api}`,

    create_list: `${list_api}`,
    
    update_list: function (list_id) {
      return `${list_api}/${list_id}`;
    },
    delete_list: function (list_id) {
      return `${list_api}/${list_id}`;
    },
    share_list: function (list_id) {
      return `${list_api}/${list_id}/share`;
    },
    unshare_list: function (list_id) {
      return `${list_api}/${list_id}/share`;
    },
    get_list_items: function (list_id) {
      return `${list_api}/${list_id}`;
    },
    create_list_item: function (list_id) {
      return `${list_api}/${list_id}`;
    },
    update_list_item: function (list_id, list_item_id) {
      return `${list_api}/${list_id}/${list_item_id}`;
    },
    delete_list_item: function (list_id, list_item_id) {
      return `${list_api}/${list_id}/${list_item_id}`;
    },
    shared_list: `${list_api}/shared`,
  },

  admin: `${admin_api}/user`,
};

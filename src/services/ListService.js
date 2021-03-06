import { api } from '/public/server-api';
import { csrf } from '../helpers/csrf';

class ListService {
  static async getLists() {
    return await fetch(api.lists.get_lists, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async createList(title) {
    return await fetch(api.lists.create_list(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async updateList(list) {
    return await fetch(api.lists.update_list(list.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify(list),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async deleteList(list) {
    return await fetch(api.lists.delete_list(list.id), {
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

  static async getListItems(list_id) {
    return await fetch(api.lists.get_list_items(list_id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async createListItem(list, title) {
    return await fetch(api.lists.create_list_item(list.id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async updateListItem(listItem) {
    return await fetch(
      api.lists.update_list_item(listItem.list_id, listItem.id),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf.getToken(),
        },
        credentials: 'include',
        body: JSON.stringify(listItem),
      }
    )
      .then((response) => response.json())
      .then((data) => data);
  }

  static async deleteListItem(listItem) {
    return await fetch(api.lists.delete_list(listItem.list_id, listItem.id), {
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
}

export default ListService;

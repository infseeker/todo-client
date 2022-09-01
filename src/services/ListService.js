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

  static async createList(title, items) {
    let listItems = Array.isArray(items) && items.length > 0 ? items : null;

    if (listItems) {
      listItems = listItems.map((i) => {
        const item = {
          title: i.title,
          is_liked: i.liked,
          is_done: i.done,
          position: i.position,
        };

        return item;
      });
    }

    return await fetch(api.lists.create_list, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        title: title,
        items: listItems,
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


  static async shareList(list, email) {
    return await fetch(api.lists.share_list(list.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        'email': email
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }


  static async unshareList(list, email) {
    return await fetch(api.lists.share_list(list.id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        'email': email
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }


  static async getListItems(listId) {
    return await fetch(api.lists.get_list_items(listId), {
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

  static async createListItem(list, title, position) {
    return await fetch(api.lists.create_list_item(list.id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf.getToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        title: title,
        position: position,
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  }

  static async updateListItem(listItem, previousListItemId = null) {
    return await fetch(
      api.lists.update_list_item(listItem.listId, listItem.id),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf.getToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          title: listItem.title,
          is_done: listItem.done,
          is_liked: listItem.liked,
          position: listItem.position,
          previous_list_item_id: previousListItemId,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => data);
  }

  static async deleteListItem(listItem) {
    return await fetch(
      api.lists.delete_list_item(listItem.listId, listItem.id),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf.getToken(),
        },
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((data) => data);
  }
}

export default ListService;

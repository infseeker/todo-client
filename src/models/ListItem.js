export default class ListItem {
  constructor(data) {
    this.id = data.id || null;
    this.listId = data.list_id || null;
    this.title = data.title || null;
    this.done = data.is_done || data.done || false;
    this.liked = data.is_liked || data.liked || false;
    this.position = data.position || null;
  }

  check() {
    this.done = !this.done;
  }

  like() {
    this.liked = !this.liked;
  }

  range(position) {
    this.position = position || null;
  }

  saveTitle(title) {
    this.title = title || null;
  }
}
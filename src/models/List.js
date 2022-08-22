import { api } from '/public/server-api.js';

export default class List {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title || null;
    this.items = data.items || [];
    this.owner = data.owner || null;
    this.shared = data.shared || [];

    if (this.owner && this.owner.image)
      this.owner.image = api.user.get_image(this.owner.image);

    if (this.shared && this.shared.length) {
      this.shared.forEach(user => {
        user.image = user.image ? api.user.get_image(user.image) : null
      });
    }
      
  }

  loadItems(items) {
    this.items = items || [];
  }

  addItem(item) {
    this.items.push(item);
  }

  saveTitle(title) {
    this.title = title;
  }
}

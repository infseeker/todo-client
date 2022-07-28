export default class List {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title || null;
    this.items = data.items || [];
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
export default class List {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title || null;
    this.items = data.items || [];
    this.owner = data.owner || null;
    this.shared = data.shared || [];
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

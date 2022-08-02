export const loader = {
  shown: false,

  show(blur) {
    if (blur !== false) document.activeElement.blur();

    this.timeout = setTimeout(() => {
      this.shown = true;
    }, 1000);
  },

  hide() {
    this.shown = false;
    clearTimeout(this.timeout);
  },
};

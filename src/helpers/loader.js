export const loader = {
  shown: false,
  
  show() {
    this.timeout = setTimeout(() => {
      this.shown = true;
    }, 500);
  },

  hide() {
    this.shown = false;
    clearTimeout(this.timeout);
  },
};

export const loader = {
  shown: false,
  
  show() {
    this.timeout = setTimeout(() => {
      this.shown = true;
    }, 1000);
  },

  hide() {
    this.shown = false;
    clearTimeout(this.timeout);
  },
};

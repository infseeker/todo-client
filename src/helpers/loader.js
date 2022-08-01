export const loader = {
  shown: false,
  
  show() {
    window.focus();
    
    this.timeout = setTimeout(() => {
      this.shown = true;
    }, 1000);
  },

  hide() {
    this.shown = false;
    clearTimeout(this.timeout);
  },
};

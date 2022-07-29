export const setFocusOnModalInput = function(app, modal, input, condition = null, secondInput = null) {
  let field;

  const listener = () => {
    app.$nextTick(() => {
      if(!condition) {
        field = input;
      } else {
        field = !condition ? input : secondInput;
      }
      
      field.focus();
    });

    modal.removeEventListener('shown.bs.modal', listener);
  };

  modal.addEventListener('shown.bs.modal', listener);
}
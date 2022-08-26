export function removeUselessSymbols(str, mode) {
  switch (mode) {
    case 'all':
      return str.replace(/([\r\n])|( +(?= ))|(^\s)/g, '');

    case 'breaks':
      return str.replace(/[\r\n]/g, ' ').replace(/ +(?= )/g, '');
  }
}
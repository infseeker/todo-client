function addRootPathToAPI(rootPath, api) {
  for (const path in api) {
    if (typeof api[path] === 'object' && api[path] !== null) {
      addRootPathToAPI(rootPath, api[path]);
    } else if (typeof api[path] === 'string' && api[path] !== null) {
      api[path] = rootPath + api[path];
    }
  }
}

export function createFullPathAPI(rootPath, shortAPI) {
  const api = shortAPI;
  addRootPathToAPI(rootPath, api);
  return api;
}

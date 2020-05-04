export const makeString = (object) => (object == null ? "" : `${object}`);

const cleanKey = (key) => (key && key.indexOf("###") > -1 ? key.replace(/###/g, ".") : key);

const getLastOfPath = (object, path) => {
  const canNotTraverseDeeper = () => !object || typeof object === "string";

  const stack = typeof path !== "string" ? [].concat(path) : path.split(".");
  while (stack.length > 1) {
    if (canNotTraverseDeeper()) return {};

    const key = cleanKey(stack.shift());
    object = object[key];
  }

  if (canNotTraverseDeeper()) return {};

  return {
    obj: object,
    k: cleanKey(stack.shift()),
  };
};

export const getPath = (object, path) => {
  const { obj, k } = getLastOfPath(object, path);

  if (!obj) return undefined;
  return obj[k];
};

export const regexEscape = (str) =>
  /* eslint no-useless-escape: 0 */
  str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

export const escape = (data) => (typeof data === "string" ? data.replace(/[&<>"'\/]/g, (s) => entityMap[s]) : data);

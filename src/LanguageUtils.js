const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const formatLanguageCode = (code) => {
  // http://www.iana.org/assignments/language-tags/language-tags.xhtml
  if (typeof code === "string" && code.indexOf("-") > -1) {
    const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
    let p = code.split("-");

    if (p.length === 2) {
      p[0] = p[0].toLowerCase();
      p[1] = p[1].toUpperCase();

      if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
    } else if (p.length === 3) {
      p[0] = p[0].toLowerCase();

      // if lenght 2 guess it's a country
      if (p[1].length === 2) p[1] = p[1].toUpperCase();
      if (p[0] !== "sgn" && p[2].length === 2) p[2] = p[2].toUpperCase();

      if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
      if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
    }

    return p.join("-");
  }

  return code;
};

const languageUtils = {
  getScriptPartFromCode: (code) => {
    if (!code || code.indexOf("-") < 0) return null;

    const p = code.split("-");
    if (p.length === 2) return null;
    p.pop();
    return formatLanguageCode(p.join("-"));
  },

  getLanguagePartFromCode: (code) => {
    if (!code || code.indexOf("-") < 0) return code;

    const p = code.split("-");
    return formatLanguageCode(p[0]);
  },
};

export default languageUtils;

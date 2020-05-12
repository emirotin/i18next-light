(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['i18next-light'] = factory());
}(this, (function () { 'use strict';

  const consoleLogger = {
    name: "consoleLogger",
    log: (...args) => {
      typeof console !== "undefined" && console.log(...args);
    },
    warn: (...args) => {
      typeof console !== "undefined" && console.warn(...args);
    },
    error: (...args) => {
      typeof console !== "undefined" && console.error(...args);
    }
  };

  const Logger = (concreteLogger = consoleLogger, options = {}) => {
    let logger, prefix, _options, debug;

    const init = (concreteLogger, options) => {
      logger = concreteLogger || consoleLogger;
      _options = options || _options;
      prefix = _options.prefix || "i18next-light:";
      debug = _options.debug;
    };

    const setDebug = _debug => {
      debug = _debug;
    };

    const forward = (args, lvl, extraPrefix = "", debugOnly) => {
      if (debugOnly && !debug) {
        return;
      }

      args = [...args];

      if (typeof args[0] === "string") {
        args[0] = `${extraPrefix}${prefix} ${args[0]}`;
      }

      return logger[lvl](...args);
    };

    const log = (...args) => forward(args, "log", "", true);

    const warn = (...args) => forward(args, "warn", "", true);

    const error = (...args) => forward(args, "error", "");

    const deprecate = (...args) => forward(args, "warn", "WARNING DEPRECATED: ", true);

    const create = moduleName => Logger(logger, {
      prefix: `${prefix}:${moduleName}:`,
      ..._options
    });

    init(concreteLogger, options);
    return {
      init,
      setDebug,
      log,
      warn,
      error,
      deprecate,
      create
    };
  };

  var baseLogger = Logger();

  const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  const formatLanguageCode = code => {
    // http://www.iana.org/assignments/language-tags/language-tags.xhtml
    if (typeof code === "string" && code.indexOf("-") > -1) {
      const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let p = code.split("-");

      if (p.length === 2) {
        p[0] = p[0].toLowerCase();
        p[1] = p[1].toUpperCase();
        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
      } else if (p.length === 3) {
        p[0] = p[0].toLowerCase(); // if lenght 2 guess it's a country

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
    getScriptPartFromCode: code => {
      if (!code || code.indexOf("-") < 0) return null;
      const p = code.split("-");
      if (p.length === 2) return null;
      p.pop();
      return formatLanguageCode(p.join("-"));
    },
    getLanguagePartFromCode: code => {
      if (!code || code.indexOf("-") < 0) return code;
      const p = code.split("-");
      return formatLanguageCode(p[0]);
    }
  };

  // definition http://translate.sourceforge.net/wiki/l10n/pluralforms
  const sets = [{
    lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "ti", "tr", "uz", "wa"],
    nr: [1, 2],
    fc: 1
  }, {
    lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
    nr: [1, 2],
    fc: 2
  }, {
    lngs: ["ay", "bo", "cgg", "fa", "id", "ja", "jbo", "ka", "kk", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
    nr: [1],
    fc: 3
  }, {
    lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
    nr: [1, 2, 5],
    fc: 4
  }, {
    lngs: ["ar"],
    nr: [0, 1, 2, 3, 11, 100],
    fc: 5
  }, {
    lngs: ["cs", "sk"],
    nr: [1, 2, 5],
    fc: 6
  }, {
    lngs: ["csb", "pl"],
    nr: [1, 2, 5],
    fc: 7
  }, {
    lngs: ["cy"],
    nr: [1, 2, 3, 8],
    fc: 8
  }, {
    lngs: ["fr"],
    nr: [1, 2],
    fc: 9
  }, {
    lngs: ["ga"],
    nr: [1, 2, 3, 7, 11],
    fc: 10
  }, {
    lngs: ["gd"],
    nr: [1, 2, 3, 20],
    fc: 11
  }, {
    lngs: ["is"],
    nr: [1, 2],
    fc: 12
  }, {
    lngs: ["jv"],
    nr: [0, 1],
    fc: 13
  }, {
    lngs: ["kw"],
    nr: [1, 2, 3, 4],
    fc: 14
  }, {
    lngs: ["lt"],
    nr: [1, 2, 10],
    fc: 15
  }, {
    lngs: ["lv"],
    nr: [1, 2, 0],
    fc: 16
  }, {
    lngs: ["mk"],
    nr: [1, 2],
    fc: 17
  }, {
    lngs: ["mnk"],
    nr: [0, 1, 2],
    fc: 18
  }, {
    lngs: ["mt"],
    nr: [1, 2, 11, 20],
    fc: 19
  }, {
    lngs: ["or"],
    nr: [2, 1],
    fc: 2
  }, {
    lngs: ["ro"],
    nr: [1, 2, 20],
    fc: 20
  }, {
    lngs: ["sl"],
    nr: [5, 1, 2, 3],
    fc: 21
  }, {
    lngs: ["he"],
    nr: [1, 2, 20, 21],
    fc: 22
  }];
  const rulesPluralsTypes = {
    1: n => Number(n > 1),
    2: n => Number(n != 1),
    3: n => 0,
    4: n => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
    5: n => Number(n === 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5),
    6: n => Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2),
    7: n => Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
    8: n => Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3),
    9: n => Number(n >= 2),
    10: n => Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4),
    11: n => Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3),
    12: n => Number(n % 10 != 1 || n % 100 == 11),
    13: n => Number(n !== 0),
    14: n => Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3),
    15: n => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
    16: n => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2),
    17: n => Number(n == 1 || n % 10 == 1 ? 0 : 1),
    18: n => Number(n == 0 ? 0 : n == 1 ? 1 : 2),
    19: n => Number(n == 1 ? 0 : n === 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3),
    20: n => Number(n == 1 ? 0 : n === 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2),
    21: n => Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0),
    22: n => Number(n === 1 ? 0 : n === 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3)
  };
  const rules = sets.reduce((acc, set) => {
    Object.assign(acc, set.lngs.reduce((acc, l) => {
      acc[l] = {
        numbers: set.nr,
        plurals: rulesPluralsTypes[set.fc]
      };
      return acc;
    }, {}));
    return acc;
  }, {});

  const separator = "_";
  const logger = baseLogger.create("pluralResolver");

  const getRule = code => rules[code] || rules[languageUtils.getLanguagePartFromCode(code)];

  const getSuffix = (code, count) => {
    const rule = getRule(code);

    if (!rule) {
      logger.warn(`no plural rule found for: ${code}`);
      return "";
    }

    const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count)); // special treatment for lngs only having singular and plural

    if (rule.numbers.length === 2 && rule.numbers[0] === 1) {
      let suffix = rule.numbers[idx];

      if (suffix === 2) {
        suffix = "plural";
      } else if (suffix === 1) {
        suffix = "";
      }

      const suffixStr = suffix.toString();
      return suffixStr && separator + suffixStr;
    }

    const idxStr = idx.toString();
    return idxStr && separator + idxStr;
  };

  const pluralResolver = {
    getSuffix,
    needsPlural: code => {
      const rule = getRule(code);
      return rule && rule.numbers.length > 1;
    },
    getPluralFormsOfKey: (code, key) => {
      const rule = getRule(code);
      if (!rule) return [];
      return rule.numbers.map(n => {
        const suffix = getSuffix(code, n);
        return `${key}${suffix}`;
      });
    }
  };

  const contextSeparator = "_";

  const Translator = (interpolator, options = {}) => {
    const logger = baseLogger.create("translator");
    const topOptions = options;
    const resources = options.resources || {};

    const resolve = (keys, options = {}) => {
      if (typeof keys === "string") {
        keys = [keys];
      }

      const needsPluralHandling = options.count !== undefined && typeof options.count !== "string";
      const needsContextHandling = options.context !== undefined && typeof options.context === "string" && options.context !== "";
      const pluralSuffix = needsPluralHandling && pluralResolver.getSuffix(topOptions.lng, options.count);
      const contextSuffix = needsContextHandling && `${contextSeparator}${options.context}`;

      for (const key of keys) {
        const keyVariants = [needsPluralHandling && needsContextHandling && `${key}${contextSuffix}${pluralSuffix}`, needsContextHandling && `${key}${contextSuffix}`, needsPluralHandling && `${key}${pluralSuffix}`, key].filter(Boolean);

        for (const keyVariant of keyVariants) {
          const res = resources[keyVariant];

          if (res !== undefined) {
            return {
              res,
              usedKey: key,
              exactUsedKey: keyVariant
            };
          }
        }
      }
    };

    const exists = (key, options) => {
      const resolved = resolve(key, options);
      return resolved && resolved.res !== undefined || false;
    };

    const translate = (keys, options = {}) => {
      if (typeof options === "string") {
        options = {
          defaultValue: options
        };
      } // non valid keys handling


      if (keys == null) return "";
      if (!Array.isArray(keys)) keys = [String(keys)]; // resolve from store

      const resolved = resolve(keys, options);
      let res = resolved && resolved.res;
      const resType = Object.prototype.toString.apply(res);
      const noObject = ["[object Number]", "[object Function]", "[object RegExp]"]; // object

      const handleAsObject = typeof res !== "string" && typeof res !== "boolean" && typeof res !== "number";

      if (res && handleAsObject && noObject.indexOf(resType) < 0) {
        logger.warn("accessing an object");
        return `key '${keys[keys.length - 1]} (${topOptions.lng})' returned an object instead of string.`;
      } else {
        // string, empty or null
        let usedDefault = false;
        let usedKey = false; // fallback value

        if (res === undefined && options.defaultValue !== undefined) {
          usedDefault = true;

          if (options.count !== undefined) {
            const suffix = pluralResolver.getSuffix(topOptions.lng, options.count);
            res = options[`defaultValue${suffix}`];
          }

          if (!res) res = options.defaultValue;
        }

        if (res === undefined) {
          usedKey = true;
          res = keys[keys.length - 1];
        }

        if (usedKey || usedDefault) {
          logger.log("missingKey", topOptions.lng, keys[keys.length - 1], res);
        } // extend


        res = extendTranslation(res, options);
      } // return


      return res;
    };

    const extendTranslation = (res, options) => {
      let newRes = interpolator.interpolate(res, options, topOptions.lng, options);
      return interpolator.nest(newRes, (...args) => translate(...args), topOptions.lng, options);
    };

    return {
      exists,
      translate,
      resolve
    };
  };

  const makeString = object => object == null ? "" : `${object}`;

  const cleanKey = key => key && key.indexOf("###") > -1 ? key.replace(/###/g, ".") : key;

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
      k: cleanKey(stack.shift())
    };
  };

  const getPath = (object, path) => {
    const {
      obj,
      k
    } = getLastOfPath(object, path);
    if (!obj) return undefined;
    return obj[k];
  };
  const regexEscape = str =>
  /* eslint no-useless-escape: 0 */
  str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  };
  const escape = data => typeof data === "string" ? data.replace(/[&<>"'\/]/g, s => entityMap[s]) : data;

  const prefix = "{{";
  const suffix = "}}";
  const formatSeparator = ",";
  const unescapePrefix = "-";
  const unescapeSuffix = "";
  const nestingPrefix = regexEscape("$t(");
  const nestingSuffix = regexEscape(")");
  const nestingOptionsSeparator = ",";

  const regexSafe = val => val.replace(/\$/g, "$$$$");

  const Interpolator = (options = {}) => {
    const logger = baseLogger.create("interpolator");

    const format = options.interpolationFormat || (value => value);

    const maxReplaces = options.maxReplaces || 1000;
    let regexp, regexpUnescape, regexpNesting;

    const _resetRegExp = () => {
      regexp = new RegExp(`${prefix}(.+?)${suffix}`, "g");
      regexpUnescape = new RegExp(`${prefix}${unescapePrefix}(.+?)${unescapeSuffix}${suffix}`, "g");
      regexpNesting = new RegExp(`${nestingPrefix}(.+?)${nestingSuffix}`, "g");
    };

    _resetRegExp();

    const interpolate = (str, data, lng, options) => {
      const handleFormat = key => {
        if (key.indexOf(formatSeparator) < 0) {
          return getPath(data, key);
        }

        const p = key.split(formatSeparator);
        const k = p.shift().trim();
        const f = p.join(formatSeparator).trim();
        return format(getPath(data, k), f, lng, options);
      };

      _resetRegExp();

      let match;
      let replaces;
      replaces = 0; // unescape

      /* eslint no-cond-assign: 0 */

      while (match = regexpUnescape.exec(str)) {
        let value = handleFormat(match[1].trim());

        if (value === undefined) {
          logger.warn(`missed to pass in variable ${match[1]} for interpolating ${str}`);
          value = "";
        } else if (typeof value !== "string") {
          value = makeString(value);
        }

        str = str.replace(match[0], regexSafe(value));
        regexpUnescape.lastIndex = 0;
        replaces++;

        if (replaces >= maxReplaces) {
          break;
        }
      }

      replaces = 0; // regular escape on demand

      while (match = regexp.exec(str)) {
        let value = handleFormat(match[1].trim());

        if (value === undefined) {
          logger.warn(`missed to pass in variable ${match[1]} for interpolating ${str}`);
          value = "";
        } else if (typeof value !== "string") {
          value = makeString(value);
        }

        value = regexSafe(escape(value));
        str = str.replace(match[0], value);
        regexp.lastIndex = 0;
        replaces++;

        if (replaces >= maxReplaces) {
          break;
        }
      }

      return str;
    };

    const nest = (str, t, lng, options = {}) => {
      let match;
      let value;
      let clonedOptions = { ...options
      };
      delete clonedOptions.defaultValue; // assert we do not get a endless loop on interpolating defaultValue again and again
      // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"

      const handleHasOptions = (key, inheritedOptions) => {
        const sep = nestingOptionsSeparator;
        if (key.indexOf(sep) < 0) return key;
        const c = key.split(new RegExp(`${sep}[ ]*{`));
        let optionsString = `{${c[1]}`;
        key = c[0];
        optionsString = interpolate(optionsString, clonedOptions);
        optionsString = optionsString.replace(/'/g, '"');

        try {
          clonedOptions = JSON.parse(optionsString);
          if (inheritedOptions) clonedOptions = { ...inheritedOptions,
            ...clonedOptions
          };
        } catch (e) {
          logger.warn(`failed parsing options string in nesting for key ${key}`, e);
          return `${key}${sep}${optionsString}`;
        } // assert we do not get a endless loop on interpolating defaultValue again and again


        delete clonedOptions.defaultValue;
        return key;
      }; // regular escape on demand


      while (match = regexpNesting.exec(str)) {
        let formatters = [];
        /**
         * If there is more than one parameter (contains the format separator). E.g.:
         *   - t(a, b)
         *   - t(a, b, c)
         *
         * And those parameters are not dynamic values (parameters do not include curly braces). E.g.:
         *   - Not t(a, { "key": "{{variable}}" })
         *   - Not t(a, b, {"keyA": "valueA", "keyB": "valueB"})
         */

        let doReduce = false;

        if (match[0].includes(formatSeparator) && !/{.*}/.test(match[1])) {
          [match[1], ...formatters] = match[1].split(formatSeparator).map(elem => elem.trim());
          doReduce = true;
        }

        value = t(handleHasOptions(match[1].trim(), clonedOptions), clonedOptions); // is only the nesting key (key1 = '$(key2)') return the value without stringify

        if (value && match[0] === str && typeof value !== "string") return value; // no string to include or empty

        if (typeof value !== "string") value = makeString(value);

        if (!value) {
          logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
          value = "";
        }

        if (doReduce) {
          value = formatters.reduce((v, f) => format(v, f, lng, options), value.trim());
        } // Nested keys should not be escaped by default #854
        // value = regexSafe(utils.escape(value));


        str = str.replace(match[0], value); // TODO: was `regexp`
        // https://github.com/i18next/i18next/blob/master/src/Interpolator.js#L224

        regexpNesting.lastIndex = 0;
      }

      return str;
    };

    return {
      maxReplaces,
      interpolate,
      nest
    };
  };

  const defaults = {
    debug: false,
    resources: {},
    maxReplaces: 1000,
    interpolationFormat: (value, _format, _lng) => value,
    logger: undefined,
    logPrefix: undefined
  };
  const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam"];

  const I18n = (options = {}) => {
    options = { ...defaults,
      ...options
    };
    baseLogger.init(options.logger, {
      debug: options.debug,
      prefix: options.logPrefix
    });
    const logger = baseLogger;

    if (!options.lng) {
      logger.warn("init: no lng is defined");
    }

    const interpolator = Interpolator(options);
    const translator = Translator(interpolator, options);
    return {
      options,
      interpolator,
      translator,
      t: (...args) => translator.translate(...args),
      exists: (...args) => translator.exists(...args),
      dir: lng => !lng ? "rtl" : rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) >= 0 ? "rtl" : "ltr"
    };
  };

  return I18n;

})));

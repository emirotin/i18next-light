import baseLogger from "./logger.js";
import pluralResolver from "./PluralResolver.js";

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
    const needsContextHandling =
      options.context !== undefined && typeof options.context === "string" && options.context !== "";

    const pluralSuffix = needsPluralHandling && pluralResolver.getSuffix(topOptions.lng, options.count);
    const contextSuffix = needsContextHandling && `${contextSeparator}${options.context}`;

    for (const key of keys) {
      const keyVariants = [
        needsPluralHandling && needsContextHandling && `${key}${contextSuffix}${pluralSuffix}`,
        needsContextHandling && `${key}${contextSuffix}`,
        needsPluralHandling && `${key}${pluralSuffix}`,
        key,
      ].filter(Boolean);

      for (const keyVariant of keyVariants) {
        const res = resources[keyVariant];

        if (res !== undefined) {
          return { res, usedKey: key, exactUsedKey: keyVariant };
        }
      }
    }
  };

  const exists = (key, options) => {
    const resolved = resolve(key, options);
    return (resolved && resolved.res !== undefined) || false;
  };

  const translate = (keys, options = {}) => {
    if (typeof options === "string") {
      options = {
        defaultValue: options,
      };
    }

    // non valid keys handling
    if (keys == null) return "";
    if (!Array.isArray(keys)) keys = [String(keys)];

    // resolve from store
    const resolved = resolve(keys, options);
    let res = resolved && resolved.res;

    const resType = Object.prototype.toString.apply(res);
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];

    // object
    const handleAsObject = typeof res !== "string" && typeof res !== "boolean" && typeof res !== "number";
    if (res && handleAsObject && noObject.indexOf(resType) < 0) {
      logger.warn("accessing an object");
      return `key '${keys[keys.length - 1]} (${topOptions.lng})' returned an object instead of string.`;
    } else {
      // string, empty or null
      let usedDefault = false;
      let usedKey = false;

      // fallback value
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
      }

      // extend
      res = extendTranslation(res, options);
    }

    // return
    return res;
  };

  const extendTranslation = (res, options) => {
    let newRes = interpolator.interpolate(res, options, topOptions.lng, options);

    return interpolator.nest(newRes, (...args) => translate(...args), topOptions.lng, options);
  };

  return { exists, translate, resolve };
};

export default Translator;

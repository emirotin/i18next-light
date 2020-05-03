import baseLogger from './logger.js';

const contextSeparator = '_';

class Translator {
  constructor({ pluralResolver, interpolator }, options = {}) {
    this.pluralResolver = pluralResolver;
    this.interpolator = interpolator;

    this.options = options;

    this.logger = baseLogger.create('translator');
  }

  exists(key, options = { interpolation: {} }) {
    const resolved = this.resolve(key, options);
    return resolved && resolved.res !== undefined;
  }

  translate(keys, options) {
    if (typeof options === 'string') {
      options = {
        defaultValue: options,
      };
    } else if (!options) {
      options = {};
    }

    // non valid keys handling
    if (keys === undefined || keys === null /* || keys === ''*/) return '';
    if (!Array.isArray(keys)) keys = [String(keys)];

    const lng = this.options.lng;

    // resolve from store
    const resolved = this.resolve(keys, options);
    let res = resolved && resolved.res;
    const resUsedKey = (resolved && resolved.usedKey) || key;

    const resType = Object.prototype.toString.apply(res);
    const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];

    // object
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject =
      typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0) {
      this.logger.warn('accessing an object');
      return `key '${key} (${this.language})' returned an object instead of string.`;
    } else {
      // string, empty or null
      let usedDefault = false;
      let usedKey = false;

      // fallback value
      if (res === undefined && options.defaultValue !== undefined) {
        usedDefault = true;

        if (options.count !== undefined) {
          const suffix = this.pluralResolver.getSuffix(lng, options.count);
          res = options[`defaultValue${suffix}`];
        }
        if (!res) res = options.defaultValue;
      }
      if (res === undefined) {
        usedKey = true;
        res = key;
      }

      if (usedKey || usedDefault) {
        this.logger.log('missingKey', lng, key, res);
      }

      // extend
      res = this.extendTranslation(res, keys, options, resolved);
    }

    // return
    return res;
  }

  extendTranslation(res, _key, options, _resolved) {
    // i18next.parsing
    this.interpolator.reset();

    // interpolate
    let data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
    res = this.interpolator.interpolate(res, data, options.lng || this.language, options);

    // nesting
    if (options.nest !== false) {
      res = this.interpolator.nest(res, (...args) => this.translate(...args), options);
    }

    return res;
  }

  resolve(keys, options = {}) {
    if (typeof keys === 'string') {
      keys = [keys];
    }

    const needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
    const needsContextHandling =
      options.context !== undefined &&
      typeof options.context === 'string' &&
      options.context !== '';

    for (const key of keys) {
      const keyVariants = [key];

      const pluralSuffix =
        needsPluralHandling && this.pluralResolver.getSuffix(this.options.lng, options.count);

      let finalKey = key;
      // fallback for plural if context not found
      if (needsPluralHandling && needsContextHandling) {
        keyVariants.push(finalKey + pluralSuffix);
      }

      // get key for context if needed
      if (needsContextHandling) {
        finalKey += `${contextSeparator}${options.context}`;
        keyVariants.push(finalKey);
      }

      // get key for plural if needed
      if (needsPluralHandling) {
        keyVariants.push(finalKey + pluralSuffix);
      }

      for (const keyVariant of keyVariants.reverse()) {
        const res = this.resources[keyVariant];

        if (res !== undefined) {
          return { res, usedKey: key, exactUsedKey: keyVariant };
        }
      }
    }
  }
}

export default Translator;

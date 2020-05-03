import baseLogger from './logger.js';
import pluralResolver from './PluralResolver.js';
import Interpolator from './Interpolator.js';

const contextSeparator = '_';

class Translator {
  constructor(options = {}) {
    this.interpolator = new Interpolator(options);
    this.options = options;
    this.logger = baseLogger.create('translator');
  }

  exists(key, options) {
    const resolved = this.resolve(key, options);
    return resolved && resolved.res !== undefined;
  }

  translate(keys, options = {}) {
    if (typeof options === 'string') {
      options = {
        defaultValue: options,
      };
    }

    // non valid keys handling
    if (keys == null) return '';
    if (!Array.isArray(keys)) keys = [String(keys)];

    // resolve from store
    const resolved = this.resolve(keys, options);
    let res = resolved && resolved.res;

    const resType = Object.prototype.toString.apply(res);
    const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];

    // object
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject =
      typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0) {
      this.logger.warn('accessing an object');
      return `key '${key} (${this.options.lng})' returned an object instead of string.`;
    } else {
      // string, empty or null
      let usedDefault = false;
      let usedKey = false;

      // fallback value
      if (res === undefined && options.defaultValue !== undefined) {
        usedDefault = true;

        if (options.count !== undefined) {
          const suffix = pluralResolver.getSuffix(this.options.lng, options.count);
          res = options[`defaultValue${suffix}`];
        }
        if (!res) res = options.defaultValue;
      }
      if (res === undefined) {
        usedKey = true;
        res = key;
      }

      if (usedKey || usedDefault) {
        this.logger.log('missingKey', this.options.lng, key, res);
      }

      // extend
      res = this.extendTranslation(res, options);
    }

    // return
    return res;
  }

  extendTranslation(res, options) {
    let newRes = this.interpolator.interpolate(res, options, this.options.lng, options);

    return this.interpolator.nest(
      newRes,
      (...args) => this.translate(...args),
      this.options.lng,
      options,
    );
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
        needsPluralHandling && pluralResolver.getSuffix(this.options.lng, options.count);

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
        const res = this.options.resources[keyVariant];

        if (res !== undefined) {
          return { res, usedKey: key, exactUsedKey: keyVariant };
        }
      }
    }
  }
}

export default Translator;

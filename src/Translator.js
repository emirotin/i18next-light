import baseLogger from './logger.js';

const contextSeparator = '_';

class Translator {
  constructor({ pluralResolver, interpolator }, options = {}) {
    super();

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
    if (typeof options !== 'object' && this.options.overloadTranslationOptionHandler) {
      /* eslint prefer-rest-params: 0 */
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (!options) options = {};

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
    const joinArrays =
      options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;

    // object
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject =
      typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';
    if (
      handleAsObjectInI18nFormat &&
      res &&
      handleAsObject &&
      noObject.indexOf(resType) < 0 &&
      !(typeof joinArrays === 'string' && resType === '[object Array]')
    ) {
      if (!options.returnObjects && !this.options.returnObjects) {
        this.logger.warn('accessing an object - but returnObjects options is not enabled!');
        return this.options.returnedObjectHandler
          ? this.options.returnedObjectHandler(resUsedKey, res, options)
          : `key '${key} (${this.language})' returned an object instead of string.`;
      }
    } else if (
      handleAsObjectInI18nFormat &&
      typeof joinArrays === 'string' &&
      resType === '[object Array]'
    ) {
      // array special treatment
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options);
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

      // parseMissingKeyHandler
      if (usedKey && this.options.parseMissingKeyHandler)
        res = this.options.parseMissingKeyHandler(res);
    }

    // return
    return res;
  }

  extendTranslation(res, key, options, resolved) {
    // i18next.parsing
    if (options.interpolation) this.interpolator.init(options);

    // interpolate
    let data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
    if (this.options.interpolation.defaultVariables)
      data = { ...this.options.interpolation.defaultVariables, ...data };
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

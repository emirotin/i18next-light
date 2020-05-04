import * as utils from './utils.js';
import baseLogger from './logger.js';

const prefix = '{{';
const suffix = '}}';
const formatSeparator = ',';
const unescapePrefix = '-';
const unescapeSuffix = '';
const nestingPrefix = utils.regexEscape('$t(');
const nestingSuffix = utils.regexEscape(')');
const nestingOptionsSeparator = ',';

const regexSafe = val => val.replace(/\$/g, '$$$$');

const Interpolator = (options = {}) => {
  const logger = baseLogger.create('interpolator');

  const format = options.interpolationFormat || (value => value);
  const maxReplaces = options.maxReplaces || 1000;
  let regexp, regexpUnescape, regexpNesting;

  const _resetRegExp = () => {
    regexp = new RegExp(`${prefix}(.+?)${suffix}`, 'g');
    regexpUnescape = new RegExp(`${prefix}${unescapePrefix}(.+?)${unescapeSuffix}${suffix}`, 'g');
    regexpNesting = new RegExp(`${nestingPrefix}(.+?)${nestingSuffix}`, 'g');
  };

  _resetRegExp();

  const interpolate = (str, data, lng, options) => {
    const handleFormat = key => {
      if (key.indexOf(formatSeparator) < 0) {
        return utils.getPath(data, key);
      }

      const p = key.split(formatSeparator);
      const k = p.shift().trim();
      const f = p.join(formatSeparator).trim();

      return format(utils.getPath(data, k), f, lng, options);
    };

    _resetRegExp();

    let match;
    let replaces;

    replaces = 0;
    // unescape
    /* eslint no-cond-assign: 0 */
    while ((match = regexpUnescape.exec(str))) {
      let value = handleFormat(match[1].trim());
      if (value === undefined) {
        logger.warn(`missed to pass in variable ${match[1]} for interpolating ${str}`);
        value = '';
      } else if (typeof value !== 'string') {
        value = utils.makeString(value);
      }
      str = str.replace(match[0], regexSafe(value));
      regexpUnescape.lastIndex = 0;
      replaces++;
      if (replaces >= maxReplaces) {
        break;
      }
    }

    replaces = 0;
    // regular escape on demand
    while ((match = regexp.exec(str))) {
      let value = handleFormat(match[1].trim());
      if (value === undefined) {
        logger.warn(`missed to pass in variable ${match[1]} for interpolating ${str}`);
        value = '';
      } else if (typeof value !== 'string') {
        value = utils.makeString(value);
      }
      value = regexSafe(utils.escape(value));
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

    let clonedOptions = { ...options };
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

        if (inheritedOptions) clonedOptions = { ...inheritedOptions, ...clonedOptions };
      } catch (e) {
        logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }

      // assert we do not get a endless loop on interpolating defaultValue again and again
      delete clonedOptions.defaultValue;
      return key;
    };

    // regular escape on demand
    while ((match = regexpNesting.exec(str))) {
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

      value = t(handleHasOptions(match[1].trim(), clonedOptions), clonedOptions);

      // is only the nesting key (key1 = '$(key2)') return the value without stringify
      if (value && match[0] === str && typeof value !== 'string') return value;

      // no string to include or empty
      if (typeof value !== 'string') value = utils.makeString(value);
      if (!value) {
        logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = '';
      }

      if (doReduce) {
        value = formatters.reduce((v, f) => format(v, f, lng, options), value.trim());
      }

      // Nested keys should not be escaped by default #854
      // value = regexSafe(utils.escape(value));
      str = str.replace(match[0], value);
      // TODO: was `regexp`
      // https://github.com/i18next/i18next/blob/master/src/Interpolator.js#L224
      regexpNesting.lastIndex = 0;
    }
    return str;
  };

  return { interpolate, nest };
};

export default Interpolator;

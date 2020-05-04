(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.i18next = factory());
}(this, function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var consoleLogger = {
    log: function log() {
      var _console;

      console && (_console = console).log.apply(_console, arguments);
    },
    warn: function warn() {
      var _console2;

      console && (_console2 = console).warn.apply(_console2, arguments);
    },
    error: function error() {
      var _console3;

      console && (_console3 = console).error.apply(_console3, arguments);
    }
  };

  var Logger = function Logger() {
    var concreteLogger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : consoleLogger;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var logger, prefix, _options, debug;

    init(concreteLogger, options);

    var init = function init() {
      var concreteLogger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : consoleLogger;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      logger = concreteLogger;
      prefix = options.prefix || 'i18next:';
      _options = options;
      debug = options.debug;
    };

    var setDebug = function setDebug(bool) {
      debug = bool;
    };

    var forward = function forward(args, lvl, extraPrefix, debugOnly) {
      var _logger;

      if (debugOnly && !debug) return null;
      args = _toConsumableArray(args);
      if (typeof args[0] === 'string') args[0] = "".concat(extraPrefix).concat(prefix, " ").concat(args[0]);
      return (_logger = logger)[lvl].apply(_logger, _toConsumableArray(args));
    };

    var log = function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return forward(args, 'log', '', true);
    };

    var warn = function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return forward(args, 'warn', '', true);
    };

    var error = function error() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return forward(args, 'error', '');
    };

    var deprecate = function deprecate() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    };

    var create = function create(moduleName) {
      return Logger(logger, _objectSpread(_objectSpread({}, {
        prefix: "".concat(prefix, ":").concat(moduleName, ":")
      }), _options));
    };

    return {
      setDebug: setDebug,
      log: log,
      warn: warn,
      error: error,
      deprecate: deprecate,
      create: create
    };
  };

  var baseLogger = Logger();

  var capitalize = function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  var formatLanguageCode = function formatLanguageCode(code) {
    // http://www.iana.org/assignments/language-tags/language-tags.xhtml
    if (typeof code === 'string' && code.indexOf('-') > -1) {
      var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
      var p = code.split('-');

      if (p.length === 2) {
        p[0] = p[0].toLowerCase();
        p[1] = p[1].toUpperCase();
        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
      } else if (p.length === 3) {
        p[0] = p[0].toLowerCase(); // if lenght 2 guess it's a country

        if (p[1].length === 2) p[1] = p[1].toUpperCase();
        if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
      }

      return p.join('-');
    }

    return code;
  };

  var languageUtils = {
    getScriptPartFromCode: function getScriptPartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return null;
      var p = code.split('-');
      if (p.length === 2) return null;
      p.pop();
      return formatLanguageCode(p.join('-'));
    },
    getLanguagePartFromCode: function getLanguagePartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return code;
      var p = code.split('-');
      return formatLanguageCode(p[0]);
    }
  };

  // definition http://translate.sourceforge.net/wiki/l10n/pluralforms
  var sets = [{
    lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'ti', 'tr', 'uz', 'wa'],
    nr: [1, 2],
    fc: 1
  }, {
    lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
    nr: [1, 2],
    fc: 2
  }, {
    lngs: ['ay', 'bo', 'cgg', 'fa', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
    nr: [1],
    fc: 3
  }, {
    lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
    nr: [1, 2, 5],
    fc: 4
  }, {
    lngs: ['ar'],
    nr: [0, 1, 2, 3, 11, 100],
    fc: 5
  }, {
    lngs: ['cs', 'sk'],
    nr: [1, 2, 5],
    fc: 6
  }, {
    lngs: ['csb', 'pl'],
    nr: [1, 2, 5],
    fc: 7
  }, {
    lngs: ['cy'],
    nr: [1, 2, 3, 8],
    fc: 8
  }, {
    lngs: ['fr'],
    nr: [1, 2],
    fc: 9
  }, {
    lngs: ['ga'],
    nr: [1, 2, 3, 7, 11],
    fc: 10
  }, {
    lngs: ['gd'],
    nr: [1, 2, 3, 20],
    fc: 11
  }, {
    lngs: ['is'],
    nr: [1, 2],
    fc: 12
  }, {
    lngs: ['jv'],
    nr: [0, 1],
    fc: 13
  }, {
    lngs: ['kw'],
    nr: [1, 2, 3, 4],
    fc: 14
  }, {
    lngs: ['lt'],
    nr: [1, 2, 10],
    fc: 15
  }, {
    lngs: ['lv'],
    nr: [1, 2, 0],
    fc: 16
  }, {
    lngs: ['mk'],
    nr: [1, 2],
    fc: 17
  }, {
    lngs: ['mnk'],
    nr: [0, 1, 2],
    fc: 18
  }, {
    lngs: ['mt'],
    nr: [1, 2, 11, 20],
    fc: 19
  }, {
    lngs: ['or'],
    nr: [2, 1],
    fc: 2
  }, {
    lngs: ['ro'],
    nr: [1, 2, 20],
    fc: 20
  }, {
    lngs: ['sl'],
    nr: [5, 1, 2, 3],
    fc: 21
  }, {
    lngs: ['he'],
    nr: [1, 2, 20, 21],
    fc: 22
  }];
  var rulesPluralsTypes = {
    1: function _(n) {
      return Number(n > 1);
    },
    2: function _(n) {
      return Number(n != 1);
    },
    3: function _(n) {
      return 0;
    },
    4: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    5: function _(n) {
      return Number(n === 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
    },
    6: function _(n) {
      return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
    },
    7: function _(n) {
      return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    8: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
    },
    9: function _(n) {
      return Number(n >= 2);
    },
    10: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
    },
    11: function _(n) {
      return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
    },
    12: function _(n) {
      return Number(n % 10 != 1 || n % 100 == 11);
    },
    13: function _(n) {
      return Number(n !== 0);
    },
    14: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
    },
    15: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    16: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
    },
    17: function _(n) {
      return Number(n == 1 || n % 10 == 1 ? 0 : 1);
    },
    18: function _(n) {
      return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
    },
    19: function _(n) {
      return Number(n == 1 ? 0 : n === 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
    },
    20: function _(n) {
      return Number(n == 1 ? 0 : n === 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
    },
    21: function _(n) {
      return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
    },
    22: function _(n) {
      return Number(n === 1 ? 0 : n === 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
    }
  };
  var rules = sets.reduce(function (acc, set) {
    Object.assign(acc, set.lngs.reduce(function (acc, l) {
      acc[l] = {
        numbers: set.nr,
        plurals: rulesPluralsTypes[set.fc]
      };
      return acc;
    }, {}));
    return acc;
  }, {});

  var separator = '_';
  var logger = baseLogger.create('pluralResolver');

  var getRule = function getRule(code) {
    return rules[code] || rules[languageUtils.getLanguagePartFromCode(code)];
  };

  var getSuffix = function getSuffix(code, count) {
    var rule = getRule(code);

    if (!rule) {
      logger.warn("no plural rule found for: ".concat(code));
      return '';
    }

    var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count)); // special treatment for lngs only having singular and plural

    if (rule.numbers.length === 2 && rule.numbers[0] === 1) {
      var suffix = rule.numbers[idx];

      if (suffix === 2) {
        suffix = 'plural';
      } else if (suffix === 1) {
        suffix = '';
      }

      var suffixStr = suffix.toString();
      return suffixStr && separator + suffixStr;
    }

    var idxStr = idx.toString();
    return idxStr && separator + idxStr;
  };

  var pluralResolver = {
    needsPlural: function needsPlural(code) {
      var rule = getRule(code);
      return rule && rule.numbers.length > 1;
    },
    getPluralFormsOfKey: function getPluralFormsOfKey(code, key) {
      var rule = getRule(code);
      if (!rule) return [];
      return rule.numbers.map(function (n) {
        var suffix = getSuffix(code, n);
        return "".concat(key).concat(suffix);
      });
    }
  };

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }

  var makeString = function makeString(object) {
    return object == null ? '' : "".concat(object);
  };

  var cleanKey = function cleanKey(key) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  };

  var getLastOfPath = function getLastOfPath(object, path) {
    var canNotTraverseDeeper = function canNotTraverseDeeper() {
      return !object || typeof object === 'string';
    };

    var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

    while (stack.length > 1) {
      if (canNotTraverseDeeper()) return {};
      var key = cleanKey(stack.shift());
      object = object[key];
    }

    if (canNotTraverseDeeper()) return {};
    return {
      obj: object,
      k: cleanKey(stack.shift())
    };
  };

  var getPath = function getPath(object, path) {
    var _getLastOfPath = getLastOfPath(object, path),
        obj = _getLastOfPath.obj,
        k = _getLastOfPath.k;

    if (!obj) return undefined;
    return obj[k];
  };
  var regexEscape = function regexEscape(str) {
    return (
      /* eslint no-useless-escape: 0 */
      str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
    );
  };
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  var escape = function escape(data) {
    return typeof data === 'string' ? data.replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    }) : data;
  };

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var prefix = '{{';
  var suffix = '}}';
  var formatSeparator = ',';
  var unescapePrefix = '-';
  var unescapeSuffix = '';
  var nestingPrefix = regexEscape('$t(');
  var nestingSuffix = regexEscape(')');
  var nestingOptionsSeparator = ',';

  var regexSafe = function regexSafe(val) {
    return val.replace(/\$/g, '$$$$');
  };

  var Interpolator = function Interpolator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var logger = baseLogger.create('interpolator');

    var format = options.interpolationFormat || function (value) {
      return value;
    };

    var maxReplaces = options.maxReplaces || 1000;
    var regexp, regexpUnescape, regexpNesting;

    var _resetRegExp = function _resetRegExp() {
      regexp = new RegExp("".concat(prefix, "(.+?)").concat(suffix), 'g');
      regexpUnescape = new RegExp("".concat(prefix).concat(unescapePrefix, "(.+?)").concat(unescapeSuffix).concat(suffix), 'g');
      regexpNesting = new RegExp("".concat(nestingPrefix, "(.+?)").concat(nestingSuffix), 'g');
    };

    var interpolate = function interpolate(str, data, lng, options) {
      var handleFormat = function handleFormat(key) {
        if (key.indexOf(formatSeparator) < 0) {
          return getPath(data, key);
        }

        var p = key.split(formatSeparator);
        var k = p.shift().trim();
        var f = p.join(formatSeparator).trim();
        return format(getPath(data, k), f, lng, options);
      };

      _resetRegExp();

      var match;
      var replaces;
      replaces = 0; // unescape

      /* eslint no-cond-assign: 0 */

      while (match = regexpUnescape.exec(str)) {
        var value = handleFormat(match[1].trim());

        if (value === undefined) {
          logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
          value = '';
        } else if (typeof value !== 'string') {
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
        var _value = handleFormat(match[1].trim());

        if (_value === undefined) {
          logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
          _value = '';
        } else if (typeof _value !== 'string') {
          _value = makeString(_value);
        }

        _value = regexSafe(escape(_value));
        str = str.replace(match[0], _value);
        regexp.lastIndex = 0;
        replaces++;

        if (replaces >= maxReplaces) {
          break;
        }
      }

      return str;
    };

    var nest = function nest(str, t, lng) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var match;
      var value;

      var clonedOptions = _objectSpread$1({}, options);

      delete clonedOptions.defaultValue; // assert we do not get a endless loop on interpolating defaultValue again and again
      // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"

      var handleHasOptions = function handleHasOptions(key, inheritedOptions) {
        var sep = nestingOptionsSeparator;
        if (key.indexOf(sep) < 0) return key;
        var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
        var optionsString = "{".concat(c[1]);
        key = c[0];
        optionsString = interpolate(optionsString, clonedOptions);
        optionsString = optionsString.replace(/'/g, '"');

        try {
          clonedOptions = JSON.parse(optionsString);
          if (inheritedOptions) clonedOptions = _objectSpread$1(_objectSpread$1({}, inheritedOptions), clonedOptions);
        } catch (e) {
          logger.warn("failed parsing options string in nesting for key ".concat(key), e);
          return "".concat(key).concat(sep).concat(optionsString);
        } // assert we do not get a endless loop on interpolating defaultValue again and again


        delete clonedOptions.defaultValue;
        return key;
      }; // regular escape on demand


      while (match = regexpNesting.exec(str)) {
        var formatters = [];
        /**
         * If there is more than one parameter (contains the format separator). E.g.:
         *   - t(a, b)
         *   - t(a, b, c)
         *
         * And those parameters are not dynamic values (parameters do not include curly braces). E.g.:
         *   - Not t(a, { "key": "{{variable}}" })
         *   - Not t(a, b, {"keyA": "valueA", "keyB": "valueB"})
         */

        var doReduce = false;

        if (match[0].includes(formatSeparator) && !/{.*}/.test(match[1])) {
          var _match$1$split$map = match[1].split(formatSeparator).map(function (elem) {
            return elem.trim();
          });

          var _match$1$split$map2 = _toArray(_match$1$split$map);

          match[1] = _match$1$split$map2[0];
          formatters = _match$1$split$map2.slice(1);
          doReduce = true;
        }

        value = t(handleHasOptions(match[1].trim(), clonedOptions), clonedOptions); // is only the nesting key (key1 = '$(key2)') return the value without stringify

        if (value && match[0] === str && typeof value !== 'string') return value; // no string to include or empty

        if (typeof value !== 'string') value = makeString(value);

        if (!value) {
          logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
          value = '';
        }

        if (doReduce) {
          value = formatters.reduce(function (v, f) {
            return format(v, f, lng, options);
          }, value.trim());
        } // Nested keys should not be escaped by default #854
        // value = regexSafe(utils.escape(value));


        str = str.replace(match[0], value); // TODO: was `regexp`
        // https://github.com/i18next/i18next/blob/master/src/Interpolator.js#L224

        nestingRegexp.lastIndex = 0;
      }

      return str;
    };

    return {
      interpolate: interpolate,
      nest: nest
    };
  };

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray$1(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var contextSeparator = '_';

  var Translator = function Translator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var interpolator = new Interpolator(options);
    var logger = baseLogger.create('translator');
    var topOptions = options;

    var resolve = function resolve(keys) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof keys === 'string') {
        keys = [keys];
      }

      var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
      var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';

      var _iterator = _createForOfIteratorHelper(keys),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _key = _step.value;
          var keyVariants = [_key];
          var pluralSuffix = needsPluralHandling && pluralResolver.getSuffix(topOptions.lng, options.count);
          var finalKey = _key; // fallback for plural if context not found

          if (needsPluralHandling && needsContextHandling) {
            keyVariants.push(finalKey + pluralSuffix);
          } // get key for context if needed


          if (needsContextHandling) {
            finalKey += "".concat(contextSeparator).concat(options.context);
            keyVariants.push(finalKey);
          } // get key for plural if needed


          if (needsPluralHandling) {
            keyVariants.push(finalKey + pluralSuffix);
          }

          var _iterator2 = _createForOfIteratorHelper(keyVariants.reverse()),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var keyVariant = _step2.value;
              var res = topOptions.resources[keyVariant];

              if (res !== undefined) {
                return {
                  res: res,
                  usedKey: _key,
                  exactUsedKey: keyVariant
                };
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    var exists = function exists(key, options) {
      var resolved = resolve(key, options);
      return resolved && resolved.res !== undefined;
    };

    var translate = function translate(keys) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof options === 'string') {
        options = {
          defaultValue: options
        };
      } // non valid keys handling


      if (keys == null) return '';
      if (!Array.isArray(keys)) keys = [String(keys)]; // resolve from store

      var resolved = resolve(keys, options);
      var res = resolved && resolved.res;
      var resType = Object.prototype.toString.apply(res);
      var noObject = ['[object Number]', '[object Function]', '[object RegExp]']; // object

      var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

      if (res && handleAsObject && noObject.indexOf(resType) < 0) {
        logger.warn('accessing an object');
        return "key '".concat(key, " (").concat(topOptions.lng, ")' returned an object instead of string.");
      } else {
        // string, empty or null
        var usedDefault = false;
        var usedKey = false; // fallback value

        if (res === undefined && options.defaultValue !== undefined) {
          usedDefault = true;

          if (options.count !== undefined) {
            var suffix = pluralResolver.getSuffix(topOptions.lng, options.count);
            res = options["defaultValue".concat(suffix)];
          }

          if (!res) res = options.defaultValue;
        }

        if (res === undefined) {
          usedKey = true;
          res = key;
        }

        if (usedKey || usedDefault) {
          logger.log('missingKey', topOptions.lng, key, res);
        } // extend


        res = extendTranslation(res, options);
      } // return


      return res;
    };

    var extendTranslation = function extendTranslation(res, options) {
      var newRes = interpolator.interpolate(res, options, topOptions.lng, options);
      return interpolator.nest(newRes, function () {
        return translate.apply(void 0, arguments);
      }, topOptions.lng, options);
    };

    return {
      exists: exists,
      translate: translate,
      resolve: resolve
    };
  };

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var defaults = {
    debug: false,
    resources: {},
    maxReplaces: 1000,
    interpolationFormat: function interpolationFormat(value, _format, _lng, _options) {
      return value;
    },
    logger: null
  };
  var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];

  var I18n = function I18n() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    options = _objectSpread$2(_objectSpread$2({}, defaults), options);
    var logger = baseLogger;
    baseLogger.init(options.logger, options);

    if (!options.lng) {
      logger.warn('init: no lng is defined');
    }

    var translator = new Translator(options);
    return {
      t: function t() {
        return translator.translate.apply(translator, arguments);
      },
      exists: function exists() {
        return translator.exists.apply(translator, arguments);
      },
      dir: function dir(lng) {
        return !lng ? 'rtl' : rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
      }
    };
  };

  return I18n;

}));

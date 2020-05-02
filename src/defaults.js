export function get() {
  return {
    debug: false,

    partialBundledLanguages: false, // allow bundling certain languages that are not remotely fetched
    missingKeyHandler: false, // function(lng, ns, key, fallbackValue) -> override if prefer on handling
    missingInterpolationHandler: false, // function(str, match)

    returnNull: true, // allows null value as valid translation
    returnEmptyString: true, // allows empty string value as valid translation
    returnObjects: false,
    joinArrays: false, // or string to join array
    returnedObjectHandler: false, // function(key, value, options) triggered if key returns object but returnObjects is set to false
    parseMissingKeyHandler: false, // function(key) parsed a key that was not found in t() before returning
    overloadTranslationOptionHandler: function handle(args) {
      var ret = {};
      if (typeof args[1] === 'object') ret = args[1];
      if (typeof args[1] === 'string') ret.defaultValue = args[1];
      if (typeof args[2] === 'string') ret.tDescription = args[2];
      if (typeof args[2] === 'object' || typeof args[3] === 'object') {
        var options = args[3] || args[2];
        Object.keys(options).forEach(function(key) {
          ret[key] = options[key];
        });
      }
      return ret;
    },
    interpolation: {
      escapeValue: true,
      format: (value, format, lng, options) => value,
      // defaultVariables: undefined // object that can have values to interpolate on - extends passed in interpolation data
      maxReplaces: 1000, // max replaces to prevent endless loop
    },
  };
}

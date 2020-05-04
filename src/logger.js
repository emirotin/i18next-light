export const consoleLogger = {
  name: "consoleLogger",
  log: (...args) => {
    console && console.log(...args);
  },

  warn: (...args) => {
    console && console.warn(...args);
  },

  error: (...args) => {
    console && console.error(...args);
  },
};

const Logger = (concreteLogger = consoleLogger, options = {}) => {
  let logger, prefix, _options, debug;

  const init = (concreteLogger, options) => {
    logger = concreteLogger || consoleLogger;
    _options = options || _options;
    prefix = _options.prefix || "i18next-light:";
    debug = _options.debug;
  };

  const setDebug = (_debug) => {
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

  const create = (moduleName) =>
    Logger(logger, {
      prefix: `${prefix}:${moduleName}:`,
      ..._options,
    });

  init(concreteLogger, options);

  return { init, setDebug, log, warn, error, deprecate, create };
};

export default Logger();

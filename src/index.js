import baseLogger from './logger.js';

import Translator from './Translator.js';
import languageUtils from './LanguageUtils.js';

const defaults = {
  debug: false,
  resources: {},
  maxReplaces: 1000,
  interpolationFormat: (value, _format, _lng, _options) => value,
  logger: null,
};

const rtlLngs = [
  'ar',
  'shu',
  'sqr',
  'ssh',
  'xaa',
  'yhd',
  'yud',
  'aao',
  'abh',
  'abv',
  'acm',
  'acq',
  'acw',
  'acx',
  'acy',
  'adf',
  'ads',
  'aeb',
  'aec',
  'afb',
  'ajp',
  'apc',
  'apd',
  'arb',
  'arq',
  'ars',
  'ary',
  'arz',
  'auz',
  'avl',
  'ayh',
  'ayl',
  'ayn',
  'ayp',
  'bbz',
  'pga',
  'he',
  'iw',
  'ps',
  'pbt',
  'pbu',
  'pst',
  'prp',
  'prd',
  'ur',
  'ydd',
  'yds',
  'yih',
  'ji',
  'yi',
  'hbo',
  'men',
  'xmn',
  'fa',
  'jpr',
  'peo',
  'pes',
  'prs',
  'dv',
  'sam',
];

const I18n = (options = {}) => {
  options = { ...defaults, ...options };
  const logger = baseLogger;
  baseLogger.init(options.logger, options);

  if (!options.lng) {
    logger.warn('init: no lng is defined');
  }

  const translator = new Translator(options);

  return {
    t: (...args) => translator.translate(...args),
    exists: (...args) => translator.exists(...args),
    dir: lng =>
      !lng
        ? 'rtl'
        : rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) >= 0
        ? 'rtl'
        : 'ltr',
  };
};

export default I18n;

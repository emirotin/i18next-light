import baseLogger from './logger.js';

import Translator from './Translator.js';
import languageUtils from './LanguageUtils.js';
import Interpolator from './Interpolator.js';

import defaults from './defaults.js';

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

class I18n {
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.logger = baseLogger;

    if (!this.options.lng) {
      this.logger.warn('init: no lng is defined');
    }

    baseLogger.init(this.options.logger, this.options);

    this.translator = new Translator(this.options);
  }

  t(...args) {
    return this.translator.translate(...args);
  }

  exists(...args) {
    return this.translator.exists(...args);
  }

  dir(lng) {
    if (!lng) return 'rtl';

    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
  }
}

export default new I18n();

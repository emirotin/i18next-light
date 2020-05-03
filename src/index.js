import baseLogger from './logger.js';
import Translator from './Translator.js';
import LanguageUtils from './LanguageUtils.js';
import PluralResolver from './PluralResolver.js';
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
    this.services = {};
    this.logger = baseLogger;

    this.init();
  }

  init() {
    if (!this.options.lng) {
      this.logger.warn('init: no lng is defined');
    }

    // init services
    baseLogger.init(null, this.options);

    this.languageUtils = new LanguageUtils(this.options);

    const pluralResolver = new PluralResolver(this.languageUtils);
    const interpolator = new Interpolator(this.options);
    this.translator = new Translator({ pluralResolver, interpolator }, this.options);
  }

  t(...args) {
    return this.translator.translate(...args);
  }

  exists(...args) {
    return this.translator.exists(...args);
  }

  dir(lng) {
    if (!lng) return 'rtl';

    return rtlLngs.indexOf(this.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
  }
}

export default new I18n();

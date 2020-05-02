import baseLogger from './logger.js';
import Translator from './Translator.js';
import LanguageUtils from './LanguageUtils.js';
import PluralResolver from './PluralResolver.js';
import Interpolator from './Interpolator.js';
import { get as getDefaults } from './defaults.js';

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
    super();

    this.options = options;
    this.services = {};
    this.logger = baseLogger;
    this.modules = { external: [] };

    this.init(options, callback);
  }

  init(options = {}) {
    this.options = { ...getDefaults(), ...this.options, ...options };

    this.format = this.options.interpolation.format;

    function createClassOnDemand(ClassOrObject) {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === 'function') return new ClassOrObject();
      return ClassOrObject;
    }

    // init services
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }

      const lu = new LanguageUtils(this.options);

      const s = this.services;
      s.logger = baseLogger;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        compatibilityJSON: this.options.compatibilityJSON,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix,
      });
      s.interpolator = new Interpolator(this.options);

      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        s.languageDetector.init(s, this.options.detection, this.options);
      }

      this.translator = new Translator(this.services, this.options);

      this.modules.external.forEach(m => {
        if (m.init) m.init(this);
      });
    }

    if (!this.modules.languageDetector && !this.options.lng) {
      this.logger.warn('init: no languageDetector is used and no lng is defined');
    }
  }

  t(...args) {
    return this.translator.translate(...args);
  }

  exists(...args) {
    return this.translator.exists(...args);
  }

  dir(lng) {
    if (!lng) return 'rtl';

    return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0
      ? 'rtl'
      : 'ltr';
  }
}

export default new I18n();

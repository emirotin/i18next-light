import baseLogger from './logger.js';
import languageUtils from './LanguageUtils.js';

import { rules } from './PluralResolverData';

const separator = '_';

const logger = baseLogger.create('pluralResolver');

const getRule = code => rules[code] || rules[languageUtils.getLanguagePartFromCode(code)];

const getSuffix = (code, count) => {
  const rule = getRule(code);

  if (!rule) {
    logger.warn(`no plural rule found for: ${code}`);
    return '';
  }

  const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));

  // special treatment for lngs only having singular and plural
  if (rule.numbers.length === 2 && rule.numbers[0] === 1) {
    let suffix = rule.numbers[idx];

    if (suffix === 2) {
      suffix = 'plural';
    } else if (suffix === 1) {
      suffix = '';
    }

    const suffixStr = suffix.toString();
    return suffixStr && separator + suffixStr;
  }

  const idxStr = idx.toString();
  return idxStr && separator + idxStr;
};

const pluralResolver = {
  getSuffix,

  needsPlural: code => {
    const rule = getRule(code);
    return rule && rule.numbers.length > 1;
  },

  getPluralFormsOfKey: (code, key) => {
    const rule = getRule(code);

    if (!rule) return [];

    return rule.numbers.map(n => {
      const suffix = getSuffix(code, n);
      return `${key}${suffix}`;
    });
  },
};

export default pluralResolver;

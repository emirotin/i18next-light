import baseLogger from './logger.js';

import { sets, rulesPluralsTypes } from './PluralResolverData';

const rules = sets.reduce((acc, set) => {
  Object.assign(
    acc,
    set.lngs.reduce((acc, l) => {
      acc[l] = {
        numbers: set.nr,
        plurals: rulesPluralsTypes[set.fc],
      };
      return acc;
    }, {}),
  );
  return acc;
}, {});

const separator = '_';

class PluralResolver {
  constructor(languageUtils) {
    this.languageUtils = languageUtils;
    this.logger = baseLogger.create('pluralResolver');
  }

  getRule(code) {
    return rules[code] || rules[this.languageUtils.getLanguagePartFromCode(code)];
  }

  needsPlural(code) {
    const rule = this.getRule(code);

    return rule && rule.numbers.length > 1;
  }

  getPluralFormsOfKey(code, key) {
    const rule = this.getRule(code);

    if (!rule) return [];

    return rule.numbers.map(n => {
      const suffix = this.getSuffix(code, n);
      return `${key}${suffix}`;
    });
  }

  getSuffix(code, count) {
    const rule = this.getRule(code);

    if (!rule) {
      this.logger.warn(`no plural rule found for: ${code}`);
      return '';
    }

    // if (rule.numbers.length === 1) return ''; // only singular

    const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
    let suffix = rule.numbers[idx];

    // special treatment for lngs only having singular and plural
    if (rule.numbers.length === 2 && rule.numbers[0] === 1) {
      if (suffix === 2) {
        suffix = 'plural';
      } else if (suffix === 1) {
        suffix = '';
      }

      const suffixReturn = suffix.toString();
      return suffixReturn && separator + suffixReturn;
    }

    const idxReturn = idx.toString();
    return idxReturn && separator + idxReturn;
  }
}

export default PluralResolver;

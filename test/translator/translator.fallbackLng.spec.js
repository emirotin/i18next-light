import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() - fallback', () => {
    let t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            test: 'test_en',
            notInDE: 'test_notInDE_en',
          },
        },
        fr: {
          translation: {
            test: 'test_fr',
            notInDE: 'test_notInDE_fr',
          },
        },
        de: {
          translation: {
            test: 'test_de',
          },
        },
      });
      t = new Translator(
        {
          interpolator: new Interpolator(),
        },
        {
          interpolation: {
            interpolateResult: true,
            interpolateDefaultValue: true,
            interpolateKey: true,
          },
        },
      );
      t.changeLanguage('de');
    });

    const tests = [
      { args: ['translation:notInDE', {}], expected: 'test_notInDE_en' },
      { args: ['translation:notInDE', { fallbackLng: 'fr' }], expected: 'test_notInDE_fr' },
    ];

    tests.forEach(test => {
      it(`correctly translates for ${JSON.stringify(test.args)} args`, () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

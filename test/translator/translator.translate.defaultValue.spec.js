import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() defaultValue', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {},
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
      t.changeLanguage('en');
    });

    var tests = [
      { args: ['translation:test', { defaultValue: 'test_en' }], expected: 'test_en' },
      { args: ['translation:test', { defaultValue: 'test_en', count: 1 }], expected: 'test_en' },
      {
        args: [
          'translation:test',
          { defaultValue_plural: 'test_en_plural', defaultValue: 'test_en', count: 10 },
        ],
        expected: 'test_en_plural',
      },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});

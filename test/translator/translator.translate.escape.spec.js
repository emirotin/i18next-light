import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() un/escape', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            test: 'text {{var}}',
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
      t.changeLanguage('en');
    });

    var tests = [
      { args: ['translation:test', { var: 'a&b' }], expected: 'text a&amp;b' },
      {
        // todo; use different key
        args: ['translation:test', { var: 'a&b' }],
        expected: 'text a&b',
      },
      { args: ['translation:test', { var: ['a', 'b'] }], expected: 'text a,b' },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});

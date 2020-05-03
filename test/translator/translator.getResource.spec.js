import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('getResource()', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            test: 'test',
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
      { args: ['en', 'translation', 'test'], expected: 'test' },
      { args: ['de', 'translation', 'test'], expected: undefined },
    ];

    tests.forEach(test => {
      it('correctly gets resource for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.getResource.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});

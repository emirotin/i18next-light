import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() in cimode', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            test: 'test_en',
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
          resourceStore: rs,
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
      t.changeLanguage('cimode');
    });

    var tests = [
      {
        args: ['translation:test', {}],
        expected: 'test',
      },
      {
        args: ['test', {}],
        expected: 'test',
      },
      {
        args: ['translation:test', {}],
        expected: 'translation:test',
      },
      {
        args: ['test'],
        expected: 'translation:test',
      },
    ];

    tests.forEach(test => {
      it('correctly return key for ' + JSON.stringify(test.args) + ' args in cimode', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});

import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() separator usage', () => {
    var t;

    before(() => {
      const rs = new ResourceStore(
        {
          en: {
            translation: {
              test: 'test_en',
              deep: {
                test: 'testDeep_en',
              },
              'test::single': 'single_en',
              'test.single': 'single_en',
            },
            translation2: {
              test: 'test2_en',
            },
          },
        },
        {
          nsSeparator: ':::',
        },
      );
      t = new Translator(
        {
          interpolator: new Interpolator(),
        },
        {
          nsSeparator: ':::',
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
      { args: ['translation:::test'], expected: 'test_en' },
      { args: ['translation2:::test'], expected: 'test2_en' },
      { args: ['translation:::deep::test'], expected: 'testDeep_en' },
      { args: ['translation:test', { nsSeparator: ':' }], expected: 'test_en' },
      {
        args: ['translation2:test', { nsSeparator: ':' }],
        expected: 'test2_en',
      },
      {
        args: ['translation:deep.test', { nsSeparator: ':' }],
        expected: 'testDeep_en',
      },
      { args: ['translation:::test::single'], expected: 'single_en' },
      { args: ['translation:::test.single'], expected: 'single_en' },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});

import Translator from '../../src/Translator';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() defaultValue', () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: 'en',
      });
    });

    const tests = [
      { args: ['test', { defaultValue: 'test_en' }], expected: 'test_en' },
      { args: ['test', { defaultValue: 'test_en', count: 1 }], expected: 'test_en' },
      {
        args: [
          'test',
          { defaultValue_plural: 'test_en_plural', defaultValue: 'test_en', count: 10 },
        ],
        expected: 'test_en_plural',
      },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

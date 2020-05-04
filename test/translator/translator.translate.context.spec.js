import Translator from '../../src/Translator';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() with context', () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: 'en',
        resources: {
          test: 'test_en',
          test_male: 'test_male_en',
          test_female: 'test_female_en',
        },
      });
    });

    const tests = [
      { args: ['test', { context: 'unknown' }], expected: 'test_en' },
      { args: ['test', { context: 'male' }], expected: 'test_male_en' },
      { args: ['test', { context: 'female' }], expected: 'test_female_en' },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

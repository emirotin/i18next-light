import Translator from '../../src/Translator';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('exists()', () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        resources: {
          test: 'ok',
          'deep.test': 'ok',
        },
      });
    });

    const tests = [
      { args: ['test'], expected: true },
      { args: ['deep.test'], expected: true },
      { args: [['wrong', 'test']], expected: true },
      { args: ['wrong'], expected: false },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.exists(...test.args)).to.eql(test.expected);
      });
    });
  });
});

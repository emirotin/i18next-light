import Translator from '../../src/Translator';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() un/escape', () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: 'en',
        resources: {
          test: 'text {{var}}',
          testNoEscape: 'text {{- var}}',
        },
      });
    });

    const tests = [
      { args: ['test', { var: 'a&b' }], expected: 'text a&amp;b' },
      {
        args: ['testNoEscape', { var: 'a&b' }],
        expected: 'text a&b',
      },
      { args: ['test', { var: ['a', 'b'] }], expected: 'text a,b' },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

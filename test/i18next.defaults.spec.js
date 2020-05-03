import defaults from '../src/defaults';

describe('defaults', () => {
  it('it should have default format function', () => {
    expect(defaults.interpolationFormat('my value', '###', 'de')).to.equal('my value');
  });
});

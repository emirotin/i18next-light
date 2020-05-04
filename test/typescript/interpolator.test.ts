import i18next, { Interpolator } from 'i18next';

const i18n = i18next();

const interpolator: Interpolator = i18n.interpolator;

const nestReturn: string = interpolator.nest('', () => undefined, '', {});

const interpolateReturn: string = interpolator.interpolate('', {}, '', {});

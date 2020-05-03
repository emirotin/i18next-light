import i18next, { Interpolator } from 'i18next';

const interpolator: Interpolator = i18next.services.interpolator;

const nestReturn: string = interpolator.nest('', () => undefined, {});

const interpolateReturn: string = interpolator.interpolate('', {}, '', {});

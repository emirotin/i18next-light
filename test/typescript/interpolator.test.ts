import i18next, { Interpolator } from "i18next";

const i18n = i18next();

const interpolator: Interpolator = i18n.interpolator;

const _nestReturn: string = interpolator.nest("", () => undefined, "", {});

const _interpolateReturn: string = interpolator.interpolate("", {}, "", {});

/** Exercise exposed types/imports for different tsconfig esmoduleinterop settings */

/* esModuleInterop: true, allowSyntheticDefaultImports: true */
import i18next, { Translator, Interpolator } from 'i18next';

const i18n = i18next();

const _translator: Translator = i18n.translator;
const _interpolator: Interpolator = i18n.interpolator;

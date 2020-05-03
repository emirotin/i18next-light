# Differences

Different API:

`const i18n = I18n({ ... })`

No backend, no multiple languages, no namespaces, no fancy resources loading: only accepts plain mapping `key => i18n string`. Handles keys resolution for plurals and context though.

No save/update missing keys

Key separator — unused, only one level of keys is handled.
Interpolation — always `{{}}`
Plural/context separator — always `_`.
Nesting — always `$t()`
Format separator — always `,`

No special CI mode handling.

`lng` is only used for the plural detection

`simplifyPluralSuffix` is always `true`

No whitelist

returnNull && returnEmptyString always true, returnObjects, joinArrays — always false
returnedObjectHandler unused

No missingInterpolationHandler, missingKeyHandler, parseMissingKeyHandler

overloadTranslationOptionHandler unused, options must be an object (if passed at all), or a string (defaultValue)

Only format v3 is supported

escapeValue unused, use `{{- var }}` for unescaped translations

defaultVariables unused, handle your vars in the userland

options.interpolation.maxReplaces => options.maxReplaces (and not overridable by the `t` options)

options.interpolation.format => options.interpolationFormat (and not overridable by the `t` options)

useRawValueToEscape, lowerCaseLng unused

New option: custom logger

replace — unused, pass data inside of options

# i18next: learn once - translate everywhere [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Awesome%20i18next:%20learn%20once%20-%20translate%20everywhere%20-%20the%20internationalization%20ecosystem%20&url=https://github.com/i18next/i18next&via=jamuhl&hashtags=i18n,javascript,dev)

[![CircleCI](https://circleci.com/gh/i18next/i18next.svg?style=svg)](https://circleci.com/gh/i18next/i18next)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/i18next/i18next)
[![Package Quality](http://npm.packagequality.com/shield/i18next.svg)](http://packagequality.com/#?package=i18next)
[![cdnjs version](https://img.shields.io/cdnjs/v/i18next.svg?style=flat-square)](https://cdnjs.com/libraries/i18next)
[![npm version](https://img.shields.io/npm/v/i18next.svg?style=flat-square)](https://www.npmjs.com/package/i18next)
[![David](https://img.shields.io/david/i18next/i18next.svg?style=flat-square)](https://david-dm.org/i18next/i18next)

i18next is a very popular internationalization framework for browser or any other javascript environment (eg. node.js).

![ecosystem](https://raw.githubusercontent.com/i18next/i18next/master/assets/i18next-ecosystem.jpg)

i18next provides:

- Flexible connection to [backend](https://www.i18next.com/plugins-and-utils.html#backends) (loading translations via xhr, ...)
- Optional [caching](https://www.i18next.com/plugins-and-utils.html#caches), user [language detection](https://www.i18next.com/plugins-and-utils.html#language-detector), ...
- Proper [pluralizations](https://www.i18next.com/plurals.html)
- Translation [context](https://www.i18next.com/context.html)
- [Nesting](https://www.i18next.com/nesting.html), [Variable replacement](https://www.i18next.com/interpolation.html)
- Flexibility: [Use it everywhere](https://www.i18next.com/supported-frameworks.html)
- Extensibility: eg. [sprintf](https://www.i18next.com/plugins-and-utils.html#post-processors)
- ...

For more information visit the website:

- [Getting started](https://www.i18next.com/getting-started.html)
- [Translation Functionality](https://www.i18next.com/essentials.html)
- [API](https://www.i18next.com/api.html)

Our focus is providing the core to building a booming ecosystem. Independent of the building blocks you choose, be it react, angular or even good old jquery proper translation capabilities are just [one step away](https://www.i18next.com/supported-frameworks.html).

---

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>

---

**From the creators of i18next: localization as a service - locize.com**

A translation management system built around the i18next ecosystem - [locize.com](https://locize.com).

![locize](https://locize.com/img/ads/github_locize.png)

With using [locize](http://locize.com/?utm_source=i18next_readme&utm_medium=github) you directly support the future of i18next.

---

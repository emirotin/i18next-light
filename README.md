# `i18next-light`: a lightweight companion for `i18next`

[![CircleCI](https://circleci.com/gh/emirotin/i18next-light.svg?style=svg)](https://circleci.com/gh/emirotin/i18next-light)

> `i18next-light` is a simplified and _much smaller_ version of `i18next` intended for the client-usage when you already have the prepackaged i18n strings.

```bash
npm install --save i18next-light
```

or

```bash
yarn add i18next-light
```

---

**Table of Contents:**

<!-- toc -->

- [Motivation](#motivation)
- [What can `i18next-light` do](#what-can-i18next-light-do)
  - [What's the use of i18n with a single language?](#whats-the-use-of-i18n-with-a-single-language)
  - [Will multi-language be implemented in the future?](#will-multi-language-be-implemented-in-the-future)
  - [Will there be namespaces implementation in the future?](#will-there-be-namespaces-implementation-in-the-future)
  - [Will there be more features added/returned?](#will-there-be-more-features-addedreturned)
- [How was this implemented](#how-was-this-implemented)
  - [And what's the difference in size?](#and-whats-the-difference-in-size)
- [API](#api)
  - [Initialize the instance](#initialize-the-instance)
    - [Load the library](#load-the-library)
    - [Create the instance](#create-the-instance)
    - [Options](#options)
  - [Instance properties and methods](#instance-properties-and-methods)
  - [Translation function (`i18n.t`)](#translation-function-i18nt)
  - [Key existence function (`i18n.exists`)](#key-existence-function-i18nexists)
  - [Custom formatting function](#custom-formatting-function)
  - [Custom logger contract](#custom-logger-contract)
- [Browsers support](#browsers-support)
- [Differences from the original `i18next`](#differences-from-the-original-i18next)

<!-- tocstop -->

---

## Motivation

[`i18next`](https://github.com/i18next/i18next) is a powerful tool that nicely handles many aspects of i18n: it handles namepsaces, multiple languages with fallbacks, interpolation, pluralization, nested translations, missing tanslations handling, etc.

Unfortunately, it's not modular (as of the moment of `i18next-light` inception) and the bundled project has the significant size (~44KiB minified but not gzipped).

I had a use-case where my website is mostly static and needs i18n support (build-time) while also having some dynamic parts that also need access to the translated strings with interpolation.

So I was happy to use `i18next` at build time but wasn't happy carying it over to the JS bundle let alone bundling all the i18n strings JSON where a single page may need 5 % or at most 10 % of them.

So this project was created — a much simpler and lighter (~8 KiB minified but not gzipped) library responsible for the following tasks only:

- find the strings ("resources") in the provided hash (_single language only_),
- handle intrerpolation with formatting,
- handle pluralization and context,
- handle nested translations.

## What can `i18next-light` do

It can:

- find the strings ("resources") by key in the provided hash (_single language only_),
- handle [intrerpolation](https://www.i18next.com/translation-function/interpolation) with [formatting](https://www.i18next.com/translation-function/formatting),
- handle [pluralization](https://www.i18next.com/translation-function/plurals) and [context](https://www.i18next.com/translation-function/context)-specific translations,
- handle [nested translations](https://www.i18next.com/translation-function/nesting).

### What's the use of i18n with a single language?

This is one scenario, for example.

I have a mostly static website built using the static site generator. At build time using the same templates I procude language-specific pages using the full `i18next` library power.

I also need _some_ i18n strings available client-side, really few compared to the total number of resources (like 2-5 per page while we have a total of hundreds of resources).

I determine all such strings at build time and put them into a global object injected into my page before any other JS:

```html
<script>
  window.__I18N__ = {
    "apples-guilty": "I've eaten 1 apple out of {{total}}",
    "apples-guilty_plural": "I've eaten {{count}} apples out of {{total}}",
  };
</script>
<script src="/main.js"></script>
<script src="/my-page.js"></script>
```

Then in my scripts I can initialize the `i18n` object and use it:

```javascript
const i18n = i18next({ lng: "en", resources: window.__I18N__ });
console.log(
  i18n.t("apples-guilty", {
    count: 7,
    total: 7,
  })
);
```

This way my JS is universal and language-agnostic, and only my HTML pages are different per language.

This works great with reactive soultions as well as you can directly use `t` in your render code or provide it as a filter. For example, you can have proper pluralization with React by keeping the `count` in the component's state and using `t` in the render method. Or use svelte's `$` blocks to make the computed string based on the `count` variable.

### Will multi-language be implemented in the future?

It may happen because I can imagine how this library can be useful in multi-language client-side scenario. At the same time there's no guarantees as I don't need this right now and I want to keep the size minimal possible. If you have a good use-case please open an issue for discussion.

### Will there be namespaces implementation in the future?

I don't think so. So far I see how namespaces work good when the same resources are shared across multiple projects (I have such a use-case) but merging the namespaces is trivial (using `reduce`, for example) and can be handled in the userland.

### Will there be more features added/returned?

Very unlikely. The sole purpose of this project is to nicely handle interpolation and pluralization on the provided set of resources. But if you have a really good use-case for another feature please open an issue for discussion.

## How was this implemented

I've first stripped all the functionality that I decided to drop (backend support, custom configuration options, namespaces, multilanguage, etc.) and simplified the code by dropping the ever-false conditions.

I have then rewritten the rest from classes to singleton objects (where no config nor state were left) and object factories.

Then, I've improved the Babel transpilation by providing the `browserslist` config to avoid transpiling things that are natively supported by the modern browsers.

I've removed the tests specific to the removed functionality and kept _all the rest_. The majority of them were left without changes, those where the functionality was changed — adapted and updated. At the time of creation there are _207 test-cases_ in this project.

I've also added Node.js testing in addition to the browser testing used in the original project (with Chrome/karma).

I've also removed the ES module transpilation, the original source code is the ES entry point and can be used by the bundlers that support the `module` declaration in `package.json`. The transpiled CommonJS version is still available form the `dist` folder and is `require`d by the runtimes (like Node.js) that use the `main` field. The UMD version is also available as `i18next-light.js` and `i18next-light.min.js` files in the root folder of the project.

### And what's the difference in size?

The `.min.js` file in the original project is `44KiB`, the similar file in this project is around `8KiB`.

It may not be a huge difference if your bundle is already over 1MiB (which may be something to worry about in the first place) but for me it resulted in 2x bundle reduction for some pages, for example.

## API

The API is similar to the original project but simpler because of the reduced scope. Please remember this **is not a drop-in replacement** for the original library but it's deliberately similar to it.

### Initialize the instance

#### Load the library

Using ES6 import:

```javascript
import i18next from "i18next-light";
```

Using CommonJS:

```javascript
const i18next = require("i18next-light");
```

Or loading the UMD build in your browser:

```html
<script src="/vendor/i18next-light.min.js"></script>
<script>
  const i18next = window["i18next-light"];
</script>
```

#### Create the instance

```javascript
const i18n = i18next({
  lng: "en",
  resources: {
    key: "string",
    // ...
  },
  // ...
});
```

#### Options

The factory method `i18next` accepts a single configuration parameter that can have the following options:

| Option                | Required | Type       | Default                | Description                                                                                                                                  |
| --------------------- | -------- | ---------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `lng`                 | Y        | `string`   | `undefined`            | The language of the resources, used to properly determine plural forms if they're used, also passed to the formatting function if it's used. |
| `resources`           | Y        | `object`   | `{}`                   | The plain object (string key to string value mapping) defining the keys correspondance to the resources (translation strings).               |
| `debug`               | N        | `boolean`  | `false`                | When `true` causes the additional warnings printed to the console.                                                                           |
| `maxReplaces`         | N        | `number`   | `1000`                 | The max number of nested translation replaces, needed to prevent the potential infinite loops. Most likely you don't need to change it.      |
| `interpolationFormat` | N        | `function` | `value => value`       | The custom formatting function. See below for the contract description.                                                                      |
| `logger`              | N        | `object`   | `console`-based logger | A custom logger can be provided for handling the debug warnings. See below for the contract description.                                     |
| `logPrefix`           | N        | `string`   | `"i18next-light:"`     | The string that is prepended to the first log argument (if it's also a string).                                                              |

### Instance properties and methods

The instance returned from the `i18next` factory has the following properties and methods:

| Property       | Type       | Description                                                                                                                                                                                          |
| -------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `t`            | `function` | The main method, the translation function, see below.                                                                                                                                                |
| `exists`       | `function` | The method that checks if there's a translation for the given key or a specific variant of it (taking into account pluralization/context). The arguments are similar to the `t` function, see below. |
| `dir`          | `function` | given the key code (like `"en"` or `"ru-RU"`) returns `"rtl"` or `"ltr"` depending on the language read direction.                                                                                   |
| `options`      | `object`   | The options object merged from the defaults and the initialization options.                                                                                                                          |
| `interpolator` | `object`   | The internal interpolator instance, see the [source code](https://github.com/emirotin/i18next-light/blob/master/src/Interpolator.js) if you need to use it directly.                                 |
| `translator`   | `object`   | The internal translator instance, see the [source code](https://github.com/emirotin/i18next-light/blob/master/src/Translator.js) if you need to use it directly.                                     |

### Translation function (`i18n.t`)

The core functionality of this library is the translation functon.

It has several call options:

```javascript
i18n.exists('key')
i18n.exists(['key1', 'key2', ...])
i18n.exists(['key1', 'key2', ...], { x: 1, y: 2 })
i18n.exists(['key1', 'key2', ...], { count: 1, context: 'boy' })
i18n.exists(['key1', 'key2', ...], 'default value')
i18n.exists(['key1', 'key2', ...], { x: 1, y: 2, count: 1, context: 'boy',defaultValue: 'default value' })
```

The first argument is a string (a key) or an array of strings (multiple keys, checked in order against the resources map until a match is found).

The second argument can be a string which would be used if no match is found.

Or the second argument can be an _options object_. The _options object_ can contain any values for [interpolation](https://www.i18next.com/translation-function/interpolation) as well as two special values: `count` is used to determine the specific [pluralized](https://www.i18next.com/translation-function/plurals) key (if it exists), and `context` is used to pick the [context-specific](https://www.i18next.com/translation-function/context) key (if it exists).

For each key the following forms are checked in order:

- with _context_ and with _plural_ (if `context` is provided and `count` are provided and the value of `count` requires the pluralized form for the provided `lng`),
- with _context_ only (if `context` is provided),
- with _plural_ only (if `count` is provided and the value of `count` requires the pluralized form for the provided `lng`),
- the key itself.

If no matching key is found and the default value is provided (as the 2nd string argument or as a `defaultValue` option) it will be returned, otherwise the last key is returned as the translation (and a warning is printed).

See the [original documentation](https://www.i18next.com/translation-function/essentials) for more details, it applies except for the following topics:

- this library does not allow special handling for arrays and objects as translation results,
- deep resources object and the dot-separated deep keys are not handled, each key is a string and the resource at that key must be a string.

### Key existence function (`i18n.exists`)

The function is similar to the `t` function and can be called like this:

```javascript
i18n.exists('key')
i18n.exists(['key1', 'key2', ...])
i18n.exists(['key1', 'key2', ...], { count: 1, context: 'boy' })
```

Options other thn `count` and `context` have no effect.

### Custom formatting function

Just like the original project this library supports [formatting](https://www.i18next.com/translation-function/formatting) for the interpolated arguments.

The signature of this function is `(value: any, format: string, lng: string) => string`.

Given the example

```javascript
const i18n = i18next({
  lng: "en",
  resources: {
    key1: "The current date is {{date, MM/DD/YYYY}}",
    key2: "{{text, uppercase}} just uppercased",
  },
  interpolationFormat: myFormatFunction,
});

i18n.t("key1", { date: new Date() });
i18n.t("key2", { text: "hello" });
```

The `myFormatFunction` will be called:

- for `key1` with the arguments `(new Date(), 'MM/DD/YYYY', 'en')`,
- for `key2` with the arguments `('hello', 'uppercase', 'en')`,

An example implementation of the formatting function could be:

```javascript
const myFormatFunction = (value, format, lng) => {
  if (format === "uppercase") {
    return value.toUpperCase();
  }
  if (value instanceof Date) {
    return moment(value).format(format);
  }
  if (typeof value === "number" && lng === "ru") {
    return russianNumberFormatting(value);
  }
  return "" + value;
};
```

### Custom logger contract

The custom logger is a simple object that must implement the 3 methods: `log`, `warn`, `error`. Each method should handle variable number of arguments.

Example `console`-based logger implementation:

```javascript
const consoleLogger = {
  name: "consoleLogger",
  log: (...args) => {
    typeof console !== "undefined" && console.log(...args);
  },

  warn: (...args) => {
    typeof console !== "undefined" && console.warn(...args);
  },

  error: (...args) => {
    typeof console !== "undefined" && console.error(...args);
  },
};
```

## Browsers support

This project is built with the following `browserslist` configuration:

```
"defaults",
"> 2%",
"not dead"
```

This allows for many ES6 features to be used natiely, like arrow functions, splats, etc.

If you have any specific use-case of a non-dead browser not handling this library properly please raise an issue.

## Differences from the original `i18next`

This library has the following differences compared to the original `i18next` project:

- the initialization API is different, you pass the options to the factory method rather than using the `.init` call: `const i18n = i18next({ ... })`,
- there's no support for various backend implementations, you pass the `resources` as a plain object directly to the factory function,
- it does not support multiple languages, you determine the language-specific resources to be passed to it in your code (see the use-case above), as a result it also has no support for fallback language, languages array, `changeLanguage` methods, whitelists, etc.,
- it does not support namespaces, you need to merge your resources yourself before providing them,
- it does not support saving the missing keys (because it has no backend), it will just report them in the `debug` mode,
- it also does not have the special handling for the CI case, just provide an empty `resources` object there and you will get the keys as translations,
- it always does plural suffix simplification — when like in English there are only two forms the keys checked are `key_plural` and `key` (otherwise the numeric suffixes are used, see [the original docs](https://www.i18next.com/translation-function/plurals#languages-with-multiple-plurals)),
- it has no special handling for arrays and ojects as translation results,
- it allows resources to be empty strings or `null`, which is also treated as an empty string,
- it has no support for the legacy formats (for interpolation and the like),
- it doesn't support `defaultVariables`, if you need them merge your `t` options in your code,
- nested keys (`key1.key2` as in `{ resources: { key1: { key2: 'translation here; } } }`) are not supported, flatten your resources before passing to the library,
- `t` option `replace` is not used, pass the interpolation data directly in the `options` object as the 2nd arguement of `t`: `t('key', { count: 1, total: 7 })`,
- `t` options do not override anything passed when initialing the `i18n` object, like formatting function,
- `options.interpolation.maxReplaces => options.maxReplaces`,
- `options.interpolation.format => options.interpolationFormat`,
- only the default syntax is supported: interpolation is `{{var}}`, formatting is always `{{var, format}}`, nesting is always `$t()`, plural and context separator — always `_`,
- reduced the browsers support to `> 2 %, not dead`.

---

Author: Eugene Mirotin <emirotin@gmail.com>

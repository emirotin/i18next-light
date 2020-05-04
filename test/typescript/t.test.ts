import { TFunction } from "i18next";

function _basicUsage(t: TFunction): void {
  t("friend");
  t`friend`;
  t(["friend", "tree"]);
  t("friend", { myVar: "someValue" });
  t(["friend", "tree"], { myVar: "someValue" });
}

function _overloadedUsage(t: TFunction): void {
  t("friend", "test {{myVar}}");
  t(["friend", "tree"], "test {{myVar}}");
}

function _returnCasts(t: TFunction): void {
  const _s: string = t("friend"); // same as <string>
  const _s2: string = t`friend`;
}

function _defautValue(t: TFunction): void {
  t("translation:test", { defaultValue: "test_en" });
  t("translation:test", { defaultValue: "test_en", count: 1 });
  t("translation:test", {
    defaultValue_plural: "test_en_plural",
    defaultValue: "test_en",
    count: 10,
  });

  // string (only) default value as second arg
  //  https://www.i18next.com/translation-function/essentials#passing-a-default-value
  //  https://github.com/i18next/i18next/blob/master/src/Translator.js#L66
  t("translation:test", "test_en");
}

function _callsMethodWithOptionalNullArg(t: TFunction): void {
  function displayHint(hint?: string | null): string {
    return String(hint);
  }
  displayHint(t("friend"));
}

function _callsMethodWithOptionalArg(t: TFunction): void {
  function displayHint(hint?: string): string {
    return String(hint);
  }
  displayHint(t("friend"));
}

function _callsMethodWithRequiredNullArg(t: TFunction): void {
  function displayHint(hint: string | null): string {
    return String(hint);
  }
  displayHint(t("friend"));
}

function _callsMethodWithRequiredArg(t: TFunction): void {
  function displayHint(hint: string): string {
    return String(hint);
  }
  displayHint(t("friend"));
}

function _arrayKey(t: TFunction): void {
  const error404 = "404";
  t([`error.${error404}`, "error.unspecific"]); // -> "The page was not found"

  const error502 = "502";
  t([`error.${error502}`, "error.unspecific"]); // -> "Something went wrong"
}

function _stringKey(t: TFunction): void {
  t("No one says a key can not be the fallback.");
  // -> "Niemand sagt ein key kann nicht als Ersatz dienen."

  t("This will be shown if the current loaded translations to not have this.");
  // -> "This will be shown if the current loaded translations to not have this."
}

function _interpolation(t: TFunction): void {
  // key = 'hello {{what}}'
  t("key", { what: "WORLD" }); // -> hello WORLD

  t("key", { what: "i18next", how: "great" });

  const author = {
    name: "Jan",
    github: "jamuhl",
  };
  t("key", { author });

  t("keyEscaped", { myVar: "<img />" });
  // -> "no danger &lt;img &#x2F;&gt;"

  t("keyUnescaped", { myVar: "<img />" });
  // -> "dangerous <img />"

  t("keyEscaped", {
    myVar: "<img />",
  });
  // -> "no danger <img />" (obviously could be dangerous)

  t("key", { count: 0 }); // -> "items"
  t("key", { count: 1 }); // -> "item"
  t("key", { count: 5 }); // -> "items"
  t("key", { count: 100 }); // -> "items"
  t("keyWithCount", { count: 0 }); // -> "0 items"
  t("keyWithCount", { count: 1 }); // -> "1 item"
  t("keyWithCount", { count: 5 }); // -> "5 items"
  t("keyWithCount", { count: 100 }); // -> "100 items"

  // not matching into a range it will fallback to
  // the regular plural form
  t("friend", { context: "male", count: 1 }); // -> "A boyfriend"
  t("friend", { context: "female", count: 100 }); // -> "100 girlfriends"
  t("tree", { something: "gold" });
  // -> { res: 'added gold' }

  t("array", {});
  // -> ['a', 'b', 'c']

  t("arrayOfObjects.0.name");
  // -> "tom"
}

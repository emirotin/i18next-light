import i18next from "../src/index.js";

describe("i18next", () => {
  describe("instance creation", () => {
    const i18n = i18next({
      foo: "bar",
      lng: "en",
      debug: false,
    });

    expect(i18n.options.foo).to.eql("bar");
  });
});

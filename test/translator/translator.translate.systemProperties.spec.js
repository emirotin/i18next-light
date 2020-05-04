import Translator from "../../src/Translator";
import Interpolator from "../../src/Interpolator";

// These tests orignated from issues:
//
// https://github.com/i18next/i18next/issues/906
// https://github.com/i18next/i18next-xhr-backend/issues/258
//
// should ignore non-string properties when finding 'deep' translations
// (ex: `.length`, `.search`)
// when a fallback is needed to find the actual definition of that property

describe("Translator", () => {
  describe("translate()", () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        resources: {
          test: "test_en",
          "test.length": "test_length",
          "test.search": "test_search",
        },
      });
    });

    const tests = [
      { args: ["test"], expected: "test_en" },
      { args: ["test.length"], expected: "test_length" },
      { args: ["test.search"], expected: "test_search" },
    ];

    tests.forEach((test) => {
      it("correctly translates for " + JSON.stringify(test.args) + " args", () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

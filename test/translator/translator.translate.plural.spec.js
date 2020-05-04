import Translator from "../../src/Translator";
import Interpolator from "../../src/Interpolator";

describe("Translator", () => {
  describe("translate() with plural: en", () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: "en",
        resources: {
          test: "test_en",
          test_plural: "tests_en",
        },
      });
    });

    const tests = [
      { args: ["test", { count: 1 }], expected: "test_en" },
      { args: ["test", { count: 2 }], expected: "tests_en" },
    ];

    tests.forEach((test) => {
      it("correctly translates for " + JSON.stringify(test.args) + " args", () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });

  describe("translate() with plural: de", () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: "de",
        resources: {
          test: "test_de",
          test_plural: "tests_de",
        },
      });
    });

    const tests = [
      { args: ["test", { count: 1 }], expected: "test_de" },
      { args: ["test", { count: 2 }], expected: "tests_de" },
    ];

    tests.forEach((test) => {
      it("correctly translates for " + JSON.stringify(test.args) + " args", () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });

  describe("translate() with plural: ja", () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: "ja",
        resources: {
          test: "test_ja",
          test_0: "tests_ja",
        },
      });
    });

    const tests = [
      { args: ["test", { count: 1 }], expected: "tests_ja" },
      { args: ["test", { count: 2 }], expected: "tests_ja" },
      { args: ["test", { count: 10 }], expected: "tests_ja" },
    ];

    tests.forEach((test) => {
      it("correctly translates for " + JSON.stringify(test.args) + " args", () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

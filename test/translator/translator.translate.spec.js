import Translator from "../../src/Translator";
import Interpolator from "../../src/Interpolator";

describe("Translator", () => {
  describe("translate()", () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: "en",
        resources: {
          test: "test_en",
          "deep.test": "deep_en",
        },
      });
    });

    const tests = [
      { args: ["test"], expected: "test_en" },
      { args: ["deep.test"], expected: "deep_en" },
    ];

    tests.forEach((test) => {
      it("correctly translates for " + JSON.stringify(test.args) + " args", () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

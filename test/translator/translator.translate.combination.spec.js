import Translator from "../../src/Translator";
import Interpolator from "../../src/Interpolator";

describe("Translator", () => {
  describe("translate() with combined functionality", () => {
    let t;

    before(() => {
      t = Translator(Interpolator(), {
        lng: "en",
        resources: {
          key1: "hello world",
          key2: "It is: $t(key1)",
          key3: "It is: {{val}}",

          // context with pluralization
          test: "test_en",
          test_plural: "tests_en",
          test_male: "test_male_en",
          test_male_plural: "tests_male_en",

          "nest.nest": "x $t(nestedVar) y",
          nestedVar: "_nestedVar_",
        },
      });
    });

    const tests = [
      // interpolation and nesting in var
      { args: ["key2"], expected: "It is: hello world" },
      { args: ["key3", { val: "$t(key1)" }], expected: "It is: hello world" },

      // context with pluralization
      { args: ["test", { context: "unknown", count: 1 }], expected: "test_en" },
      { args: ["test", { context: "unknown", count: 2 }], expected: "tests_en" },
      { args: ["test", { context: "male", count: 1 }], expected: "test_male_en" },
      { args: ["test", { context: "male", count: 2 }], expected: "tests_male_en" },
      {
        args: ["nest.nest"],
        expected: "x _nestedVar_ y",
      },

      // interpolation and nesting on defaultValue
      {
        args: ["noKeyFoundTestingDefault_1", { defaultValue: "{{val}} bar", val: "$t(foo)" }],
        expected: "foo bar",
      },
    ];

    tests.forEach((test) => {
      it("correctly translates for " + JSON.stringify(test.args) + " args", () => {
        expect(t.translate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

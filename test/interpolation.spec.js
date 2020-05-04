import Interpolator from "../src/Interpolator";
import logger from "../src/logger";

describe("Interpolator", () => {
  describe("interpolate()", () => {
    let ip;

    before(() => {
      ip = Interpolator({});
    });

    const tests = [
      { args: ["test", { test: "123" }], expected: "test" },
      { args: ["test {{test}}", { test: "123" }], expected: "test 123" },
      {
        args: ["test {{test}} a {{bit.more}}", { test: "123", bit: { more: "456" } }],
        expected: "test 123 a 456",
      },
      { args: ["test {{ test }}", { test: "123" }], expected: "test 123" },
      { args: ["test {{ test }}", { test: null }], expected: "test " },
      { args: ["test {{ test }}", { test: undefined }], expected: "test " },
      { args: ["test {{ test }}", {}], expected: "test " },
      { args: ["test {{test.deep}}", { test: { deep: "123" } }], expected: "test 123" },
    ];

    tests.forEach((test) => {
      it("correctly interpolates for " + JSON.stringify(test.args) + " args", () => {
        expect(ip.interpolate(...test.args)).to.eql(test.expected);
      });
    });
  });

  describe("interpolate() - options", () => {
    const tests = [
      {
        options: {},
        expected: {},
      },
      {
        description: "uses maxReplaces if provided",
        options: { maxReplaces: 100 },
        expected: { maxReplaces: 100 },
      },
    ];

    tests.forEach((test) => {
      describe(test.description || "when called with " + JSON.stringify(test.options), () => {
        let ip;

        before(() => {
          ip = Interpolator(test.options);
        });

        Object.keys(test.expected).forEach((key) => {
          it(key + " is set correctly", () => {
            expect(ip[key]).to.eql(test.expected[key]);
          });
        });
      });
    });
  });

  describe("interpolate() - with formatter", () => {
    let ip;

    before(() => {
      ip = Interpolator({
        interpolationFormat: (value, format, _lng) => {
          if (format === "uppercase") return value.toUpperCase();
          if (format === "lowercase") return value.toLowerCase();
          if (format === "throw") throw new Error("Formatter error");
          return value;
        },
      });
    });

    const tests = [
      { args: ["test {{test, uppercase}}", { test: "up" }], expected: "test UP" },
      { args: ["test {{test, lowercase}}", { test: "DOWN" }], expected: "test down" },
    ];

    tests.forEach((test) => {
      it("correctly interpolates for " + JSON.stringify(test.args) + " args", () => {
        expect(ip.interpolate(...test.args)).to.eql(test.expected);
      });
    });

    it("correctly manage exception in formatter", () => {
      expect(() => {
        ip.interpolate("test {{test, throw}}", { test: "up" });
      }).to.throw(Error, "Formatter error");
    });
  });

  describe("interpolate() - unescape", () => {
    let ip;

    before(() => {
      ip = Interpolator({});
    });

    const tests = [
      {
        args: ["test {{test}}", { test: "<a>foo</a>" }],
        expected: "test &lt;a&gt;foo&lt;&#x2F;a&gt;",
      },
      {
        args: ["test {{test.deep}}", { test: { deep: "<a>foo</a>" } }],
        expected: "test &lt;a&gt;foo&lt;&#x2F;a&gt;",
      },
      {
        args: ["test {{- test.deep}}", { test: { deep: "<a>foo</a>" } }],
        expected: "test <a>foo</a>",
      },
      {
        args: [
          "test {{- test}} {{- test2}} {{- test3}}",
          { test: " ", test2: "<span>test2</span>", test3: "<span>test3</span>" },
        ],
        expected: "test   <span>test2</span> <span>test3</span>",
      },
      {
        args: ["test {{- test}}", {}],
        expected: "test ",
      },
      {
        args: ["test {{- test}}", { test: null }],
        expected: "test ",
      },
    ];

    tests.forEach((test) => {
      it("correctly interpolates for " + JSON.stringify(test.args) + " args", () => {
        expect(ip.interpolate(...test.args)).to.eql(test.expected);
      });
    });
  });

  describe("interpolate() - nesting", () => {
    let ip;

    before(() => {
      ip = Interpolator({});
    });

    const tests = [
      {
        args: ["test $t(test)", () => "success"],
        expected: "test success",
      },
      {
        args: ['$t(test, {"key": "success"})', (key, opts) => "test " + opts.key],
        expected: "test success",
      },
      {
        args: ["$t(test, {'key': 'success'})", (key, opts) => "test " + opts.key],
        expected: "test success",
      },
      {
        args: ['$t(test, is, {"key": "success"})', (key, opts) => "test, is " + opts.key],
        expected: "test, is success",
      },
      {
        args: ["$t(test, is, ok)", () => "test, is, ok"],
        expected: "test, is, ok",
      },
    ];

    tests.forEach((test) => {
      it("correctly nests for " + JSON.stringify(test.args) + " args", () => {
        expect(ip.nest(...test.args)).to.eql(test.expected);
      });
    });
  });

  describe("interpolate() - max replaced to prevent endless loop", () => {
    let ip;

    before(() => {
      ip = Interpolator({
        maxReplaces: 10,
      });
    });

    const tests = [
      {
        args: ["test {{test}}", { test: "tested {{test}}" }],
        expected: "test tested tested tested tested tested tested tested tested tested tested {{test}}",
      },
    ];

    tests.forEach((test) => {
      it("correctly interpolates for " + JSON.stringify(test.args) + " args", () => {
        expect(ip.interpolate(...test.args)).to.eql(test.expected);
      });
    });
  });

  describe("interpolate() - with undefined interpolation value", () => {
    let logs = [];

    let ip;

    before(() => {
      logger.init(
        {
          name: "mockLogger",
          log: (...args) => {
            logs.push({
              type: "log",
              args,
            });
          },
          warn: (...args) => {
            logs.push({
              type: "warn",
              args,
            });
            return "WARN";
          },
          error: (...args) => {
            logs.push({
              type: "error",
              args,
            });
          },
        },
        { debug: true }
      );

      ip = Interpolator({});
    });

    beforeEach(() => {
      logs = [];
    });

    after(() => {
      logger.init(undefined, { debug: false });
    });

    const tests = [
      {
        args: ["{{test}}"],
        expected: "",
        warning: "missed to pass in variable test for interpolating {{test}}",
      },
    ];

    tests.forEach((test) => {
      logs = [];
      it("correctly handles missing interpolation for " + JSON.stringify(test.args) + " args", () => {
        expect(ip.interpolate(...test.args)).to.eql(test.expected);

        expect(logs).to.contain({
          type: "warn",
          args: ["i18next::interpolator: " + test.warning],
        });
      });
    });
  });

  describe("interpolate() - with null interpolation value", () => {
    let ip;

    before(() => {
      ip = Interpolator({});
    });

    const tests = [{ args: ["{{test}}", { test: null }], expected: "" }];

    tests.forEach((test) => {
      it("correctly interpolates for " + JSON.stringify(test.args) + " args", () => {
        expect(ip.interpolate(...test.args)).to.eql(test.expected);
      });
    });
  });
});

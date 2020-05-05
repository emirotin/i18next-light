const path = require("path");

module.exports = (karma) => {
  karma.set({
    frameworks: ["mocha", "chai", "sinon"],

    files: [
      // tests
      { pattern: "test/**/*.spec.js", type: "module" },
      // files tests rely on
      { pattern: "src/**/*.js", type: "module", included: false },
    ],

    reporters: ["spec"],

    browsers: ["ChromeHeadless"],

    singleRun: true,
  });
};

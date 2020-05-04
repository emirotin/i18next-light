module.exports = (karma) => {
  karma.set({
    frameworks: ["mocha", "chai", "sinon", "browserify"],

    files: ["test/**/*.spec.js"],

    reporters: ["coverage", "spec"],

    preprocessors: {
      "test/**/*.spec.js": ["browserify"],
      "src/**/*.js": ["browserify", "coverage"],
    },

    browsers: ["HeadlessChrome"],
    customLaunchers: {
      HeadlessChrome: {
        base: "ChromeHeadless",
        flags: ["—no-sandbox"],
      },
    },

    port: 9876,

    //logLevel: 'LOG_DEBUG',

    //singleRun: true,
    //autoWatch: false,
    //
    // client: {
    //   mocha: {
    //     reporter: 'spec', // change Karma's debug.html to the mocha web reporter
    //     ui: 'tdd'
    //   }
    // },

    // browserify configuration
    browserify: {
      debug: true,
      transform: [["babelify", { presets: ["@babel/preset-env"] }], /*'brfs',*/ "browserify-istanbul"],
    },

    coverageReporter: {
      type: "lcov", //'html', // disabled - erroring now, https://github.com/karma-runner/karma-coverage/issues/157
      dir: "coverage/",
    },
  });
};

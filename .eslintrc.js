module.exports = {
  parser: "babel-eslint",
  extends: ["prettier"],
  plugins: ["prettier"],

  globals: {
    expect: true,
    describe: true,
    it: true,
    before: true,
    after: true,
    window: true,
  },

  settings: {
    eslint: {
      packageManager: "yarn",
    },
  },
};

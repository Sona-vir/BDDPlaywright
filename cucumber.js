// Cucumber's configuration loads TypeScript support code and writes the HTML report.
module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["hooks/**/*.ts", "step-definitions/**/*.ts"],
    paths: ["features/**/*.feature"],
    format: ["progress", "html:reports/cucumber-report.html"],
  },
};

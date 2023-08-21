const fs = require("fs-extra");

const jestStareDir = "./jest-stare";
const resultsDir = "./.results";

async function copyFiles() {
  try {
    await fs.copy(`${jestStareDir}/index.html`, `${resultsDir}/results.html`);
    await fs.copy(
      `${jestStareDir}/jest-results.json`,
      `${resultsDir}/results.json`
    );
    await fs.copy(`${jestStareDir}/js`, `${resultsDir}/js`);
    await fs.remove(jestStareDir);
  } catch (err) {
    console.error(err);
  }
}

copyFiles();

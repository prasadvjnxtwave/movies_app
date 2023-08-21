import fsExtra from "fs-extra";

import { getAllFiles } from "./file_utils.mjs";
import replace from "replace-in-file";

export const regexTmpFolder = "regex-tmp";

export const appendEachTestFileWithTestEnumPrefix = async (
  eachProjectConfig
) => {
  return new Promise(async (resolve) => {
    const codingXTestCasesFilePath = `${eachProjectConfig.projectPath}/src/__tests__`;
    await fsExtra.copy(codingXTestCasesFilePath, regexTmpFolder);
    const files = getAllFiles(regexTmpFolder);
    let testCounter = 0;
    let suiteCounter = 0;

    for (const eachTestFile of files) {
      // files.forEach(async (eachTestFile) => {
      const testsReplaceOptions = {
        files: eachTestFile,
        from: /it\('/g,
        to: () => {
          testCounter = testCounter + 1;
          return `it(':::${eachProjectConfig.sessionUniqueKey}_TEST_${testCounter}:::`;
        },
      };
      let itRegexResults;
      try {
        itRegexResults = await replace(testsReplaceOptions);
      } catch (error) {
        console.error("Error occurred While replacing it syntax:", error);
      }
      try {
        if (testCounter !== itRegexResults.length - 1 + testCounter) {
          throw new Error("Error while replacing it syntax");
        }
      } catch (error) {
        console.error(error);
      }
      let describeRegexResults;
      const describeReplaceOptions = {
        files: eachTestFile,
        from: /describe\('/g,
        to: () => {
          suiteCounter = suiteCounter + 1;
          return `describe(':::${eachProjectConfig.sessionUniqueKey}_TEST_SUITE_${suiteCounter}:::`;
        },
      };
      try {
        describeRegexResults = await replace(describeReplaceOptions);
      } catch (error) {
        console.error("Error occurred While replacing describe syntax:", error);
      }
      try {
        if (suiteCounter !== describeRegexResults.length - 1 + suiteCounter) {
          throw new Error("Error while replacing describe syntax");
        }
      } catch (error) {
        console.error(error);
      }
    }
    console.log("----> 3.1 INFO: SUCCESSFULLY UPDATED All Tests with Enums");
    resolve();
  });
};

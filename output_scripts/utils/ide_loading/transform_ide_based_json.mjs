import fsExtra from "fs-extra";
import { codingXConfig } from "../../coding_x_config.mjs";
import { courseConstants } from "./constants.mjs";
import {
  regexTmpFolder,
} from "./regex_match_replace_utils.mjs";


export const appendTestEnumDisplayTextWeightageToIdeBasedJson = async (
  eachProjectConfig
) => {
  return new Promise(async (resolve) => {
    const codingXTestCasesFilePath = `${regexTmpFolder}`;
    const ideBasedCodingJSONPath = `${eachProjectConfig.projectPath}/ide_based_coding.json`;
    const files = await fsExtra.readdir(codingXTestCasesFilePath);

    const ideBasedJSON = await fsExtra.readFile(ideBasedCodingJSONPath);
    const parsedIdeBasedJSON = JSON.parse(ideBasedJSON);
    parsedIdeBasedJSON[0].test_cases = [];

    const appendToPreviousTestCases = (newTestCases) => {
      parsedIdeBasedJSON[0].test_cases = [
        ...parsedIdeBasedJSON[0].test_cases,
        ...newTestCases,
      ];
    };

    for (const element of files) {
      const eachElementPath = `${codingXTestCasesFilePath}/${element}`;
      let newTestCases = await splitEachTestAndReturnListWithEnumDisplayTextWeightage(
        eachElementPath
      );
      appendToPreviousTestCases(newTestCases);
    }

    let stringifiedIdeBasedJSON = JSON.stringify(parsedIdeBasedJSON, null, 2);
    await fsExtra.writeFileSync(
      ideBasedCodingJSONPath,
      stringifiedIdeBasedJSON
    );

    console.log(
      "----> 3.2: INFO: SUCCESSFULLY UPDATED IDE BASED JSON With All Test files TestEnum, DisplayText, Weightage"
    );
    resolve();
  });
};

const splitEachTestAndReturnListWithEnumDisplayTextWeightage = async (
  testCasesFilePath
) => {
  //read file and create test objects and push to array

  return new Promise(async (resolve) => {
    const data = await fsExtra.readFile(testCasesFilePath);
    const tests = [];
    let fileContent = data.toString();
    let a = fileContent.split(":::");
    let i = 1;
    while (i < a.length) {
      if (a[i].includes("_TEST_")) {
        if (!a[i].includes("_SUITE")) {
          let testObject = {
            test_case_enum: a[i],
            display_text: a[i + 1],
            weightage: parseInt(a[i + 2]),
          };
          tests.push(testObject);
        } else {
          i = i - 2;
        }
        i = i + 4;
      } else {
        console.log(
          "There is some mistake in writing test description: ",
          a[i]
        );
        break;
      }
    }
    resolve(tests);
  });
};

const stringifyReadmeFileAndAppendQuestionText = async (
  sourcePath,
  destinationPath,
  cleanUpCallback
) => {
  return new Promise(async (resolve) => {
    try {
      const sourceFileContent = await fsExtra.readFile(sourcePath);
      const destinationFileContent = await fsExtra.readFile(destinationPath);
      const stringifiedFileContent = sourceFileContent.toString();
      const parsedDestinationContent = JSON.parse(destinationFileContent);
      parsedDestinationContent[0].question_text = stringifiedFileContent;
      const stringifiedDestination = JSON.stringify(
        parsedDestinationContent,
        null,
        2
      );
      await fsExtra.writeFile(destinationPath, stringifiedDestination, "utf8");
      console.log(
        "----> 3.3 INFO: SUCCESSFULLY UPDATED Question text IDE BASED JSON"
      );
    } catch (e) {
      console.log("stringifyReadmeFileAndAppendQuestionText", e);
    }
    resolve();
  });
};

export const appendQuestionTextToIdeBasedJson = async (eachProjectConfig) => {
  return new Promise(async (resolve) => {
    const codingXTestCasesFilePath = `${eachProjectConfig.projectPath}/README.md`;
    const ideBasedCodingJSONPath = `${eachProjectConfig.projectPath}/ide_based_coding.json`;

    await stringifyReadmeFileAndAppendQuestionText(
      codingXTestCasesFilePath,
      ideBasedCodingJSONPath
    );
    resolve();
  });
};

// const forOnlyCPProjects = async () => {
//   for (const eachConfig in courseSpecificCodingXConfig) {
//     if (courseSpecificCodingXConfig[eachConfig].type === codingXConstants.cp) {
//       await appendEachTestFileWithTestEnumPrefix(
//         courseSpecificCodingXConfig[eachConfig]
//       );
//       await appendTestEnumDisplayTextWeightageToIdeBasedJson(
//         courseSpecificCodingXConfig[eachConfig]
//       );
//       await appendQuestionTextToIdeBasedJson(
//         courseSpecificCodingXConfig[eachConfig]
//       );
//     }
//   }
// };

// forOnlyCPProjects();

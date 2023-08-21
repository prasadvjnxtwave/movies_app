import AdmZip from "adm-zip";
import fsExtra from "fs-extra";

import {
  appendEachTestFileWithTestEnumPrefix,
  regexTmpFolder,
} from "./regex_match_replace_utils.mjs";
import {
  appendTestEnumDisplayTextWeightageToIdeBasedJson,
  appendQuestionTextToIdeBasedJson,
} from "./transform_ide_based_json.mjs";

import { codingXConfig } from "../../coding_x_config.mjs";
import { courseConstants, codingXConstants } from "./constants.mjs";

const courseInput = courseConstants.react;

/* REACT_JS */

const courseName = courseInput;
const reactjsCodingXConfig = codingXConfig[courseInput];
const reactJScodingXLoadingZipDestinationPath = "../../zip_outputs";

/* END */

const copyToTmpOnlyNecessaryFoldersAndFiles = async (
  sourceFolderRootPath,
  destinationPath
) => {
  const options = {
    filter: function (path) {
      const excludeFoldersForFinalList = [
        `node_modules`,
        `ide_based_coding.json`,
        "jest-stare",
        "coverage",
        "build",
        "yarn.lock",
        "cypress",
        ".results",
        ".vscode",
      ];
      const toBeFiltered = excludeFoldersForFinalList.filter((element) => {
        return path.indexOf(element) > -1;
      });
      return toBeFiltered.length === 0;
    },
  };

  try {
    await fsExtra.copy(
      sourceFolderRootPath,
      `${destinationPath}/tmp/`,
      options
    );
  } catch (err) {
    console.error(err);
  }
};

const updatePackageJSONForTestReporter = async (
  inputPackageJSONPath,
  outputPackageJSONPath
) => {
  try {
    const packageJSONFileContent = await fsExtra.readFile(inputPackageJSONPath);
    const parsedPackageJSONContent = JSON.parse(packageJSONFileContent);
    parsedPackageJSONContent.scripts.test =
      "jest --clearCache && craco test --watchAll=false";
    parsedPackageJSONContent.scripts.preinstall =
      "pnpm install ~/.ccbp/ccbp-jest-reporter";
    parsedPackageJSONContent.dependencies["@craco/craco"] = "6.1.1";
    parsedPackageJSONContent.dependencies["ccbp-jest-reporter"] =
      "file:~/.ccbp/ccbp-jest-reporter";
    const stringifiedDestination = JSON.stringify(
      parsedPackageJSONContent,
      null,
      2
    );

    await fsExtra.writeFile(
      outputPackageJSONPath,
      stringifiedDestination,
      "utf8"
    );
    console.log(
      "----> 1.1: INFO: SUCCESSFULLY UPDATED package json with tests command"
    );
  } catch (e) {
    console.log("updatePackageJSONForTestReporter", e);
  }
};

const archiveInitialAndFinal = async (
  zipFileName,
  sourceFolderRootPath,
  destinationPath,
  isFinalArchiving = true
) => {
  await copyToTmpOnlyNecessaryFoldersAndFiles(
    sourceFolderRootPath,
    destinationPath
  );

  if (isFinalArchiving) {
    await fsExtra.remove(`${destinationPath}/tmp/initial`);
    await fsExtra.remove(`${destinationPath}/tmp/src/__tests__`);
  }

  // Zipping process

  const zip = new AdmZip();
  zip.addLocalFolder(`${destinationPath}/tmp`);

  // Writing to the zip file
  zip.writeZip(`${destinationPath}/${zipFileName}`);
  console.log(`----> 1.2, 2:  INFO: ${zipFileName} SUCCESS`);
};

const transformAndArchiveTests = async (
  zipFileName,
  sourceFolderPath,
  destinationPath,
  eachProjectConfig
) => {
  // Copy to necessary structure
  const path = `${sourceFolderPath}/src/__tests__`;

  try {
    await appendEachTestFileWithTestEnumPrefix(eachProjectConfig);
    await appendTestEnumDisplayTextWeightageToIdeBasedJson(eachProjectConfig);
    await appendQuestionTextToIdeBasedJson(eachProjectConfig);
    await fsExtra.copy(regexTmpFolder, `${destinationPath}/tmp/src/__tests__`);

    const isCracoExists = await fsExtra.existsSync(
      `${sourceFolderPath}/craco.config.js`
    );

    if (isCracoExists) {
      await fsExtra.remove(`${destinationPath}/tmp/craco.config.js`);
      await fsExtra.copy(
        `./internals/sc-craco.config.js`,
        `${destinationPath}/tmp/craco.config.js`
      );
    } else {
      await fsExtra.copy(
        `./internals/craco.config.js`,
        `${destinationPath}/tmp/craco.config.js`
      );
    }
    await fsExtra.copy(
      `./internals/jest.config.js`,
      `${destinationPath}/tmp/jest.config.js`
    );
  } catch (err) {
    console.error(err);
  }

  // Updating package.json for running test reporter
  await updatePackageJSONForTestReporter(
    `${sourceFolderPath}/package.json`,
    `${destinationPath}/tmp/package.json`
  );

  const zip = new AdmZip();
  zip.addLocalFolder(`${destinationPath}/tmp`);
  // Writing to the zip file
  zip.writeZip(`${destinationPath}/${zipFileName}`);
  console.log(`----> 3.4 INFO: ${zipFileName} SUCCESS`);
};

const cleanupRegexFolder = async () => {
  await fsExtra.remove(regexTmpFolder);
};

const cleanupDestinationTmpFolder = async (destinationFolderPath) => {
  await fsExtra.remove(`${destinationFolderPath}/tmp`);
};

const zippingFiles = async (
  courseName,
  projectName,
  eachProjectConfig,
  resolve
) => {
  const { projectPath, type } = eachProjectConfig;
  const destinationFolderPrefix = projectName;
  const sourceFolderPath = `${projectPath}`;
  const destinationFolderPath = `${reactJScodingXLoadingZipDestinationPath}/${projectName}`;
  // remove old dir and make a new directory

  await fsExtra.remove(destinationFolderPath);
  await fsExtra.mkdir(destinationFolderPath);
  await fsExtra.mkdir(`${destinationFolderPath}/tmp`);

  // Initial codes zipping
  await archiveInitialAndFinal(
    `${destinationFolderPrefix}.zip`,
    `${sourceFolderPath}/initial`,
    destinationFolderPath,
    false
  );

  await cleanupDestinationTmpFolder(destinationFolderPath);

  // Final zipping
  await archiveInitialAndFinal(
    `${destinationFolderPrefix}_solution.zip`,
    `${sourceFolderPath}`,
    destinationFolderPath
  );

  await cleanupDestinationTmpFolder(destinationFolderPath);

  // Tests suit zipping only for Coding practices
  if (type === codingXConstants.cp) {
    await transformAndArchiveTests(
      `${destinationFolderPrefix}_tests.zip`,
      sourceFolderPath,
      `${reactJScodingXLoadingZipDestinationPath}/${projectName}`,
      eachProjectConfig
    );
    await cleanupRegexFolder();
  }

  await cleanupDestinationTmpFolder(destinationFolderPath);
  resolve();
  console.log("---------------***************---------------");
};

const zipAllProjects = async () => {
  for (const projectName in reactjsCodingXConfig) {
    const newPromise = new Promise((resolve) => {
      zippingFiles(
        courseName,
        projectName,
        reactjsCodingXConfig[projectName],
        resolve
      );
    });
    await newPromise;
  }
};

zipAllProjects();

/*

Purpose:

- To Zip and Provide outputs for coding sessions, coding practices, coding exams, coding assignments
- Zip outputs meaning 
    - Coding sessions 
        - initial -> is similar to initial in ccbp-projects/react-fundamentals/coding-x/folder
        - final -> To provide to presenters
    - Coding Practices/Exams/Assignments
        - initial -> is similar to initial in ccbp-projects/react-fundamentals/coding-x/folder
        - final -> To provide as solution to users 

*/

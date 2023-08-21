import fsExtra from "fs-extra";
import path from "path";

export const getAllFiles = function (dirPath) {
  let files = fsExtra.readdirSync(dirPath);

  let arrayOfFiles = [];

  files.forEach(function (file) {
    if (fsExtra.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

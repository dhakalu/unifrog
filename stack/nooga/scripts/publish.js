import path from "path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { cwd } from "node:process";
import logger from "../logger.js";
import fse from 'fs-extra';
// const __dirname = fileURLToPath(import.meta.url);

const currentDirectory =  cwd()
logger.info("Building project at directory %s", currentDirectory);
const scriptDirectory = fileURLToPath(import.meta.url);
logger.info("Running build script %s", scriptDirectory);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = `${currentDirectory}/dist`;
const destDir = path.resolve(__dirname, '../../api/module-registry/remotes')
                                 
// To copy a folder or file, select overwrite accordingly
try {
  fse.copySync(srcDir, destDir, { overwrite: true|false })
  logger.info('Uploaded module from %s to path %s', srcDir, destDir);
} catch (err) {
  logger.error("errr is %s", err.message);
  logger.trace(err);
}


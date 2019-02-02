import { tmpdir } from "os";
const { distVersion } = require("../package");
export const PROJECT_FILE_EXTENSION = "tdproject";
export const DEFAULT_PROJECT_FILE_NAME = `app.${PROJECT_FILE_EXTENSION}`;
export const TMP_APP_ROOT_DIR = `${tmpdir()}/tandem`;
export const TMP_APP_DIR = `${tmpdir()}/tandem/${distVersion}`;
export const TMP_APP_BIN_PATH = `${TMP_APP_DIR}/Tandem-darwin-x64/Tandem.app`;

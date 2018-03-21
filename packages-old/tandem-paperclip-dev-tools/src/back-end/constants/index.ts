import * as path from "path";

export const PAPERCLIP_FILE_EXTENSION = "pc";
export const CONFIG_NAMESPACE = "paperclip";
export const CONFIG_NAME = "tandem.config";
export const DEFAULT_BASE_DIRECTORY = "paperclip";
export const PUBLIC_SRC_DIR_PATH = "/src";
export const TMP_DIRECTORY = process.env.HOME + "/.paperclip-dev-server";
export const DEFAULT_COMPONENT_SOURCE_DIRECTORY = "src/components";
export const SCREENSHOTS_DIRECTORY = path.join(TMP_DIRECTORY, "screenshots");

export const DEFAULT_COMPONENT_PREVIEW_SIZE = { width: 300, height: 300 };
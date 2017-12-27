import * as path from "path";

export const VISUAL_TOOLS_CONFIG_FILE_NAME = "tandem.config.js";
export const DEV_SERVER_BIN_PATH = "bin/server";
export const TANDEM_APP_MODULE_NAME = "tandemapp";

export const NEW_COMPONENT_SNIPPET = `` +
`
<component id="%|">
  <style>
  </style>
  <template>
  </template>
  <preview name="main" width="1366" height="768">
    <!-- <x-custom-component-id-here /> -->
  </preview>
</component>
`;
// TODO - move this to tandem-starters repository

import * as fs from "fs";
import * as path from "path";
import { BaseProjectStarter } from "./base";
import * as stripIndent from "strip-indent";


const FILES = {
  "index.css": stripIndent(`
    html, body {
      padding: 0;
      margin: 0;
      font-family: Helvetica;
    }
  `),

  "index.html": stripIndent(`
    <html lang="en">
      <head>
        <link rel="stylesheet" href="./index.css">
        <meta charset="utf-8">
      </head>
      <body>
        Hola Mundo!
      </body>
    </html>
  `),

  "workspace.tandem": stripIndent(`
    <tandem>

      <!-- Desktop -->
      <artboard src="./index.html" title="Desktop" style="width: 1024px; height: 768px;" />

      <!-- iPhone -->
      <artboard src="./index.html" title="iPhone 7" />

      <!-- Mobile -->
      <artboard src="./index.html" title="Mobile"  />
    </tandem>
  `)
};

export class HTMLProjectStarter extends BaseProjectStarter {
  async start(directoryPath: string) {

    for (const fileName in FILES) {
      fs.writeFileSync(path.join(directoryPath, fileName), FILES[fileName]);
    }

    return {
      workspaceFilePath: path.join(directoryPath, "workspace.tandem")
    }
  }
}
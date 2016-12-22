// TODO - move this to tandem-starters repository

import fs =  require("fs");
import path =  require("path");
import { BaseProjectStarter } from "./base";
import stripIndent = require("strip-indent");


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
      <remote-browser src="./index.html" title="Desktop 1440" style=" left: 2128px; top: -916px; width: 1440px; height: 900px; " class="remote-browser-entity">
      </remote-browser>
      <remote-browser src="./index.html" title="Desktop 1920" style=" left: -73px; top: -916px; width: 1920px; height: 1080px; " class="remote-browser-entity">
      </remote-browser>
      <remote-browser src="./index.html" title="iPad " style=" left: -46px; top: 521px; width: 768px; height: 1024px; " class="remote-browser-entity">
      </remote-browser>
      <remote-browser src="./index.html" title="iPhone 5/SE" style=" left: 1024px; top: 2210px; width: 320px; height: 568px; " class="remote-browser-entity">
      </remote-browser>
      <remote-browser src="./index.html" title="iPhone 6/7" class="remote-browser-entity" style=" left: 512px; top: 2210px; width: 375px; height: 667px; ">
      </remote-browser>
      <remote-browser src="./index.html" title="iPhone 6/7 Plus" class="remote-browser-entity" style=" left: 0px; top: 2210px; width: 414px; height: 736px; ">
      </remote-browser>
      <remote-browser src="./index.html" title="iPad Pro" style=" left: 887px; top: 521px; width: 1024px; height: 1366px; "></remote-browser>
    </tandem>
  `)
};

export class ResponsiveProjectStarter extends BaseProjectStarter {
  async start(directoryPath: string) {

    for (const fileName in FILES) {
      fs.writeFileSync(path.join(directoryPath, fileName), FILES[fileName]);
    }

    return {
      workspaceFilePath: path.join(directoryPath, "workspace.tandem")
    }
  }
}
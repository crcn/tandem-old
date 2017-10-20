import { fork, take, select, call } from "redux-saga/effects";
import {transpilePCASTToVanillaJS } from "../../paperclip";
import { ApplicationState, createComponentFromFilePath, Component } from "../state";
import { PAPERCLIP_FILE_PATTERN } from "../constants";
import { routeHTTPRequest } from "../utils";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import { expresssServerSaga } from "./express-server";

const getComponentFilePaths = ({ cwd, config: { componentsDirectory }}: ApplicationState) => glob.sync(path.join(componentsDirectory || cwd, "**", PAPERCLIP_FILE_PATTERN));

export function* routesSaga() {
  yield routeHTTPRequest(

    // returns capabilities to front-end so that it can turn features on or off
    [ { test: /^\/capabilities/, method: 'GET' }, getCapabilities],

    // returns the available components in the CWD
    [ { test: /^\/components/, method: 'GET' }, getComponents],

    // creates a new component
    [ { test: /^\/components/, method: 'POST' }, createComponent],
    [ { test: /^\/preview\/[^\/]+/, method: 'GET' }, getComponentPreview]
  );
}

function getCapabilities() {
  return [
    'CREATE_COMPONENTS',
    'GET_COMPONENTS'
  ];
}

function* createComponent(req: express.Request, res: express.Response) {


  
  // TODO - create global style if it doesn't already exist
  // check if component name is already taken (must be unique)
  // create style based on component name
  // create component based on WPC spec (or something like that), basically this:
  /*
  <template name="test">
    
    <style scoped>
      .container {

      }
    </style>
    <div className="container">
    </div>
  </template>

  <preview>
    
    <test />
  </preview>
  */
}

const NATIVE_COMPONENTS: Component[] = [
  {
    $id: "repeat",
    label: "List"
  },
  {
    $id: "text-block",
    label: "Dynamic Text"
  }
]

function* getAvailableComponents() {
  const state: ApplicationState = yield select();
  
  return [...NATIVE_COMPONENTS, getComponentFilePaths(state).map(filePath => (
    createComponentFromFilePath(fs.readFileSync(filePath, "utf8"), filePath)
  ))];
}

function* getComponents(req: express.Request, res: express.Response) {
  res.send(yield call(getAvailableComponents));
  // TODO - scan for PC files, and ignore files with <meta name="preview" /> in it
}

function* getComponentPreview(req: express.Request, res: express.Response) {

  // TODO - evaluate PC code IN THE BROWSER -- need to attach data information to element
  // nodes
  const [match, $id] = req.path.match(/preview\/(\w+)/);

  const components = (yield call(getAvailableComponents)) as Component[];

  const targetComponent = components.find(component => component.$id === $id);

  if (!targetComponent || !targetComponent.filePath) {
    res.status(404);
    return res.send(`Component not found`);
  }

  const html = `
  <html>
    <head>
      <title>${targetComponent.label}</title>
    </head>
    <body>
      <script>
        var module = {
          exports: {}
        };
        ${transpilePCASTToVanillaJS(fs.readFileSync(targetComponent.filePath, "utf8"))}
        var preview = module.exports.preview;
        if (!preview) {
          document.body.appendChild(
            document.createTextNode('"preview" template not found')
          );
        } else {
          document.body.appendChild(preview({}));
        }
      </script>
    </body>
  </html>
  `;

  res.send(html);
}
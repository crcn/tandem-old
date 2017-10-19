import { fork, take, select } from "redux-saga/effects";
import { ApplicationState, createComponentFromFilePath } from "../state";
import { PAPERCLIP_FILE_PATTERN } from "../constants";
import { routeHTTPRequest } from "../utils";
import * as express from "express";
import * as path from "path";
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
    [ { test: /^\/preview\/[^\/]+/ }, getComponentPreview]
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

function* getComponents(req: express.Request, res: express.Response) {
  const state: ApplicationState = yield select();
  
  const components = getComponentFilePaths(state).map(createComponentFromFilePath);

  res.send(components);
  // TODO - scan for PC files, and ignore files with <meta name="preview" /> in it
}

function getComponentPreview(req: express.Request, res: express.Response) {

  // TODO - evaluate PC code IN THE BROWSER -- need to attach data information to element
  // nodes
  const [match, name] = req.path.match(/preview\/(\w+)/);
  res.send("PREVIEW" +  name);
}
import { fork, take } from "redux-saga/effects";
import { routeHTTPRequest } from "../utils";
import * as express from "express";
import { expresssServerSaga } from "./express-server";

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

function createComponent(req: express.Request, res: express.Response) {
  res.send("OK");
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

function getComponents() {
  // TODO - scan for PC files, and ignore files with <meta name="preview" /> in it
}

function getComponentPreview(req: express.Request, res: express.Response) {

  // TODO - evaluate PC code IN THE BROWSER -- need to attach data information to element
  // nodes
  const [match, name] = req.path.match(/preview\/(\w+)/);
  res.send("PREVIEW" +  name);
}
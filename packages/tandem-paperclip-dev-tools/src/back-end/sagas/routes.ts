import { fork, take, select, call, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { transpilePCASTToVanillaJS, editPCContent, TranspileResult } from "../../paperclip";
import * as request from "request";
import { ApplicationState, createComponentFromFilePath, Component } from "../state";
import { flatten } from "lodash";
import { PAPERCLIP_FILE_PATTERN } from "../constants";
import { routeHTTPRequest, getComponentFilePaths } from "../utils";
import { watchUrisRequested, fileContentChanged, fileChanged } from "../actions";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import { editString, StringMutation } from "aerial-common2";
import { expresssServerSaga } from "./express-server";

export function* routesSaga() {
  yield routeHTTPRequest(

    [ { test: /^\/proxy\/.*/ }, proxy],
    [ { test: /^\/file/, method: "POST" }, setFile],

    // returns capabilities to front-end so that it can turn features on or off
    [ { test: /^\/capabilities/, method: "GET" }, getCapabilities],

    // returns the available components in the CWD
    [ { test: /^\/components/, method: "GET" }, getComponents],

    // creates a new component
    [ { test: /^\/components/, method: "POST" }, createComponent],
    [ { test: /^\/preview\/[^\/]+/, method: "GET" }, getComponentPreview],
    [ { test: /^\/watch/, method: "POST" }, watchUris],
    [ { test: /^\/edit/, method: "POST" }, editFiles],
  );
}

function getCapabilities() {
  return [
    "CREATE_COMPONENTS",
    "GET_COMPONENTS"
  ];
}

function* createComponent(req: express.Request, res: express.Response) {

  // TODO - create global style if it doesn"t already exist
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

const BUILTIN_COMPONENTS: Component[] = [
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
  
  return [...BUILTIN_COMPONENTS, ...getComponentFilePaths(state).map(filePath => (
    createComponentFromFilePath(fs.readFileSync(filePath, "utf8"), filePath)
  ))];
}

function* proxy(req, res: express.Response) {
  let [match, uri] = req.path.match(/proxy\/(.+)/);
  uri = decodeURIComponent(uri);
  req.url = uri;
  req.pipe(request({
    uri: uri
  }).on("error", (err) => {
    res.statusCode = 500;
    res.send(err.stack);
  })).pipe(res);
}
function* getComponents(req: express.Request, res: express.Response) {
  res.send(yield call(getAvailableComponents));
  // TODO - scan for PC files, and ignore files with <meta name="preview" /> in it
}

function* getPostData (req: express.Request) {

  const chan = eventChannel((emit) => {
    let buffer = [];
    req.on("data", chunk => buffer.push(chunk));
    req.on("end", () => emit(JSON.parse(buffer.join(""))));
    return () => { };
  });

  return yield take(chan);
}

function* watchUris(req: express.Request, res: express.Response) {
  const data = yield call(getPostData, req);
  yield put(watchUrisRequested(data));
  res.send([]);
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
  
  const state: ApplicationState = yield select();

  const readFileSync = (filePath: string) => {
    const fileCache = state.fileCache.find((item) => item.filePath === filePath);
    return fileCache ? fileCache.content.toString("utf8") : fs.readFileSync(filePath, "utf8")
  }

  const transpileResult: TranspileResult = transpilePCASTToVanillaJS(readFileSync(targetComponent.filePath), `file://${targetComponent.filePath}`, {
    assignTo: "bundle",
    readFileSync,
  });

  const allFiles = Object.keys(transpileResult.content);

  let content: string;

  if (transpileResult.errors.length) {
    content = `
      bundle = {
        entry: {
          preview: function() {
            return document.createTextNode(${JSON.stringify("Error: " + transpileResult.errors[0].message)})
          }
        } 
      }
    `;
  } else {
    content = transpileResult.content;
  }

  const html = `
  <html>
    <head>
      <title>${targetComponent.label}</title>
    </head>
    <body>
      <script>
        var bundle = {};
        ${content}
        var preview  = bundle.entry.preview;
        var styles   = bundle.entry.$$styles || [];
        var allFiles = ${JSON.stringify(transpileResult.allFiles)};
        if (!preview) {
          document.body.appendChild(
            document.createTextNode('"preview" template not found')
          );
        } else {
          console.log(...styles);
          styles.forEach(function(style) {
            document.body.appendChild(style);
          });
          try {
            document.body.appendChild(preview({}));
          } catch(e) {
            document.body.appendChild(document.createTextNode(e.stack));
          }
        }

        if (window.reloadWhenUrisChange) {
          window.reloadWhenUrisChange(allFiles);
        }
      </script>
    </body>
  </html>
  `;

  res.send(html);
}

function* editFiles(req: express.Request, res: express.Response) {
  const mutationsByUri = yield call(getPostData, req);
  const state: ApplicationState = yield select();

  const result: any = {};

  for (const uri in mutationsByUri) {
    if (uri.substr(0, 5) !== "file:") continue;
    const filePath = path.normalize(uri.substr(7));
    const fileCacheItem = state.fileCache.find((item) => item.filePath === filePath);
    if (!fileCacheItem) {
      console.warn(`${filePath} was not found in cache, cannot edit!`);
      continue;
    }

    // TODO - add history here
    const mutations = mutationsByUri[uri];
    const oldContent = fileCacheItem.content.toString("utf8");

    const stringMutations = flatten(mutations.map(editPCContent.bind(this, oldContent))) as StringMutation[];

    const newContent = editString(oldContent, stringMutations);

    result[uri] = newContent;

    yield put(fileContentChanged(filePath, new Buffer(newContent, "utf8"), new Date()));
    yield put(fileChanged(filePath)); // dispatch public change -- causes reload
  }

  res.send(result);
}

function* setFile(req: express.Request, res: express.Response) { 
  const { filePath, content } = yield call(getPostData, req);
  yield put(fileContentChanged(filePath, new Buffer(content, "utf8"), new Date()));
  yield put(fileChanged(filePath)); // dispatch public change -- causes reload
  res.send([]);
}
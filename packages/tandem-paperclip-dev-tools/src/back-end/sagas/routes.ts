import { fork, take, select, call, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import * as request from "request";
import { ApplicationState, getComponentsFromSourceContent, RegisteredComponent } from "../state";
import { flatten } from "lodash";
import { PAPERCLIP_FILE_PATTERN } from "../constants";
import { getModuleFilePaths, getModuleId } from "../utils";
import { watchUrisRequested, fileContentChanged, fileChanged, expressServerStarted, EXPRESS_SERVER_STARTED, ExpressServerStarted } from "../actions";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import * as glob from "glob";
import { editString, StringMutation, weakMemo } from "aerial-common2";
import { expresssServerSaga } from "./express-server";

export function* routesSaga() {
  yield fork(handleExpressServerStarted);
}

function* handleExpressServerStarted() {
  while(true) {
    const { server }: ExpressServerStarted = yield take(EXPRESS_SERVER_STARTED);
    yield addRoutes(server);
  }
}

function* addRoutes(server: express.Express) {

  const state: ApplicationState = yield select();

  server.use("/src", express.static(state.config.sourceDirectory));
  server.use(express.static(path.join(path.dirname(require.resolve("paperclip")), "dist")));
  console.log("serving paperclip dist/ folder");

  server.all(/^\/proxy\/.*/, yield wrapRoute(proxy));
  server.post("/src", yield wrapRoute(setFile));

  // return all components
  server.get("/components", yield wrapRoute(getComponents));

  // return the module file
  server.get("/modules/:moduleId", yield wrapRoute(getModuleFileContent));

  // return a module preview
  server.get("/modules/:moduleId/preview", yield wrapRoute(getComponentPreview));

  // create a new component (creates a new module with a single component)
  server.post("/components", yield wrapRoute(createComponent));

  // 
  server.post("/watch", yield wrapRoute(watchUris));

  // edits a file
  server.post("/edit", yield wrapRoute(editFiles));
  
}

function* wrapRoute(route) {

  let handle;

  const chan = eventChannel((emit) => {
    handle = (req, res, next) => {
      emit([req, res, next]);
    }

    return () => {};
  });

  yield spawn(function*() {
    while(true) {
      yield route(...(yield take(chan)));
    }
  });

  return function(req: express.Request, res: express.Response, next) {
    handle(req, res, next);
  }
}

function getCapabilities() {
  return [
    "CREATE_COMPONENTS",
    "GET_COMPONENTS"
  ];
}

function* getModuleFileContent(req: express.Request, res: express.Response, next) {
  const { moduleId } = req.params;
  const state: ApplicationState = yield select();
  const targetModuleFilePath = getModuleFilePaths(state).find((filePath) => getModuleId(filePath) === moduleId);
  if (!targetModuleFilePath) next();
  res.sendFile(targetModuleFilePath);
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


function* getAvailableComponents() {
  const state: ApplicationState = yield select();
  const readFileSync = getReadFile(state);
  
  return getModuleFilePaths(state).reduce((components, filePath) => (
    [...components, ...getComponentsFromSourceContent(readFileSync(filePath), filePath)]
  ), []);
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

const getReadFile = weakMemo((state: ApplicationState) => (filePath: string) => {
  const fileCache = state.fileCache.find((item) => item.filePath === filePath);
  return fileCache ? fileCache.content.toString("utf8") : fs.readFileSync(filePath, "utf8")
});

const getTranspileOptions = weakMemo((state: ApplicationState) => ({
  assignTo: "bundle",
  readFileSync: getReadFile(state),
  extensions: state.config.extensions,
  moduleDirectories: state.config.moduleDirectories
}));

function* getComponentPreview(req: express.Request, res: express.Response) {

  // TODO - evaluate PC code IN THE BROWSER -- need to attach data information to element
  // nodes
  const state: ApplicationState = yield select();
  const { moduleId } = req.params;

  const components = (yield call(getAvailableComponents)) as RegisteredComponent[];

  const targetComponent = components.find(component => component.moduleId === moduleId || component.tagName === moduleId);


  if (!targetComponent || !targetComponent.filePath) {
    res.status(404);
    return res.send(`Component not found`);
  }

  const relativeModuleFilePath = targetComponent.filePath.replace(state.config.sourceDirectory, "");

  let content: string;

  const html = `
  <html>
    <head>
      <title>${targetComponent.label}</title>

      <!-- paperclip used to compile templates in the browser -- primarily to reduce latency of 
      sending bundled files over a network, especially when there are many canvases. -->
      <script type="text/javascript" src="/paperclip.min.js"></script>
    </head>
    <body>
      <script>
        paperclip.bundleVanilla("/src${relativeModuleFilePath}", {
          io: {
            readFile(uri) {
              return fetch(uri).then((response) => response.text());
            },
            resolveFile(relative, base) {
              const dirname = base.split("/");
              dirname.pop();
              relative = relative.replace("./", "");
              const parentDirs = relative.split("../");
              const baseName = parentDirs.pop();
              dirname.splice(dirname.length - parentDirs.length, dirname.length);
              return Promise.resolve(dirname.join("/") + "/" + baseName);
            }
          }
        }).then(({ code, warnings }) => {
          const { entry, globalStyles, modules } = new Function("return " + code)(window);

          for (let i = 0, {length} = entry.globalStyles; i < length; i++) {
            document.body.appendChild(entry.globalStyles[i]);
          }

          for (let i = 0, {length} = entry.strays; i < length; i++) {
            document.body.appendChild(entry.strays[i]);
          }
        });
        
        // try {
        //   var bundle = {};
        //   ${content}
        //   var previews  = bundle.entry.$$previews || {};

        //   var styles   = bundle.entry.$$styles || [];
        //   if (!Object.keys(previews).length) {
        //     document.body.appendChild(
        //       document.createTextNode('no preview found in file')
        //     );
        //   } else {
        //     const mainPreview = previews[Object.keys(previews)[0]];
        //     styles.forEach(function(style) {
        //       document.body.appendChild(style);
        //     });
        //     document.body.appendChild(mainPreview);
        //   }
        // } catch(e) {
        //   console.log(e.stack);
        //   document.body.appendChild(document.createTextNode(e.stack));
        // }

        // if (window.reloadWhenUrisChange) {
        //   window.reloadWhenUrisChange(allFiles);
        // }
      </script>
    </body>
  </html>
  `;

  res.send(html);
}

function* editFiles(req: express.Request, res: express.Response, next) {
  // const mutationsByUri = yield call(getPostData, req);
  // const state: ApplicationState = yield select();

  // const result: any = {};

  // for (const uri in mutationsByUri) {
  //   if (uri.substr(0, 5) !== "file:") continue;
  //   const filePath = path.normalize(uri.substr(7));
  //   const fileCacheItem = state.fileCache.find((item) => item.filePath === filePath);
  //   if (!fileCacheItem) {
  //     console.warn(`${filePath} was not found in cache, cannot edit!`);
  //     continue;
  //   }

  //   // TODO - add history here
  //   const mutations = mutationsByUri[uri];
  //   const oldContent = fileCacheItem.content.toString("utf8");

  //   const stringMutations = flatten(mutations.map(editPCContent.bind(this, oldContent))) as StringMutation[];

  //   const newContent = editString(oldContent, stringMutations);

  //   result[uri] = newContent;

  //   yield put(fileContentChanged(filePath, new Buffer(newContent, "utf8"), new Date()));
  //   yield put(fileChanged(filePath)); // dispatch public change -- causes reload
  // }

  // res.send(result);

  next();
}

function* setFile(req: express.Request, res: express.Response) { 
  const { filePath, content } = yield call(getPostData, req);
  yield put(fileContentChanged(filePath, new Buffer(content, "utf8"), new Date()));
  yield put(fileChanged(filePath)); // dispatch public change -- causes reload
  res.send([]);
}
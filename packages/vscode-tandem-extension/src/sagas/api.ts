import { Request, Response } from "express";
import * as request from "request";
import { ExtensionState } from "../state";
import * as HttpProxy from "http-proxy";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as md5 from "md5";
import { TANDEM_APP_MODULE_NAME } from "../constants";
import { CHILD_DEV_SERVER_STARTED, startDevServerRequest, openFileRequested, ExpressServerStarted, EXPRESS_SERVER_STARTED, expressServerStarted, OPEN_FILE_REQUEST_RESULT, OpenFileRequestResult } from "../actions";
import { take, fork, call, select, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { routeHTTPRequest } from "../utils";

const FILES_PATTERN = /^\/edit$/;

export function* apiSaga() {
  yield fork(handleExpressServerStarted);
}

function* handleExpressServerStarted() {
  while(true) {
    const { server }: ExpressServerStarted = yield take(EXPRESS_SERVER_STARTED);
    yield addRoutes(server);
  }
}

export function* addRoutes(server: express.Express) {
  const proxy = HttpProxy.createProxyServer();
  proxy.on("error", (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end(err.message);
  });

  server.post("/open", yield wrapRoute(handleOpenFile));
  server.use("/tandem", express.static(getTandemDirectory(yield select())));
  server.get("/index.html", yield wrapRoute(getIndex));
  server.all(/.*/, yield wrapRoute(proxyToDevServer(proxy)));
}
function* getPostData(req) {
  
  const chan = eventChannel((emit) => {
    let buffer = [];
    req.on("data", chunk => buffer.push(chunk));
    req.on("end", () => emit(JSON.parse(buffer.join(""))));
    return () => { };
  });

  return yield take(chan);
}

function proxyToDevServer(proxy: HttpProxy) {
  return function*(req: Request, res: Response) {
    const state: ExtensionState = yield select();
    const devPort = state.childDevServerInfo.port;
    const host = `http://127.0.0.1:${devPort}`;
    proxy.web(req, res, { target: host }, (e) => {
      console.error(e);
    });
  };
}

const getTandemDirectory = (state: ExtensionState) => path.dirname(require.resolve(TANDEM_APP_MODULE_NAME));

function* getIndex(req: Request, res: Response) {
  let state: ExtensionState = yield select();

  if (!state.childDevServerInfo) {
    yield put(startDevServerRequest());
    yield take(CHILD_DEV_SERVER_STARTED);
    state = yield select();
  }

  const { getEntryHTML } = require(getTandemDirectory(state));

  res.send(getEntryHTML({
    apiHost: `http://localhost:${state.port}`,
    proxy: `http://localhost:${state.port}/proxy/`,
    storageNamespace: md5(state.rootPath),
    filePrefix: "/tandem"
  }));
}

function* getTandemFile(req: Request, res: Response) {
  const filePath = req.path.match(/tandem(.*)/)[1]
  fs.createReadStream(getTandemDirectory(yield select()) + filePath).pipe(res);
}

function* handleOpenFile(req: Request, res: Response) {
  const body = yield getPostData(req);
  const openFileReq = openFileRequested(body);
  yield fork(function*() {
    const { error } = yield take((action: OpenFileRequestResult) => action.type === OPEN_FILE_REQUEST_RESULT && action.request.checksum === openFileReq.checksum && action.request.componentId === action.request.componentId);

    if (error) {
      res.statusCode = 404;
      res.send({
        message: `Unable to open file`
      });
    }
  });

  yield put(openFileReq);
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
  
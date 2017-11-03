import { Request, Response } from "express";
import * as request from "request";
import { logErrorAction } from "aerial-common2";
import { ExtensionState } from "../state";
import * as HttpProxy from "http-proxy";
import * as fs from "fs";
import * as path from "path";
import { CHILD_DEV_SERVER_STARTED, fileContentChanged, startDevServerRequest, openFileRequested } from "../actions";
import { take, fork, call, select, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { routeHTTPRequest } from "../utils";

const FILES_PATTERN = /^\/edit$/;

export function* apiSaga() {
  const proxy = HttpProxy.createProxyServer();
  proxy.on("error", (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end(err.message);
  });
  
  yield routeHTTPRequest(
    [{ method: "POST", test: FILES_PATTERN }, handleEditFile],
    [{ method: "POST", test: /^\/open/ }, handleOpenFile],
    [{ method: "GET", test: /^\/index.html/ }, getIndex],
    [{ method: "GET", test: /tandem/ }, getTandemFile],
    [{ test: /.*/ }, proxyToDevServer(proxy)]
  );
}
function* getPostData (req) {
  
    const chan = eventChannel((emit) => {
      let buffer = [];
      req.on("data", chunk => buffer.push(chunk));
      req.on("end", () => emit(JSON.parse(buffer.join(""))));
      return () => { };
    });
  
    return yield take(chan);
  }

function proxyToDevServer(proxy: HttpProxy, onRequest: (req: Request) => any = () => {}) {
  return function*(req: Request, res: Response) {
    const state: ExtensionState = yield select();
    const devPort = state.childDevServerInfo.port;
    const host = `http://127.0.0.1:${devPort}`;
    proxy.web(req, res, { target: host });
    yield call(onRequest, req);
  };
}

function* handleEditFile(req: Request, res: Response) {
  const state: ExtensionState = yield select();
  const devPort = state.childDevServerInfo.port;
  const host = `http://127.0.0.1:${devPort}`;
  const body = yield getPostData(req.pipe(request(host + "/edit")));

  res.send(body);

  for (const uri in body) {
    yield put(fileContentChanged(uri.replace("file://", ""), body[uri]));
  }
}

const getTandemDirectory = (state: ExtensionState) => path.dirname(require.resolve(state.visualDevConfig.vscode.tandemcodeDirectory || "tandemcode"));

function* getIndex(req: Request, res: Response) {
  let state: ExtensionState = yield select();

  if (!state.childDevServerInfo) {
    yield put(startDevServerRequest());
    yield take(CHILD_DEV_SERVER_STARTED);
    state = yield select();
  }

  const { getEntryHTML } = require(getTandemDirectory(state));

  res.send(getEntryHTML({
    apiHost: `http://localhost:${state.visualDevConfig.port}`,
    proxy: `http://localhost:${state.visualDevConfig.port}/proxy/`,
    localStorageNamespace: state.rootPath,
    filePrefix: "/tandem"
  }));
}

function* getTandemFile(req: Request, res: Response) {
  const filePath = req.path.match(/tandem(.*)/)[1]
  fs.createReadStream(getTandemDirectory(yield select()) + filePath).pipe(res);
}

function* handleOpenFile(req: Request, res: Response) {
  const body = yield getPostData(req);
  res.send(`"ok"`);
  yield put(openFileRequested(body));
}
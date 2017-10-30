import { Request, Response } from "express";
import * as request from "request";
import { logErrorAction } from "aerial-common2";
import { ExtensionState } from "../state";
import * as HttpProxy from "http-proxy";
import { CHILD_DEV_SERVER_STARTED } from "../actions";
import { take, fork, call, select, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { routeHTTPRequest } from "../utils";

const FILES_PATTERN = /^\/edit\/[^\/]+$/;

export function* apiSaga() {
  yield take(CHILD_DEV_SERVER_STARTED);
  const proxy = HttpProxy.createProxyServer();
  proxy.on("error", (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end(err.message);
  });
  
  yield routeHTTPRequest(
    [{ method: "POST", test: FILES_PATTERN }, handleEditFile],
    [{ test: /.*/ }, proxyToDevServer(proxy)]
  );
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
  console.log("EDIT");

  const state: ExtensionState = yield select();
  const devPort = state.childDevServerInfo.port;
  const host = `http://127.0.0.1:${devPort}`;
  
  const chan = yield eventChannel((emit) => {
    const req2 = req.pipe(request(host + "/edit"));
    const chunks = [];
    req2.on("data", chunk => chunks.push(chunk));
    req2.on("end", () => {
      emit(JSON.parse(chunks.join("")));
    });
    return () => {}
  });

  const body = yield take(chan);

  console.log(body);

  res.send(body);

}

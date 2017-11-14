import * as express from "express";
import { ApplicationState } from "../state";
import * as getPort from "get-port";
import * as cors from "cors";
import * as http from "http";
import * as io from "socket.io";
import * as multiparty from "connect-multiparty";
import { eventChannel } from "redux-saga";
import { createSocketIOSaga } from "aerial-common2";
import { VISUAL_DEV_CONFIG_LOADED, expressServerStarted } from "../actions";
import { select, fork, spawn, take, put, call } from "redux-saga/effects";

export function* expresssServerSaga() {
  yield fork(handleVisualDevConfigLoaded);
}

function* handleVisualDevConfigLoaded() {
  let server: express.Express;
  let httpServer: http.Server;
  if (httpServer) {
    httpServer.close();
  }

  const { port }: ApplicationState = yield select();

  server = express();
  server.use(cors());
  

  // TODO - dispatch express server initialized
  httpServer = server.listen(port);
  yield put(expressServerStarted(server));
  yield fork(createSocketIOSaga(io(httpServer)));
  console.log(`HTTP server listening on port ${port}`);  
}
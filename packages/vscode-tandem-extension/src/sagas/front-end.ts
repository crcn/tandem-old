import { delay } from "redux-saga";
import { tandemFEConnectivity, TandemFEConnectivity, TANDEM_FE_CONNECTIVITY, OPEN_CURRENT_FILE_IN_TANDEM_EXECUTED, OPENING_TANDEM_APP, SOCKET_CLIENT_CONNECTED } from "../actions"
import { ExtensionState, TandemEditorReadyStatus } from "../state";
import  { waitForFEConnected, requestOpenTandemIfDisconnected } from "../utils";
import { take, fork, spawn, put, call, select, race } from "redux-saga/effects";

const DISCONNECTED_TIMEOUT = 1000 * 2;

export function* frontEndSaga() {
  yield fork(pingFrontEnd);
}

function* pingFrontEnd() {

  yield fork(function*() {
    while(1) {
      yield put({ type: "$$TANDEM_FE_PING", $public: true });
      const {pong, timeout} = yield race({
        pong: take("$$TANDEM_FE_PONG"),
        timeout: call(delay, DISCONNECTED_TIMEOUT)
      });
      yield put(tandemFEConnectivity(Boolean(pong)));
    }
  }); 
}

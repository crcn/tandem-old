import { delay } from "redux-saga";
import { tandemFEConnectivity, TandemFEConnectivity, TANDEM_FE_CONNECTIVITY, OPEN_CURRENT_FILE_IN_TANDEM_EXECUTED } from "../actions"
import { ExtensionState } from "../state";
import  { waitForFEConnected, requestOpenTandemIfDisconnected } from "../utils";
import { take, fork, spawn, put, call, select } from "redux-saga/effects";

const DISCONNECTED_TIMEOUT = 1000 * 3;

export function* frontEndSaga() {
  yield fork(pingFrontEnd);
}

function* pingFrontEnd() {
  let _receivedPong = false;
  yield fork(function*() {
    while(1) {
      yield take("$$TANDEM_FE_PONG");
      _receivedPong = true;
      console.log("Tandem FE beacon");
    }
  });

  yield fork(function*() {
    while(1) {
      console.log("Tandem FE ping");
      yield put({ type: "$$TANDEM_FE_PING", $public: true });
      yield call(delay, DISCONNECTED_TIMEOUT);
      yield put(tandemFEConnectivity(_receivedPong));
    }
  }); 
}

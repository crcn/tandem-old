import * as express from "express";
import { fork, take, call, select, put } from "redux-saga/effects";
import { HTTPRequest, HTTP_REQUEST, TandemFEConnectivity, TANDEM_FE_CONNECTIVITY, openTandemIfDisconnectedRequested } from "../actions";
import { ExtensionState, TandemEditorReadyStatus } from "../state";

export type TakeEveryHTTPRequestOptions = {
  test: RegExp;
  method?: string;
}

export function* requestOpenTandemIfDisconnected() {
  const state: ExtensionState = yield select();
  if (state.tandemEditorStatus === TandemEditorReadyStatus.DISCONNECTED) {
    yield put(openTandemIfDisconnectedRequested());
  }
  yield call(waitForFEConnected);
}

export function* waitForFEConnected() {
  const state: ExtensionState = yield select();
  if (state.tandemEditorStatus !== TandemEditorReadyStatus.CONNECTED) {
    yield take((action: TandemFEConnectivity) => action.type === TANDEM_FE_CONNECTIVITY && action.connected);
  }
}

const testHTTPRequestAction = ({ test, method }: TakeEveryHTTPRequestOptions) => (action: HTTPRequest) => action.type === HTTP_REQUEST && test.test(action.request.path) && (!method || action.request.method === method);

export function* routeHTTPRequest (
  ...routes:Array<[TakeEveryHTTPRequestOptions, (req: express.Request, res: express.Response) => any]>
) {

  const findRoute = (action) => routes.find(([options]) => testHTTPRequestAction(options)(action));

  while(true) {
    const action: HTTPRequest = yield take(action => !!findRoute(action));

    const [options, handleRequest] = findRoute(action);
    yield call(handleRequest, action.request, action.response);
  }
};

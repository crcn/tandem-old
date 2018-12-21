import { fork, select, take, put, spawn } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { unloading, UNLOADER_COMPLETED, UNLOADING } from "../actions";
import { isUnloaded } from "../state";

export function* processSaga() {
  // yield fork(handleWindowUnload);
}

function* handleWindowUnload() {
  // const initialUnloadChanel = waitForUnload();
  // console.log("EVENTT");
  // yield take(initialUnloadChanel);
  // initialUnloadChanel.close();
  // yield spawn(function* gracefullyUnload() {
  //   while(1) {
  //     yield take([UNLOADER_COMPLETED, UNLOADING]);
  //     if(isUnloaded(yield select())) {
  //       break;
  //     }
  //   }
  //   if (1) {
  //     window.location.reload();
  //   } else {
  //     window.close();
  //   }
  // });
  // yield put(unloading());
}

function waitForUnload() {
  return eventChannel(emit => {
    let reloading = false;
    window.addEventListener("devtools-reload-page", () => {
      console.log("RELOAD");
    });
    window.addEventListener("reload", () => {
      console.log("RELOAD");
    });
    window.addEventListener("unload", event => {
      return false;
    });
    // const onUnload =
    window.addEventListener("beforeunload", event => {
      event.returnValue = false;
      emit({ reloading });
    });
    return () => {};
  });
}

import { take, fork, put, spawn, call } from "redux-saga/effects";
import { eventChannel, delay } from "redux-saga";

const TAG = "$$" + Date.now();

export function* ipcSaga() {
  yield fork(receiveMessages);
  yield spawn(sendMessages);
  yield fork(pingPong);
}

function* receiveMessages() {
  const chan = eventChannel((emit) => {
    process.on("message", emit);
    return () => {

    };
  });

  while(1) {
    const action = yield take(chan);
    action[TAG] = 1;
    yield put(yield take(chan));
  }
}

function* sendMessages() {
  while(1) {
    const action = yield take();
    console.log(action);
    if (action[TAG]) continue;
    // process.send("message", action);
  }
}

function* pingPong() {
  let _ponged = false;
  yield spawn(function*() {
    while(1) {
      yield take("pong");
      _ponged = true;
    }
  });
  yield spawn(function*() {
    while(1) {
      _ponged = false;
      yield put({ type: "ping" });
      yield call(delay, 1000 * 5);
      if (!_ponged) {
        console.log("Did not receive pong. Closing.");
        process.exit();
      }
    }
  });
}

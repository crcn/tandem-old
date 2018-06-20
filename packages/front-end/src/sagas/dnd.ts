import { fork, take } from "redux-saga/effects";
import { FILE_NAVIGATOR_DROPPED_ITEM } from "../actions";

export function* dndSaga() {
  yield fork(handleDroppedFileNavigatorItem);
}

function* handleDroppedFileNavigatorItem() {
  while(1) {
    yield take(FILE_NAVIGATOR_DROPPED_ITEM);

  }
}
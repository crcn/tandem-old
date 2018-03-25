import { RootState } from "../state";
import { fork, take, select, put, call } from "redux-saga/effects";
import { PROJECT_LOADED, ProjectLoaded, syntheticWindowOpened, SyntheticWindowOpened, SYNTHETIC_WINDOW_OPENED, FILE_NAVIGATOR_ITEM_CLICKED } from "../actions";
import { getSyntheticWindow, createSyntheticWindow, SyntheticWindow } from "paperclip";

export function* syntheticBrowserSaga() {

}
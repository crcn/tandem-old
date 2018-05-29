// import { expect } from "chai";
// import { request } from "aerial-common2";
// import { fork, call, select } from "redux-saga/effects";
// import { createTestProtocolAdapter } from "./utils";
// import { createStore, applyMiddleware } from "redux";
// import { default as createSagaMiddleware, delay } from "redux-saga";
// import { PaperclipStateRootState, createPaperclipStateRootState } from "../state";
// import { PaperclipStateReducer } from "../reducers";
// import { PaperclipStateSaga } from "../sagas";
// import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../environment";
// import { openSyntheticWindowRequest } from "../actions";
// // import {
// //   getPaperclipStateRootState,
// //   openSyntheticWindowRequest,
// //   PaperclipStateSaga,
// //   PaperclipStateReducer,
// //   createPaperclipStateRootState
// // } from "../index";

// describe(__filename + "#", () => {

//   const createTestStore = (testFiles, run) => {

//     const createMainState = () => ({
//       dependencyGraph: createDependencyGraph(),
//       PaperclipStateRootState: createPaperclipStateRootState()
//     });

//     const mainReducer = (state = createMainState(), event) => {
//       state = dependencyGraphReducer(state, event);
//       state = PaperclipStateReducer(state, event);
//       return state;
//     };

//     const sagas = createSagaMiddleware();
//     const store = createStore(
//       mainReducer,
//       createMainState(),
//       applyMiddleware(sagas)
//     )
//     sagas.run(function*() {
//       // yield fork(createCommonJSSaga());
//       yield fork(PaperclipStateSaga);
//       yield fork(createDependencyGraphSaga());
//       yield fork(createURIProtocolSaga(createTestProtocolAdapter("local", testFiles)));
//       yield call(run);
//     });
//     return store;
//   }
// });

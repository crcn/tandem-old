import { fork, take, select, call, put, spawn } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { spawn as spawn2 } from "child_process";
import {
  BUILD_BUTTON_START_CLICKED,
  RootState,
  ScriptProcess,
  createScriptProcess,
  scriptProcessStarted,
  scriptProcessLog,
  scriptProcessStopped,
  buildScriptStarted
} from "tandem-front-end";

export function* processSaga() {
  yield fork(handleStartBuild);
}

function* handleStartBuild() {
  while (1) {
    yield take(BUILD_BUTTON_START_CLICKED);
    const state: RootState = yield select();
    const buildScript = state.projectInfo.config.scripts.build;
    const scriptProcess: ScriptProcess = yield call(
      spawnScript,
      buildScript,
      "Build"
    );
    yield put(buildScriptStarted(scriptProcess));
  }
}

function* spawnScript(script: string, label: string): IterableIterator<any> {
  const scriptProcess = createScriptProcess(label);

  yield put(scriptProcessStarted(scriptProcess));

  yield spawn(function*(): any {
    const channel = eventChannel<any>(emit => {
      const proc = spawn2(script, [], {
        shell: true
      });

      proc.stderr.on("data", chunk =>
        emit({
          type: "stderr",
          chunk
        })
      );

      proc.stdout.on("data", chunk =>
        emit({
          type: "stdout",
          chunk
        })
      );

      proc.on("close", () => emit(END));

      return () => {
        proc.kill();
      };
    });

    while (1) {
      const event = yield take(channel);
      console.log("spawnScript", event);
      if (event === END) {
        yield put(scriptProcessStopped(scriptProcess));
        break;
      } else if (event.type === "stdout") {
        yield put(
          scriptProcessLog(scriptProcess, {
            text: String(event.chunk),
            error: false
          })
        );
      } else if (event.type === "stderr") {
        yield put(
          scriptProcessLog(scriptProcess, {
            text: String(event.chunk),
            error: true
          })
        );
      }
    }
  });

  return scriptProcess;
}

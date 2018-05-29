import { eventChannel } from "redux-saga";
import { take, fork, select, call, put, spawn } from "redux-saga/effects";
import { SyntheticFrame, PaperclipState } from "./synthetic";
import { PaperclipRoot } from "./external-state";
import { getPCNode, PCFrame } from "./dsl";
import {
  pcSyntheticFrameRendered,
  pcDependencyLoaded,
  pcSyntheticFrameContainerCreated,
  PC_SYNTHETIC_FRAME_CONTAINER_CREATED,
  PC_SYNTHETIC_FRAME_RENDERED,
  pcSyntheticFrameContainerDestroyed
} from "./actions";
import {
  SyntheticNativeNodeMap,
  renderDOM,
  patchDOM,
  computeDisplayInfo
} from "./dom-renderer";
import { KeyValue } from "tandem-common";
import { Dependency, DependencyGraph } from "./graph";
import { loadEntry, FileLoader } from "./loader";
import { diffSyntheticNode } from "./ot";

// TODO - remote renderer here (Browsertap)

export type PaperclipSagaOptions = {
  openFile: FileLoader;
};

export const createPaperclipSaga = ({ openFile }: PaperclipSagaOptions) =>
  function* paperclipSaga() {
    yield fork(nativeRenderer);
    yield fork(dependencyLoader);

    function* nativeRenderer() {
      yield fork(function* captureFrameChanges() {
        let currFrames: KeyValue<SyntheticFrame>;
        while (1) {
          yield take(
            action =>
              action.type !== PC_SYNTHETIC_FRAME_CONTAINER_CREATED &&
              action.type !== PC_SYNTHETIC_FRAME_RENDERED
          );
          const {
            paperclip: { syntheticFrames, graph }
          }: PaperclipRoot = yield select();
          if (syntheticFrames == currFrames) {
            continue;
          }

          const prevFrames = currFrames;
          currFrames = syntheticFrames;

          for (const sourceFrameId in currFrames) {
            const sourceFrame = getPCNode(sourceFrameId, graph) as PCFrame;
            const currFrame = currFrames[sourceFrameId];
            const prevFrame = prevFrames[sourceFrameId];

            // if navigator is present, then we want to point to a remote renderer
            if (
              sourceFrame.navigator ||
              (prevFrame && prevFrame === currFrame)
            ) {
              continue;
            }

            yield fork(renderFrame, sourceFrameId, currFrame, prevFrame, graph);
          }
        }
      });

      const frameNodeMap: KeyValue<SyntheticNativeNodeMap> = {};

      function* renderFrame(
        sourceFrameId: string,
        newFrame: SyntheticFrame,
        oldFrame: SyntheticFrame,
        graph: DependencyGraph
      ) {
        let container: HTMLIFrameElement = newFrame.$container;

        if (!container) {
          container = createContainer();

          // notify of the new container
          yield put(pcSyntheticFrameContainerCreated(newFrame, container));

          // wait until it's been mounted, then continue
          const doneChan = eventChannel(emit => {
            const onDone = event => {
              container.removeEventListener("load", onDone);
              emit(event);
            };
            container.addEventListener("load", onDone);
            return () => {};
          });
          yield take(doneChan);

          yield spawn(function*() {
            const unloadedChan = eventChannel(emit => {
              const onUnload = event => {
                container.contentWindow.removeEventListener("unload", onUnload);
                emit(event);
              };
              container.contentWindow.addEventListener("unload", onUnload);
              return () => {};
            });
            yield take(unloadedChan);
            yield put(pcSyntheticFrameContainerDestroyed(newFrame));
          });
        } else if (oldFrame.root === newFrame.root) {
          return;
        }

        const body = container.contentDocument.body;

        if (!oldFrame || oldFrame.$container !== container) {
          yield put(
            pcSyntheticFrameRendered(
              newFrame,
              computeDisplayInfo(
                (frameNodeMap[sourceFrameId] = renderDOM(
                  body,
                  newFrame.root,
                  graph
                ))
              )
            )
          );
        } else {
          const ots = diffSyntheticNode(oldFrame.root, newFrame.root);
          yield put(
            pcSyntheticFrameRendered(
              newFrame,
              computeDisplayInfo(
                (frameNodeMap[sourceFrameId] = patchDOM(
                  ots,
                  oldFrame.root,
                  graph,
                  body,
                  frameNodeMap[sourceFrameId]
                ))
              )
            )
          );
        }
      }
    }

    function* dependencyLoader() {
      let prevUri: string;

      // TODO - queue uris here
      while (1) {
        yield take();
        const {
          paperclip: { openDependencyUri, graph }
        }: PaperclipRoot = yield select();
        if (!openDependencyUri || openDependencyUri === prevUri) {
          continue;
        }

        prevUri = openDependencyUri;

        const { entry, graph: newGraph } = yield call(
          loadEntry,
          openDependencyUri,
          {
            graph,
            openFile
          }
        );

        yield put(pcDependencyLoaded(entry.uri, newGraph));
      }
    }
  };

const createContainer = () => {
  if (typeof window === "undefined") return null;
  const container = document.createElement("iframe");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.background = "transparent";
  container.addEventListener("load", () => {
    container.contentDocument.body.style.margin = "0";
  });
  return container;
};

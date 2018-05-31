import { eventChannel } from "redux-saga";
import { take, fork, select, call, put, spawn } from "redux-saga/effects";
import { getPCNode, PCFrame } from "./dsl";
import {
  pcSyntheticFrameRendered,
  pcDependencyLoaded,
  pcSyntheticFrameContainerCreated,
  PC_SYNTHETIC_FRAME_CONTAINER_CREATED,
  PC_SYNTHETIC_FRAME_RENDERED
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
import { SyntheticFrame } from "./synthetic";
import { PCState } from "./state";

// TODO - remote renderer here (Browsertap)

// TODO - need to have special getState() function here in the
// future to sandbox this saga from clobbering other state
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
          const { syntheticFrames, graph }: PCState = yield select();

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

            yield call(
              renderContainer,
              sourceFrameId,
              currFrame,
              prevFrame,
              graph
            );
          }

          yield call(
            () => new Promise(resolve => requestAnimationFrame(resolve))
          );
        }
      });

      const initedFrames = {};

      function* renderContainer(
        sourceFrameId: string,
        newFrame: SyntheticFrame,
        oldFrame: SyntheticFrame,
        graph: DependencyGraph
      ) {
        if (!initedFrames[sourceFrameId]) {
          initedFrames[sourceFrameId] = 1;
          yield spawn(initContainer, newFrame, graph);
        } else {
          yield call(patchContainer, newFrame, oldFrame, graph);
        }
      }
    }

    const frameNodeMap: KeyValue<SyntheticNativeNodeMap> = {};

    function* initContainer(frame: SyntheticFrame, graph: DependencyGraph) {
      const container = createContainer();

      // notify of the new container
      yield put(pcSyntheticFrameContainerCreated(frame, container));
      yield call(watchContainer, container, frame.source.nodeId, graph);
    }

    // FIXME: This produces memory leaks when frames are removed from the store.
    function* watchContainer(container: HTMLElement, frameSourceId: string) {
      const iframe = container.children[0] as HTMLIFrameElement;
      // wait until it's been mounted, then continue
      const eventChan = eventChannel(emit => {
        const onUnload = () => {
          iframe.contentWindow.removeEventListener("unload", onUnload);
          resetContainer(container);
          emit("unload");
        };
        const onDone = () => {
          iframe.contentWindow.addEventListener("unload", onUnload);
          iframe.removeEventListener("load", onDone);
          emit("load");
        };

        iframe.addEventListener("load", onDone);
        if (iframe.contentDocument && iframe.contentDocument.body) {
          setImmediate(onDone);
        }

        return () => {};
      });

      while (1) {
        const eventType = yield take(eventChan);
        if (eventType === "load") {
          const state: PCState = yield select();
          const frame = state.syntheticFrames[frameSourceId];
          const graph = state.graph;
          const body = iframe.contentDocument.body;
          yield put(
            pcSyntheticFrameRendered(
              frame,
              computeDisplayInfo(
                (frameNodeMap[frame.source.nodeId] = renderDOM(
                  body,
                  frame.root
                ))
              )
            )
          );
        } else if (eventType === "unload") {
          break;
        }
      }

      yield call(watchContainer, container, frameSourceId);
    }

    function* patchContainer(
      newFrame: SyntheticFrame,
      oldFrame: SyntheticFrame
    ) {
      if (
        newFrame.root === oldFrame.root &&
        newFrame.bounds === oldFrame.bounds
      ) {
        return;
      }
      const container: HTMLElement = newFrame.$container;
      const iframe = container.children[0] as HTMLIFrameElement;
      const body = iframe.contentDocument && iframe.contentDocument.body;
      if (!body) {
        return;
      }

      if (oldFrame.root !== newFrame.root) {
        // console.log(JSON.stringify(oldFrame.root, null, 2));
        // console.log(JSON.stringify(newFrame.root, null, 2));
        const ots = diffSyntheticNode(oldFrame.root, newFrame.root);
        frameNodeMap[newFrame.source.nodeId] = patchDOM(
          ots,
          oldFrame.root,
          body,
          frameNodeMap[newFrame.source.nodeId]
        );
      }

      yield put(
        pcSyntheticFrameRendered(
          newFrame,
          computeDisplayInfo(frameNodeMap[newFrame.source.nodeId])
        )
      );
    }

    function* dependencyLoader() {
      let prevUri: string;

      // TODO - queue uris here
      while (1) {
        yield take();
        const { openDependencyUri, graph }: PCState = yield select();
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
  const container = document.createElement("div");
  container.appendChild(createIframe());
  return container;
};

const resetContainer = (container: HTMLElement) => {
  container.removeChild(container.children[0]);
  container.appendChild(createIframe());
};

const createIframe = () => {
  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.background = "transparent";
  iframe.addEventListener("load", () => {
    iframe.contentDocument.body.style.margin = "0";
  });
  return iframe;
};

import { eventChannel } from "redux-saga";
import { take, fork, select, call, put, spawn } from "redux-saga/effects";
import { getPCNode } from "./dsl";
import {
  pcFrameRendered,
  pcDependencyLoaded,
  pcFrameContainerCreated,
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
import { diffSyntheticVisibleNode } from "./ot";
import { PCEditorState, Frame } from "./edit";
import {
  getSyntheticVisibleNodeById,
  SyntheticDocument,
  SyntheticVisibleNode
} from "./synthetic";

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
        let currFrames: Frame[];
        let currDocuments: SyntheticDocument[];
        while (1) {
          yield take(
            action =>
              action.type !== PC_SYNTHETIC_FRAME_CONTAINER_CREATED &&
              action.type !== PC_SYNTHETIC_FRAME_RENDERED
          );
          const { documents, frames, graph }: PCEditorState = yield select();

          if (frames == currFrames) {
            continue;
          }

          const prevFrames = currFrames;
          const prevDocuments = currDocuments;
          currFrames = frames;
          currDocuments = documents;

          for (const currFrame of currFrames) {
            const contentNode = getSyntheticVisibleNodeById(
              currFrame.contentNodeId,
              documents
            );
            const prevContentNode = getSyntheticVisibleNodeById(
              currFrame.contentNodeId,
              prevDocuments
            );

            // if navigator is present, then we want to point to a remote renderer
            if (contentNode && prevContentNode === contentNode) {
              continue;
            }

            yield call(
              renderContainer,
              currFrame,
              contentNode,
              prevContentNode,
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
        frame: Frame,
        newContentNode: SyntheticVisibleNode,
        oldContentNode: SyntheticVisibleNode,
        graph: DependencyGraph
      ) {
        if (!initedFrames[frame.contentNodeId] || !oldContentNode) {
          initedFrames[frame.contentNodeId] = 1;
          yield spawn(initContainer, frame, graph);
        } else {
          yield call(
            patchContainer,
            frame,
            newContentNode,
            oldContentNode,
            graph
          );
        }
      }
    }

    const frameNodeMap: KeyValue<SyntheticNativeNodeMap> = {};

    function* initContainer(frame: Frame, graph: DependencyGraph) {
      const container = createContainer();

      // notify of the new container
      yield put(pcFrameContainerCreated(frame, container));
      yield call(watchContainer, container, frame, graph);
    }

    // FIXME: This produces memory leaks when frames are removed from the store.
    function* watchContainer(container: HTMLElement, frame: Frame) {
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
          const state: PCEditorState = yield select();
          const contentNode = getSyntheticVisibleNodeById(
            frame.contentNodeId,
            state.documents
          );
          const graph = state.graph;
          const body = iframe.contentDocument.body;
          yield put(
            pcFrameRendered(
              frame,
              computeDisplayInfo(
                (frameNodeMap[frame.contentNodeId] = renderDOM(
                  body,
                  contentNode
                ))
              )
            )
          );
        } else if (eventType === "unload") {
          break;
        }
      }

      yield call(watchContainer, container, frame);
    }

    function* patchContainer(
      frame: Frame,
      newContentNode: SyntheticVisibleNode,
      oldContentNode: SyntheticVisibleNode
    ) {
      if (newContentNode === oldContentNode) {
        return;
      }
      const container: HTMLElement = frame.$container;
      const iframe = container.children[0] as HTMLIFrameElement;
      const body = iframe.contentDocument && iframe.contentDocument.body;
      if (!body) {
        return;
      }

      if (oldContentNode !== newContentNode) {
        const ots = diffSyntheticVisibleNode(oldContentNode, newContentNode);
        frameNodeMap[frame.contentNodeId] = patchDOM(
          ots,
          oldContentNode,
          body,
          frameNodeMap[frame.contentNodeId]
        );
      }

      yield put(
        pcFrameRendered(
          frame,
          computeDisplayInfo(frameNodeMap[frame.contentNodeId])
        )
      );
    }

    function* dependencyLoader() {
      let prevUri: string;

      // TODO - queue uris here
      while (1) {
        yield take();
        const { openDependencyUri, graph }: PCEditorState = yield select();
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
  iframe.style.background = "white";
  iframe.addEventListener("load", () => {
    iframe.contentDocument.body.style.margin = "0";
  });
  return iframe;
};

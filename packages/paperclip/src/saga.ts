import { eventChannel } from "redux-saga";
import { take, fork, select, call, put, spawn } from "redux-saga/effects";
import { getPCNode } from "./dsl";
import {
  pcFrameRendered,
  pcDependencyGraphLoaded,
  pcFrameContainerCreated,
  PC_SYNTHETIC_FRAME_CONTAINER_CREATED,
  PC_SYNTHETIC_FRAME_RENDERED,
  pcSourceFileUrisReceived
} from "./actions";
import {
  SyntheticNativeNodeMap,
  renderDOM,
  patchDOM,
  computeDisplayInfo
} from "./dom-renderer";
import { KeyValue } from "tandem-common";
import { difference, values } from "lodash";
import {
  Dependency,
  DependencyGraph,
  addFileCacheToDependencyGraph
} from "./graph";
import { loadEntry, FileLoader } from "./loader";
import { diffSyntheticNode } from "./ot";
import { PCEditorState, Frame, getFrameByContentNodeId } from "./edit";
import {
  getSyntheticNodeById,
  SyntheticDocument,
  SyntheticVisibleNode
} from "./synthetic";
import {
  FS_SANDBOX_ITEM_LOADED,
  FSSandboxItemLoaded,
  FSSandboxRootState,
  FileCache,
  FileCacheItemStatus
} from "fsbox";
import { PAPERCLIP_MIME_TYPE } from ".";

export type PaperclipSagaOptions = {
  getPaperclipUris(): Promise<string[]>;
};

export const createPaperclipSaga = ({
  getPaperclipUris
}: PaperclipSagaOptions) =>
  function* paperclipSaga() {
    yield fork(nativeRenderer);
    // yield fork(dependencyLoader);
    yield fork(loadPaperclipFiles);

    function* loadPaperclipFiles() {
      const paperclipUris = yield call(getPaperclipUris);
      yield put(pcSourceFileUrisReceived(paperclipUris));
    }

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
            const contentNode = getSyntheticNodeById(
              currFrame.contentNodeId,
              documents
            );
            const prevContentNode = getSyntheticNodeById(
              currFrame.contentNodeId,
              prevDocuments
            );

            const oldFrame = getFrameByContentNodeId(
              currFrame.contentNodeId,
              prevFrames
            );

            // if navigator is present, then we want to point to a remote renderer
            if (
              contentNode &&
              prevContentNode === contentNode &&
              currFrame === oldFrame
            ) {
              continue;
            }

            yield call(
              renderContainer,
              currFrame,
              oldFrame,
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
        newFrame: Frame,
        oldFrame: Frame,
        newContentNode: SyntheticVisibleNode,
        oldContentNode: SyntheticVisibleNode,
        graph: DependencyGraph
      ) {
        if (!initedFrames[newFrame.contentNodeId] || !oldContentNode) {
          initedFrames[newFrame.contentNodeId] = 1;
          yield spawn(initContainer, newFrame, graph);
        } else {
          yield call(
            patchContainer,
            newFrame,
            oldFrame,
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
          const contentNode = getSyntheticNodeById(
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
      newFrame: Frame,
      oldFrame: Frame,
      newContentNode: SyntheticVisibleNode,
      oldContentNode: SyntheticVisibleNode
    ) {
      if (newContentNode === oldContentNode && newFrame === oldFrame) {
        return;
      }
      const container: HTMLElement = newFrame.$container;
      const iframe = container.children[0] as HTMLIFrameElement;
      const body = iframe.contentDocument && iframe.contentDocument.body;
      if (!body) {
        return;
      }

      if (oldContentNode !== newContentNode) {
        const ots = diffSyntheticNode(oldContentNode, newContentNode);
        frameNodeMap[newFrame.contentNodeId] = patchDOM(
          ots,
          oldContentNode,
          body,
          frameNodeMap[newFrame.contentNodeId]
        );
      }

      yield put(
        pcFrameRendered(
          newFrame,
          computeDisplayInfo(frameNodeMap[newFrame.contentNodeId])
        )
      );
    }

    function* dependencyLoader() {
      let prevUri: string;

      let prevCache: FileCache;
      // TODO - queue uris here
      while (1) {
        yield take();
        const {
          fileCache,
          graph
        }: FSSandboxRootState & PCEditorState = yield select();
        if (prevCache === fileCache) {
          continue;
        }

        // const paperclipFiles = fileCache

        const updatedFiles = difference(
          values(fileCache),
          values(prevCache)
        ).filter(file => file.mimeType === PAPERCLIP_MIME_TYPE);

        if (!updatedFiles.length) {
          continue;
        }

        prevCache = fileCache;
        prevCache = fileCache;
        // const { graph }: PCEditorState = yield select();
        // if (!openDependencyUri || openDependencyUri === prevUri) {
        //   continue;
        // }

        // prevUri = openDependencyUri;

        yield put(
          pcDependencyGraphLoaded(
            addFileCacheToDependencyGraph(fileCache, graph)
          )
        );
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

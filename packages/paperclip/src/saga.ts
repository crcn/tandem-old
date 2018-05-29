import { take, fork, select, call, put } from "redux-saga/effects";
import { SyntheticFrame, PaperclipState } from "./synthetic";
import { PaperclipRoot } from "./external-state";
import { getPCNode, PCFrame } from "./dsl";
import { pcSyntheticFrameRendered, pcDependencyLoaded } from "./actions";
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
          yield take();
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
              !prevFrame ||
              sourceFrame.navigator ||
              prevFrame.root === currFrame.root
            ) {
              continue;
            }

            yield call(renderFrame, sourceFrameId, currFrame, prevFrame, graph);
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
        const container = newFrame.$container || createContainer();
        const body = container.contentDocument.body;
        if (!oldFrame) {
          yield put(
            pcSyntheticFrameRendered(
              newFrame,
              container,
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
              container,
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
  container.style.border = "none";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.background = "transparent";
  container.addEventListener("load", () => {
    Object.assign(container.contentDocument.body.style, {
      padding: 0,
      margin: 0
    });
  });
  return container;
};

import { createQueue } from "mesh";
import { eventChannel, delay } from "redux-saga";
import { difference, debounce, values, uniq } from "lodash";
import { cancel, fork, take, put, call, spawn, actionChannel, select } from "redux-saga/effects";


import {
  htmlContentEditorSaga
} from "./html-content-editor";

import {
  getSyntheticAppliedCSSRules,
  convertAbsoluteBoundsToRelative,
} from "../utils";

import {
  fileEditorSaga
} from "./file-editor";


import { 
  SYNTHETIC_WINDOW_SCROLL,
  SyntheticWindowScroll,
  syntheticWindowScroll,
  OPEN_SYNTHETIC_WINDOW,
  SyntheticWindowScrolled,
  syntheticWindowScrolled,
  SYNTHETIC_WINDOW_SCROLLED,
  deferApplyFileMutationsRequest,
  NODE_VALUE_STOPPED_EDITING,
  SYNTHETIC_WINDOW_LOADED,
  SYNTHETIC_WINDOW_CLOSED,
  SYNTHETIC_WINDOW_PROXY_OPENED,
  syntheticWindowMoved,
  syntheticWindowClosed,
  SYNTHETIC_WINDOW_OPENED,
  SyntheticNodeValueStoppedEditing,
  fetchedContent,
  syntheticWindowProxyOpened,
  SyntheticNodeTextContentChanged,
  syntheticWindowOpened,
  SyntheticWindowSourceChanged,
  syntheticWindowLoaded,
  syntheticWindowChanged,
  FILE_CONTENT_CHANGED,
  FileContentChanged,
  syntheticWindowRectsUpdated,
  OpenSyntheticBrowserWindow,
  ToggleCSSDeclarationProperty,
  TOGGLE_CSS_DECLARATION_PROPERTY,
  SyntheticWindowOpened,
  syntheticWindowResized,
  syntheticWindowResourceChanged,
  SYNTHETIC_NODE_TEXT_CONTENT_CHANGED,
  NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
  fetchRequest,
  FetchRequest,
  FETCH_REQUEST,
  syntheticWindowResourceLoaded,
  newSyntheticWindowEntryResolved
} from "../actions";

import { 
  watch,
  REMOVED,
  Removed,
  STOPPED_MOVING,
  request,
  shiftBounds,
  moveBounds,
  roundBounds,
  createRequestResponse,
  Resized,
  takeRequest, 
  Moved,
  Bounds,
  Point,
  TargetSelector,
  generateDefaultId,
  pointToBounds,
  MOVED,
  RESIZED,
} from "aerial-common2";

import { Mutation, Mutator, SetValueMutation, SetPropertyMutation, createPropertyMutation, createSetValueMutation, eachArrayValueMutation, RemoveChildMutation, createStringMutation } from "source-mutation";

import {
  createSyntheticComment,
  createSyntheticDocument,
  createSyntheticElement,
  createSyntheticTextNode,
  SyntheticNode,
  SyntheticParentNode,
  SyntheticElement,
  SyntheticTextNode,
  SyntheticCSSStyleDeclaration,
  SyntheticCSSStyleRule,
  SyntheticBrowserRootState,
  isSyntheticNodeType,
  SYNTHETIC_ELEMENT,
  SYNTHETIC_CSS_STYLE_RULE,
  getSyntheticBrowserBounds,
  SyntheticComment,
  getSyntheticNodeById,
  SyntheticDocument,
  BasicValueNode,
  SyntheticWindow,
  SyntheticBrowser,
  getSyntheticWindow,
  getSyntheticBrowser,
  getSyntheticBrowsers,
} from "../state";

import {
  diffWindow,
  diffDocument,
  patchWindow,
  SEnvNodeTypes,
  mirrorWindow,
  SEnvNodeInterface,
  SEnvTextInterface,
  getSEnvEventClasses,
  SEnvWindowInterface,
  SEnvWindowContext,
  getSEnvWindowClass,
  SEnvElementInterface,
  SEnvCommentInterface,
  SyntheticDOMRenderer,
  cssStyleRuleSetStyle,
  SEnvDocumentInterface,
  waitForDocumentComplete,
  SyntheticMirrorRenderer,
  SEnvHTMLElementInterface,
  SEnvCSSStyleRuleInterface,
  flattenWindowObjectSources,
  cssStyleRuleSetStyleProperty,
  SyntheticWindowRendererEvent,
  createUpdateValueNodeMutation,
  SEnvWindowOpenedEventInterface,
  openSyntheticEnvironmentWindow,
  createSetElementAttributeMutation,
  SEnvCSSStyleDeclarationInterface,
  createSyntheticDOMRendererFactory,
  calculateUntransformedBoundingRect,
  createSetElementTextContentMutation,
  createParentNodeRemoveChildMutation,
} from "../environment";

export function* syntheticBrowserSaga() {
  yield fork(htmlContentEditorSaga);
  yield fork(fileEditorSaga);
  yield fork(handleToggleCSSProperty);
  yield fork(handleOpenSyntheticWindow);
  yield fork(handleOpenedSyntheticWindow);
  yield fork(handleOpenedSyntheticProxyWindow);
  yield fork(handleFetchRequests);
}

function* handleOpenSyntheticWindow() {
  while(true) {
    const request = (yield take((action: OpenSyntheticBrowserWindow) => action.type === OPEN_SYNTHETIC_WINDOW)) as OpenSyntheticBrowserWindow;
    const instance = (yield call(openSyntheticWindowEnvironment, request.state, request.syntheticBrowserId)) as SEnvWindowInterface;
  }
}

function* openSyntheticWindowEnvironment({ $id: windowId = generateDefaultId(), location, bounds, scrollPosition }: SyntheticWindow, browserId) {

  let main: SEnvWindowInterface;
  const documentId = generateDefaultId();
  const fetch = yield getFetch();
  const { apiHost }: SyntheticBrowserRootState = yield select();

  let currentWindow: SEnvWindowInterface;

  const reloadChan = yield eventChannel((emit) => {

    const reload = (bounds?: Bounds) => {
      if (currentWindow) {
        currentWindow.dispose();
      }
      const SEnvWindow = getSEnvWindowClass({ 
        console: getSEnvWindowConsole(), 
        fetch, 
        reload: () => reload(),
        getProxyUrl: (url: string) => {
          return apiHost && url.substr(0, 5) !== "data:" && url.indexOf(window.location.host) === -1 ? apiHost + "/proxy/" + encodeURIComponent(url) : url;
        },
        createRenderer: (window: SEnvWindowInterface) => {
          return window.top === window ? new SyntheticMirrorRenderer(window) : new SyntheticDOMRenderer(window, document)
        }
      });
      const window = currentWindow = new SEnvWindow(location, browserId);
  
      // ick. Better to use seed function instead to generate UIDs <- TODO.
      window.$id = windowId;
      window.document.$id = documentId;
  
      if (bounds) {
        window.moveTo(bounds.left, bounds.top);
        if (bounds.right) {
          window.resizeTo(bounds.right - bounds.left, bounds.bottom - bounds.top);
        }
      }

      emit(window);

      return window;
    };

    reload(bounds);

    return () => { };
  });

  yield spawn(function*() {
    while(true) {
      yield watchWindowExternalResourceUris(currentWindow, () => currentWindow.location.reload());
      currentWindow.$load();
      yield put(syntheticWindowOpened(currentWindow));
      yield take(reloadChan);
    }
  });
}

function* handleToggleCSSProperty() {
  while(true) {
    const { cssDeclarationId, propertyName, windowId }: ToggleCSSDeclarationProperty = yield take(TOGGLE_CSS_DECLARATION_PROPERTY);
    const state: SyntheticBrowserRootState = yield select();
    const window: SyntheticWindow = getSyntheticWindow(state, windowId);
    const childObjects = flattenWindowObjectSources(window);
    const cssDeclaration = childObjects[cssDeclarationId] as any as SEnvCSSStyleDeclarationInterface;
    cssDeclaration.toggle(propertyName);
  }
};

const PADDING = 10;

function* getBestWindowPosition(browserId: string, filter?: (window: SyntheticWindow) => boolean) {
  const state: SyntheticBrowserRootState = yield select();
  const browser = getSyntheticBrowser(state, browserId);
  const entireBounds = getSyntheticBrowserBounds(browser, filter);
  return {
    left: entireBounds.right ? entireBounds.right + PADDING : 0,
    top: entireBounds.top
  }
};

const getSEnvWindowConsole = () => ({
  warn(...args) {
    console.warn('VM ', ...args);
  },
  log(...args) {
    console.log('VM ', ...args);
  },
  error(...args) {
    console.error('VM ', ...args);
  },
  debug(...args) {
    console.debug('VM ', ...args);
  },
  info(...args) {
    console.info('VM ', ...args);
  }
} as any as Console);

function* watchWindowExternalResourceUris(instance: SEnvWindowInterface, reload: () => any) {

  // watch for changes
  yield spawn(function*() {
    while(true) {
      const { publicPath } = (yield take(FILE_CONTENT_CHANGED)) as FileContentChanged;
      if (instance.externalResourceUris.indexOf(publicPath) !== -1) {
        yield call(reload);
        break;
      }
    }
  });
}

function* handleFetchRequests() {
  let _pending: any = {};
  while(1) {
    const req: FetchRequest = yield take(FETCH_REQUEST);
    const { info } = req;
    const uri = String(info);
    yield spawn(function*() {
      const state: SyntheticBrowserRootState = yield select();

      let p: Promise<any>;
      let emitChange: boolean;

      if (_pending[uri]) {
        p = _pending[uri];
      } else {
        if (state.fileCache && state.fileCache[uri]) {
          p = Promise.resolve(state.fileCache[uri].content);
        } else {
          emitChange = true;
          let curl = uri;
          if (curl.charAt(0) === "/") {
            curl = window.location.protocol + "//" + window.location.host + curl;
          }
      
          if (curl.indexOf(window.location.host) === -1) {
            curl = `${state.apiHost}/proxy/${encodeURIComponent(String(info))}`;
          }
          p = _pending[uri] = new Promise(async (resolve) => {
            const response = await fetch(curl);
            const blob = await response.blob();
            const fr = new FileReader();
            fr.onload = () => {
              resolve(fr.result);
            }
            fr.readAsArrayBuffer(blob);
          });
        }
      }

      const buffer = yield call(p.then.bind(p));
      if (emitChange) {
        yield put(fetchedContent(uri, buffer));
      }
      _pending[uri] = undefined;
      yield put(createRequestResponse(req.$id, buffer));
    });
  }
  
  
}

function* getFetch() {
  const externalResources: string[] = [];
  const fetchQueue = createQueue();
  const state: SyntheticBrowserRootState = yield select();

  yield spawn(function*() {
    while(1) {
      const { value: [info, resolve] } = yield call(fetchQueue.next);
      const buffer = (yield yield request(fetchRequest(info))).payload;
      const text = String.fromCharCode.apply(null, new Uint8Array(buffer));

      resolve({
        text: () => Promise.resolve(text)
      });
    }
  });

  return (info: RequestInfo) => new Promise((resolve, reject) => {
    fetchQueue.unshift([info, resolve]);
  });
}

function* handleOpenedSyntheticWindow() {
  const proxies = new Map<string, [SEnvWindowInterface, () => any]>();
  const createRenderer = createSyntheticDOMRendererFactory(document);

  function* updateProxy(window: SEnvWindowInterface) {
    const containsProxy = proxies.has(window.$id);
    let proxy: SEnvWindowInterface;
    let disposeMirror: () => any;
    if (!containsProxy) {
      proxy = window.clone();
      const position = window.screenLeft || window.screenTop ? { left: window.screenLeft, top: window.screenTop } : (yield call(getBestWindowPosition, window.browserId, (existingWindow: SyntheticWindow) => existingWindow.$id !== window.$id));

      proxy.moveTo(position.left, position.top);
      proxy.resizeTo(window.innerWidth, window.innerHeight);
      proxy.renderer = createRenderer(proxy);
      proxy.renderer.start();

      disposeMirror = () => {};
      yield put(syntheticWindowProxyOpened(proxy));
    } else {
      [proxy, disposeMirror] = proxies.get(window.$id);
    }

    disposeMirror();
    proxies.set(window.$id, [proxy, mirrorWindow(proxy, window)])
  };

  while(true) {
    const { instance } = (yield take(SYNTHETIC_WINDOW_OPENED)) as SyntheticWindowOpened;
    yield call(updateProxy, instance);
  }
}

function* handleOpenedSyntheticProxyWindow() {
  while(true) {
    const { instance } = (yield take(SYNTHETIC_WINDOW_PROXY_OPENED)) as SyntheticWindowOpened;
    const thread = yield spawn(handleSyntheticWindowInstance, instance);
    yield fork(function*() {
      yield take((action: Removed) => action.type === REMOVED && action.itemId === instance.$id);
      yield cancel(thread);
    })
  }
}

function* handleSyntheticWindowInstance(window: SEnvWindowInterface) {
  yield fork(handleSyntheticWindowEvents, window);
  yield fork(handleSyntheticWindowMutations, window);
}

function* handleSyntheticWindowEvents(window: SEnvWindowInterface) {
  const { SEnvMutationEvent, SEnvWindowOpenedEvent, SEnvURIChangedEvent, SEnvWindowEvent } = getSEnvEventClasses(window);

  const chan = eventChannel(function(emit) {
    window.renderer.addEventListener(SyntheticWindowRendererEvent.PAINTED, ({ rects, styles }: SyntheticWindowRendererEvent) => {
      emit(syntheticWindowRectsUpdated(window.$id, rects, styles));
    });
    
    const emitStructChange = debounce(() => {
      emit(syntheticWindowChanged(window));
    }, 0);

    window.addEventListener(SEnvMutationEvent.MUTATION, (event) => {
      if (window.document.readyState !== "complete") return;
      emitStructChange();
    });

    window.addEventListener("move", (event) => {
      emit(syntheticWindowMoved(window));
    });

    window.addEventListener("close", (event) => {

      // TODO - need to properly clean up event listeners here
      emit(syntheticWindowClosed(window));
    });

    window.addEventListener("scroll", (event) => {
      emit(syntheticWindowScrolled(window.$id, {
        left: window.scrollX,
        top: window.scrollY
      }));
    });
    
    window.addEventListener(SEnvURIChangedEvent.URI_CHANGED, ({ uri }: any) => {
      emit(syntheticWindowResourceChanged(uri));
    });

    window.addEventListener("resize", (event) => {
      emit(syntheticWindowResized(window));
    });

    window.addEventListener(SEnvWindowEvent.EXTERNAL_URIS_CHANGED, () => {
      emitStructChange();
    });
    
    window.addEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, (event: SEnvWindowOpenedEventInterface) => {
      emit(syntheticWindowOpened(event.window, window.$id));
    })

    window.addEventListener("scroll", (event) => {
      emit(syntheticWindowScrolled(window.$id, {
        left: window.scrollX,
        top: window.scrollY
      }));
    });

    const triggerLoaded = () => {
      if (window.document.readyState !== "complete") return;
      emit(syntheticWindowLoaded(window));
    };

    window.document.addEventListener("readystatechange", triggerLoaded);
    triggerLoaded();

    return () => { };
  });

  yield fork(function*() {
    while(true) {
      const e = yield take(chan);
      yield spawn(function*() {
        yield put(e);
      })
    }
  });
}

const getTargetStyleOwners = (element: SEnvElementInterface, propertyNames: string[], targetSelectors: TargetSelector[]): {
  [identifier: string]: SEnvHTMLElementInterface | SEnvCSSStyleRuleInterface
} => {

  // find all applied rules
  const appliedRules = getSyntheticAppliedCSSRules(element.ownerDocument.defaultView.struct, element.$id).map(({ rule }) => rule.instance);

  // cascade down style rule list until targets are found (defined in css inspector)
  let targetRules  = appliedRules.filter((rule) => Boolean(targetSelectors.find(({uri, value}) => {
    return rule.source.uri === uri && rule["selectorText"] == value;
  })));

  if (!targetRules.length) {
    targetRules = [appliedRules[0]];
  }

  const ret = {};
  for (const propName of propertyNames) {
    ret[propName] = targetRules.find((rule) => Boolean(rule.style[propName])) || targetRules[0]
  }

  return ret;
};

const createStyleMutation = (target: SEnvElementInterface | SEnvCSSStyleRuleInterface) => {
  if (target.struct.$type === SYNTHETIC_ELEMENT) {
    const element = target as SEnvElementInterface;
    return createSetElementAttributeMutation(element, "style", element.getAttribute("style"));
  } else if (target.struct.$type === SYNTHETIC_CSS_STYLE_RULE) {
    const rule = target as SEnvCSSStyleRuleInterface;
    return cssStyleRuleSetStyle(rule, rule.style);
  }
};

function* handleSyntheticWindowMutations(window: SEnvWindowInterface) {

  const takeWindowAction = (type, test = (action) => action.syntheticWindowId === window.$id) => take((action) => action.type === type && test(action));

  yield fork(function* handleRemoveNode() {
    while(true) {
      const {itemType, itemId}: Removed = (yield take((action: Removed) => action.type === REMOVED && isSyntheticNodeType(action.itemType) && !!flattenWindowObjectSources(window.struct)[action.itemId]));
      const target = flattenWindowObjectSources(window.struct)[itemId] as Node;
      const parent = target.parentNode;
      const removeMutation = createParentNodeRemoveChildMutation(parent, target);

      // remove immediately so that it's reflected in the canvas
      parent.removeChild(target);
      yield yield request(deferApplyFileMutationsRequest(removeMutation));
    }
  });

  yield fork(function* handleMoveNode() {
    while(true) {
      const { itemType, itemId, point, targetSelectors }: Moved = (yield take((action: Moved) => action.type === MOVED && isSyntheticNodeType(action.itemType) && !!flattenWindowObjectSources(window.struct)[action.itemId]));

      // compute based on the data currently in the store
      const syntheticWindow = getSyntheticWindow(yield select(), window.$id);
      const syntheticNode = getSyntheticNodeById(yield select(), itemId);
      
      const originalRect = syntheticWindow.allComputedBounds[syntheticNode.$id];
      const computedStyle = syntheticWindow.allComputedStyles[syntheticNode.$id];

      // TODO - computed boxes MUST also contain the offset of the parent.
      const relativeRect = roundBounds(shiftBounds(convertAbsoluteBoundsToRelative(
        pointToBounds(point),
        syntheticNode as SyntheticElement,
        syntheticWindow
      ), {
        left: -syntheticWindow.bounds.left,
        top: -syntheticWindow.bounds.top
      }));

      const envElement = flattenWindowObjectSources(window.struct)[syntheticNode.$id] as any as SEnvHTMLElementInterface;
      const { top, left, position } = getTargetStyleOwners(envElement, ["top", "left", "position"], targetSelectors);

      // TODO - get best CSS style
      if (computedStyle.position === "static") {
        position.style.setProperty("position", "relative");
      }

      // transitions will foo with dragging, so temporarily
      // disable them

      // TODO - need to fix this -- causes jumpy CSS inspector
      // envElement.style.setProperty("transition", "none");
      left.style.setProperty("left", `${relativeRect.left}px`);
      top.style.setProperty("top", `${relativeRect.top}px`);
    }
  });

  yield fork(function*() {
    while(true) {
      const { syntheticNodeId, textContent } = (yield takeWindowAction(SYNTHETIC_NODE_TEXT_CONTENT_CHANGED)) as SyntheticNodeTextContentChanged;
      const syntheticNode = flattenWindowObjectSources(window.struct)[syntheticNodeId] as SEnvNodeInterface;
      syntheticNode.textContent = textContent;
    }
  }); 

  // TODO: deprecated. changes must be explicit in the editor instead of doing diff / patch work
  // since we may end up editing the wrong node otherwise (CC).
  yield fork(function* handleNodeStoppedEditing() {
    while(true) {
      const { nodeId } = (yield takeWindowAction(NODE_VALUE_STOPPED_EDITING)) as SyntheticNodeValueStoppedEditing;
      const node = flattenWindowObjectSources(window.struct)[nodeId] as any as SEnvHTMLElementInterface;
      const mutation = createSetElementTextContentMutation(node, node.textContent);

      yield request(deferApplyFileMutationsRequest(mutation));
    }
  });

  yield fork(function* handleMoveNodeStopped() {
    while(true) {
      const {itemType, itemId, targetSelectors}: Moved = (yield take((action: Moved) => action.type === STOPPED_MOVING && isSyntheticNodeType(action.itemType) && !!flattenWindowObjectSources(window.struct)[action.itemId]));

      yield spawn(function*() {
        const target = flattenWindowObjectSources(window.struct)[itemId] as any as SEnvHTMLElementInterface;

        // TODO - clear non targets
        const { top, left, position } = getTargetStyleOwners(target, ["top", "left", "position"], targetSelectors);
        const mutations = uniq([top, left, position]).map(createStyleMutation);

        yield yield request(deferApplyFileMutationsRequest(...mutations));
      });
    }
  });

  yield fork(function*() {
    while(true) {
      const { scrollPosition: { left, top }} = (yield takeWindowAction(SYNTHETIC_WINDOW_SCROLL)) as SyntheticWindowScroll;
      window.scrollTo(left, top);
    }
  });

  yield fork(function* handleResized() {
    while(true) {
      const { point } = (yield takeWindowAction(MOVED, (action: Resized) => action.itemId === window.$id)) as Moved;
      window.moveTo(point.left, point.top);
    }
  });

  yield fork(function* handleResized() {
    while(true) {
      const { bounds } = (yield takeWindowAction(RESIZED, (action: Resized) => action.itemId === window.$id)) as Resized;
      window.moveTo(bounds.left, bounds.top);
      window.resizeTo(bounds.right - bounds.left, bounds.bottom - bounds.top);
    }
  });
}

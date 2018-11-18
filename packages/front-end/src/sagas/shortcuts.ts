import {
  fork,
  put,
  take,
  call,
  spawn,
  takeEvery,
  select
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { mapKeys } from "lodash";
import {
  FILE_ITEM_RIGHT_CLICKED,
  FileItemRightClicked,
  fileItemContextMenuDeleteClicked,
  fileItemContextMenuCopyPathClicked,
  fileItemContextMenuOpenClicked,
  fileItemContextMenuRenameClicked,
  CANVAS_RIGHT_CLICKED,
  PC_LAYER_RIGHT_CLICKED,
  PCLayerRightClicked,
  syntheticNodeContextMenuWrapInSlotClicked,
  syntheticNodeContextMenuSelectParentClicked,
  syntheticNodeContextMenuSelectSourceNodeClicked,
  syntheticNodeContextMenuConvertToComponentClicked,
  syntheticNodeContextMenuWrapInElementClicked,
  syntheticNodeContextMenuConvertToStyleMixinClicked,
  syntheticNodeContextMenuRemoveClicked,
  EDITOR_TAB_RIGHT_CLICKED,
  EditorTabClicked,
  editorTabContextMenuOpenInBottomTabOptionClicked,
  syntheticNodeContextMenuConvertTextStylesToMixinClicked,
  syntheticNodeContextMenuRenameClicked,
  syntheticNodeContextMenuShowInCanvasClicked
} from "../actions";
import {
  ContextMenuItem,
  ContextMenuOptionType,
  ContextMenuOption,
  RootState,
  getCanvasMouseTargetNodeIdFromPoint,
  getCanvasMouseTargetNodeId
} from "../state";
import { Point, FSItemTagNames, EMPTY_OBJECT } from "tandem-common";
import {
  getSyntheticNodeById,
  getSyntheticSourceNode,
  PCSourceTagNames,
  getPCNodeContentNode,
  getSyntheticInspectorNode,
  getSyntheticVisibleNodeDocument,
  syntheticNodeIsInShadow,
  getPCNodeModule,
  SyntheticNode,
  getInspectorSyntheticNode,
  inspectorNodeInShadow,
  hasTextStyles
} from "paperclip";

export type ShortcutSagaOptions = {
  openContextMenu: (anchor: Point, options: ContextMenuOption[]) => void;
};

type OpenSyntheticNodeContextMenuOptions = {
  showRenameLabelOption?: boolean;
};

export const createShortcutSaga = ({
  openContextMenu
}: ShortcutSagaOptions) => {
  return function*() {
    yield takeEvery(
      FILE_ITEM_RIGHT_CLICKED,
      function* handleFileItemRightClick({
        event,
        item
      }: FileItemRightClicked) {
        yield call(
          openContextMenu,
          {
            left: event.pageX,
            top: event.pageY
          },
          [
            {
              type: ContextMenuOptionType.GROUP,
              options: [
                {
                  type: ContextMenuOptionType.ITEM,
                  label: "Copy Path",
                  action: fileItemContextMenuCopyPathClicked(item)
                },
                {
                  type: ContextMenuOptionType.ITEM,
                  label:
                    item.name === FSItemTagNames.DIRECTORY
                      ? "Open in Finder"
                      : "Open in Text Editor",
                  action: fileItemContextMenuOpenClicked(item)
                }
              ] as ContextMenuItem[]
            },
            {
              type: ContextMenuOptionType.GROUP,
              options: [
                {
                  type: ContextMenuOptionType.ITEM,
                  label: "Rename",
                  action: fileItemContextMenuRenameClicked(item)
                },
                {
                  type: ContextMenuOptionType.ITEM,
                  label: "Delete",
                  action: fileItemContextMenuDeleteClicked(item)
                }
              ]
            }
          ]
        );
      }
    );

    yield takeEvery(
      EDITOR_TAB_RIGHT_CLICKED,
      function* handleEditorRightClicked({ event, uri }: EditorTabClicked) {
        yield call(
          openContextMenu,
          {
            left: event.pageX,
            top: event.pageY
          },
          [
            {
              type: ContextMenuOptionType.ITEM,
              label: "Open in Bottom Tab",
              action: editorTabContextMenuOpenInBottomTabOptionClicked(uri)
            }
          ]
        );
      }
    );

    yield takeEvery(CANVAS_RIGHT_CLICKED, function* handleFileItemRightClick({
      event,
      item
    }: FileItemRightClicked) {
      const state: RootState = yield select();
      const targetNodeId = getCanvasMouseTargetNodeId(state, event);
      if (targetNodeId) {
        yield call(
          openCanvasSyntheticNodeContextMenu,
          targetNodeId,
          event,
          state
        );
      }
    });

    function* openCanvasSyntheticNodeContextMenu(
      targetNodeId: string,
      event: React.MouseEvent<any>,
      state: RootState
    ) {
      const ownerWindow = (event.nativeEvent.target as HTMLDivElement)
        .ownerDocument.defaultView;
      const parent = ownerWindow.top;
      const ownerIframe = Array.from(
        parent.document.querySelectorAll("iframe")
      ).find((iframe: HTMLIFrameElement) => {
        return iframe.contentDocument === ownerWindow.document;
      });

      const rect = ownerIframe.getBoundingClientRect();

      yield call(
        openSyntheticNodeContextMenu,
        getSyntheticNodeById(targetNodeId, state.documents),
        {
          left: event.pageX + rect.left,
          top: event.pageY + rect.top
        },
        state
      );
    }

    yield takeEvery(PC_LAYER_RIGHT_CLICKED, function* handleFileItemRightClick({
      event,
      item
    }: PCLayerRightClicked) {
      const state: RootState = yield select();
      const node = getInspectorSyntheticNode(item, state.documents);

      // maybe shadow
      if (!node) {
        return;
      }

      yield call(
        openSyntheticNodeContextMenu,
        node,
        {
          left: event.pageX,
          top: event.pageY
        },
        state,
        { showRenameLabelOption: true }
      );
    });

    function* openSyntheticNodeContextMenu(
      node: SyntheticNode,
      point: Point,
      state: RootState,
      {
        showRenameLabelOption
      }: OpenSyntheticNodeContextMenuOptions = EMPTY_OBJECT
    ) {
      const syntheticNode = getSyntheticNodeById(node.id, state.documents);
      const sourceNode = getSyntheticSourceNode(syntheticNode, state.graph);
      const syntheticDocument = getSyntheticVisibleNodeDocument(
        syntheticNode.id,
        state.documents
      );
      const inspectorNode = getSyntheticInspectorNode(
        syntheticNode,
        syntheticDocument,
        state.sourceNodeInspector,
        state.graph
      );
      const contentNode = getPCNodeContentNode(
        sourceNode.id,
        getPCNodeModule(sourceNode.id, state.graph)
      );

      yield call(openContextMenu, point, [
        syntheticNodeIsInShadow(syntheticNode, syntheticDocument, state.graph)
          ? {
              type: ContextMenuOptionType.ITEM,
              label: "Hide",
              action: syntheticNodeContextMenuRemoveClicked(syntheticNode)
            }
          : {
              type: ContextMenuOptionType.GROUP,
              options: [
                showRenameLabelOption
                  ? {
                      type: ContextMenuOptionType.ITEM,
                      label: "Rename",
                      action: syntheticNodeContextMenuRenameClicked(
                        syntheticNode
                      )
                    }
                  : null,
                {
                  type: ContextMenuOptionType.ITEM,
                  label: "Remove",
                  action: syntheticNodeContextMenuRemoveClicked(syntheticNode)
                },
                sourceNode.name !== PCSourceTagNames.COMPONENT &&
                !inspectorNodeInShadow(inspectorNode, state.sourceNodeInspector)
                  ? {
                      type: ContextMenuOptionType.ITEM,
                      label: "Convert to Component",
                      action: syntheticNodeContextMenuConvertToComponentClicked(
                        syntheticNode
                      )
                    }
                  : null,

                sourceNode.name !== PCSourceTagNames.COMPONENT &&
                !inspectorNodeInShadow(inspectorNode, state.sourceNodeInspector)
                  ? {
                      type: ContextMenuOptionType.ITEM,
                      label: "Wrap in Element",
                      action: syntheticNodeContextMenuWrapInElementClicked(
                        syntheticNode
                      )
                    }
                  : null,
                contentNode.name === PCSourceTagNames.COMPONENT &&
                contentNode.id !== sourceNode.id &&
                !inspectorNodeInShadow(inspectorNode, state.sourceNodeInspector)
                  ? {
                      type: ContextMenuOptionType.ITEM,
                      label: "Wrap in Slot",
                      action: syntheticNodeContextMenuWrapInSlotClicked(
                        syntheticNode
                      )
                    }
                  : null,

                sourceNode.name === PCSourceTagNames.COMPONENT ||
                sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE ||
                sourceNode.name === PCSourceTagNames.ELEMENT ||
                sourceNode.name === PCSourceTagNames.TEXT
                  ? {
                      type: ContextMenuOptionType.ITEM,
                      label: "Move All Styles to Mixin",
                      action: syntheticNodeContextMenuConvertToStyleMixinClicked(
                        syntheticNode
                      )
                    }
                  : null,

                (sourceNode.name === PCSourceTagNames.COMPONENT ||
                  sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE ||
                  sourceNode.name === PCSourceTagNames.ELEMENT ||
                  sourceNode.name === PCSourceTagNames.TEXT) &&
                hasTextStyles(
                  inspectorNode,
                  state.sourceNodeInspector,
                  state.selectedVariant,
                  state.graph
                )
                  ? {
                      type: ContextMenuOptionType.ITEM,
                      label: "Move Text Styles to Mixin",
                      action: syntheticNodeContextMenuConvertTextStylesToMixinClicked(
                        syntheticNode
                      )
                    }
                  : null
              ].filter(Boolean) as ContextMenuItem[]
            },
        {
          type: ContextMenuOptionType.GROUP,
          options: [
            contentNode.id !== sourceNode.id
              ? {
                  type: ContextMenuOptionType.ITEM,
                  label: "Select Parent",
                  action: syntheticNodeContextMenuSelectParentClicked(
                    syntheticNode
                  )
                }
              : null,
            {
              type: ContextMenuOptionType.ITEM,
              label: "Select Source Node",
              action: syntheticNodeContextMenuSelectSourceNodeClicked(
                syntheticNode
              )
            },
            {
              type: ContextMenuOptionType.ITEM,
              label: "Show in Canvas",
              action: syntheticNodeContextMenuShowInCanvasClicked(syntheticNode)
            }
          ].filter(Boolean) as ContextMenuItem[]
        }
      ].filter(Boolean) as ContextMenuOption[]);
    }
  };
};

export function* shortcutSaga() {
  // yield fork(handleFileItemRightClick);
  // yield fork(mapHotkeys({
  //   // artboard
  //   "a": wrapDispatch(SHORTCUT_A_KEY_DOWN),
  //   // rectangle
  //   "r": wrapDispatch(SHORTCUT_R_KEY_DOWN),
  //   // text
  //   "t": wrapDispatch(SHORTCUT_T_KEY_DOWN),
  //   // artboard
  //   "escape": wrapDispatch(SHORTCUT_ESCAPE_KEY_DOWN),
  //   // artboard
  //   "backspace": wrapDispatch(SHORTCUT_DELETE_KEY_DOWN)
  // }));
}

const wrapDispatch = (type: string) =>
  function*(sourceEvent) {
    // yield put(shortcutKeyDown(type));
  };

const mapHotkeys = (map: {
  [identifier: string]: (event: KeyboardEvent) => any;
}) =>
  function*() {
    const ordererdMap = mapKeys(map, (value: any, key: string) =>
      key
        .split(" ")
        .sort()
        .join(" ")
    );
    const keysDown: string[] = [];

    const chan = yield eventChannel(emit => {
      document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (keysDown.indexOf(event.key) === -1) {
          keysDown.push(event.key);
        }
        const handler =
          ordererdMap[
            keysDown
              .join(" ")
              .toLocaleLowerCase()
              .split(" ")
              .sort()
              .join(" ")
          ];
        if (handler) {
          emit(call(handler, event));
        }
      });

      document.addEventListener("keyup", (event: KeyboardEvent) => {
        keysDown.splice(keysDown.indexOf(event.key), 1);
      });
      return () => {};
    });

    while (1) {
      const action = yield take(chan);
      yield spawn(function*() {
        yield action;
      });
    }
  };

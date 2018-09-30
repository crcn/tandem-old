import { fork, put, take, call, spawn, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { mapKeys } from "lodash";
import {
  shortcutKeyDown,
  SHORTCUT_DELETE_KEY_DOWN,
  SHORTCUT_ESCAPE_KEY_DOWN,
  FILE_ITEM_RIGHT_CLICKED,
  FileItemRightClicked,
  fileItemContextMenuOpenInFinderClicked,
  fileItemContextMenuDeleteClicked,
  fileItemContextMenuCopyPathClicked,
  fileItemContextMenuOpenTextEditorClicked
} from "../actions";
import { ContextMenuItem, ContextMenuOptionType, ContextMenuOption } from "../state";
import { Point, FSItemTagNames } from "tandem-common";

export type ShortcutSagaOptions = {
  openContextMenu: (anchor: Point, options: ContextMenuOption[]) => void;
}

export const createShortcutSaga = ({ openContextMenu }: ShortcutSagaOptions) => {
  return function*() {
    yield takeEvery(FILE_ITEM_RIGHT_CLICKED, function* handleFileItemRightClick({event, item}: FileItemRightClicked) {
      yield call(openContextMenu, {
        left: event.pageX,
        top: event.pageY
      }, [
        {
          type: ContextMenuOptionType.GROUP,
          options: [
            {
              type: ContextMenuOptionType.ITEM,
              label: "Copy Path",
              action: fileItemContextMenuCopyPathClicked(item)
            },
            item.name === FSItemTagNames.DIRECTORY ? null : {
              type: ContextMenuOptionType.ITEM,
              label: "Open in Text Editor",
              action: fileItemContextMenuOpenTextEditorClicked(item)
            }
          ].filter(Boolean) as ContextMenuItem[]
        },
        {
          type: ContextMenuOptionType.GROUP,
          options: [
            {
              type: ContextMenuOptionType.ITEM,
              label: "Delete",
              action: fileItemContextMenuDeleteClicked(item)
            }
          ]
        }
      ]);

    });
  }
}

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

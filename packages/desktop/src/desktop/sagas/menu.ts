import {Menu, MenuItem, MenuItemConstructorOptions, app} from "electron";
import {fork, put, take} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import { APP_READY, MAIN_WINDOW_OPENED } from "../actions";
import { APP_LOADED, shortcutKeyDown, SHORTCUT_DELETE_KEY_DOWN, SHORTCUT_ESCAPE_KEY_DOWN, SHORTCUT_SAVE_KEY_DOWN, SHORTCUT_UNDO_KEY_DOWN, SHORTCUT_REDO_KEY_DOWN, SHORTCUT_QUICK_SEARCH_KEY_DOWN, SHORTCUT_ZOOM_IN_KEY_DOWN, SHORTCUT_ZOOM_OUT_KEY_DOWN, SHORTCUT_CONVERT_TO_COMPONENT_KEY_DOWN, SHORTCUT_R_KEY_DOWN, SHORTCUT_T_KEY_DOWN } from "tandem-front-end";

export function* shortcutsSaga() {
  yield take(MAIN_WINDOW_OPENED);

  const menu = new Menu();

  const chan = eventChannel((emit) => {
    const tpl: MenuItemConstructorOptions[] = [
      {
        label: app.getName(),
        submenu: [
          {role: "about"},
          {type: "separator"},
          {role: "services", submenu: []},
          {type: "separator"},
          {role: "hide"},
          {role: "hideothers"},
          {role: "unhide"},
          {type: "separator"},
          {role: "quit"},
          {type: "separator" },
          {type: "separator" }
        ]
      },
      {
        label: "Edit",
        submenu: [
          {
            label: "Undo",
            accelerator: "meta+z",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_UNDO_KEY_DOWN));
            }
          },
          {
            label: "Redo",
            accelerator: "meta+y",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_REDO_KEY_DOWN));
            }
          },
          {
            label: "Convert to component",
            accelerator: "alt+c",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_CONVERT_TO_COMPONENT_KEY_DOWN));
            }
          },
          {type: "separator"},
          {role: "cut"},
          {role: "copy"},
          {role: "paste"},
          {role: "pasteandmatchstyle"},
          {
            label: "Delete",
            accelerator: "Backspace",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_DELETE_KEY_DOWN));
            }
          },
          {
            label: "Escape",
            accelerator: "Escape",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_ESCAPE_KEY_DOWN));
            }
          },
          {role: "selectall"}
        ]
      },
      {
        label: "File",
        submenu: [
          {
            label: "Save",
            accelerator: "meta+s",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_SAVE_KEY_DOWN));
            }
          },
          {
            label: "Search",
            accelerator: "meta+t",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_QUICK_SEARCH_KEY_DOWN));
            }
          }
        ]
      },
      {
        label: "Insert",
        submenu: [
          {
            label: "Text",
            accelerator: "t",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_T_KEY_DOWN));
            }
          },
          {
            label: "Div",
            accelerator: "r",
            click: () => {
              emit(shortcutKeyDown(SHORTCUT_R_KEY_DOWN));
            }
          }
        ]
      },


    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},,
        {
          label: "Zoom In",
          accelerator: "meta+=",
          click: (a, window, event) => {
            emit(shortcutKeyDown(SHORTCUT_ZOOM_IN_KEY_DOWN));
          }
        },
        {
          label: "Zoom Out",
          accelerator: "meta+-",
          click: () => {
            emit(shortcutKeyDown(SHORTCUT_ZOOM_OUT_KEY_DOWN));
          }
        },
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));

    return () => {

    };
  })

  while(1) {
    const action = yield take(chan);
    yield put(action);
  }
}


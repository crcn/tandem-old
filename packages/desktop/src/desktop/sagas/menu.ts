import {Menu, MenuItem, MenuItemConstructorOptions, app} from "electron";
import {fork, put, take} from "redux-saga/effects";
import {eventChannel} from "redux-saga";

export function* shortcutsSaga() {
  const menu = new Menu();

  const chan = eventChannel((emit) => {

    const tpl: MenuItemConstructorOptions[] = [
      {
        label: app.getName(),
        submenu: [
          {role: 'about'},
          {type: 'separator'},
          {role: 'services', submenu: []},
          {type: 'separator'},
          {role: 'hide'},
          {role: 'hideothers'},
          {role: 'unhide'},
          {type: 'separator'},
          {role: 'quit'}
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {role: 'undo'},
          {role: 'redo'},
          {type: 'separator'},
          {role: 'cut'},
          {role: 'copy'},
          {role: 'paste'},
          {role: 'pasteandmatchstyle'},
          {role: 'delete'},
          {role: 'selectall'}
        ]
      },
      {
        label: "Insert",
        submenu: [
          {
            label: "Rectangle",
            click: () => {

            }
          }
        ]
      }
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


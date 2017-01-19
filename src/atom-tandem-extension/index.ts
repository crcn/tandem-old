import "reflect-metadata";

import { Status, ISourceLocation, CoreEvent } from "@tandem/common";
import { TextEditorClient, TextEditorClientAdapter } from "tandem-client";

class StatusView {

  readonly element: HTMLElement;
  constructor(readonly client: TextEditorClient) {
    this.element = document.createElement("span");
    this.element.classList.add("icon-zap");
    this.element.innerHTML = " Tandem";
    client.statusPropertyWatcher.connect(this.onStatusChange.bind(this)).trigger();
  }

  private onStatusChange(status: Status) {
    this.element.classList.remove(this.element.classList[0]);
    this.element.classList.add(status.type === Status.COMPLETED ? "icon-zap" : "icon-alert");
  }
}

class AtomTandemAdapter extends TextEditorClientAdapter {
  private _activeTextEditorObserver: any;

  constructor() {
    super();
    atom.workspace.onDidChangeActivePaneItem(this.onDidChangeActivePane.bind(this));
    this.onDidChangeActivePane();
  }
  getCurrentDocumentInfo() {
    const activeTextEditor = atom.workspace.getActiveTextEditor();
    return {
      uri: "file://" + activeTextEditor.getURI(),
      content: activeTextEditor.getText(),
      dirty: activeTextEditor.isModified()
    };
  }

  onActiveTextEditorChange(callback: () => any) {
    this.observe({ dispatch(event) {
      if (event.type === "textEditorChange") {
        callback();
      }
    }});
  }

  onDidChangeTextDocument(callback: () => any) {
    this.observe({ dispatch(event) {
      if (event.type === "textChange") {
        callback();
      }
    }});
  }

  onDidChangeActivePane() {
    if (this._activeTextEditorObserver) this._activeTextEditorObserver.dispose();
    const activeTextEditor = atom.workspace.getActiveTextEditor();
    if (!activeTextEditor) return;
    this.notify(new CoreEvent("textEditorChange"));
    this._activeTextEditorObserver = activeTextEditor.onDidChange((changes) => {
      this.notify(new CoreEvent("textChange"));
    });
  }


  openFile(uri: string, selection: ISourceLocation) {
    return atom.workspace.open(uri, selection ? {
      initialLine: selection.start && selection.start.line,
      initialColumn: selection.start && selection.start.column,
    } : undefined);
  }

  setTextEditorContent(content: string) {
    const activeTextEditor = atom.workspace.getActiveTextEditor();
    activeTextEditor.setText(content);
  }
}

let _client: TextEditorClient;

export const activate = () => {
  _client = new TextEditorClient(new AtomTandemAdapter());


  atom.commands.add("atom-text-editor", {
    "tandem:open-file-in-new-workspace": () => {
      _client.openNewWorkspace(_client.adapter.getCurrentDocumentInfo().uri);
    }
  })
}

export const consumeStatusBar = (statusBar) => {
  const element = document.createElement("span");
  element.innerText = "Hello!!";

  statusBar.addLeftTile({
    item: new StatusView(_client).element
  });
}

export const deactivate = () => {
}

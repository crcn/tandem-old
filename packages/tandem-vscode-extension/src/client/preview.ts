// https://github.com/microsoft/vscode-extension-samples/blob/708bc3090845be767c92b0fe53fe855a0fdca985/webview-sample/src/extension.ts

import {
  window,
  workspace,
  WebviewPanel,
  TextEditor,
  ViewColumn,
  ExtensionContext,
  Uri
} from "vscode";
import { isPaperclipFile } from "./utils";
import * as path from "path";

const VIEW_TYPE = "preview";

export const activate = ({ extensionPath }: ExtensionContext) => {
  let _preview: PCPreview;

  window.registerWebviewPanelSerializer(VIEW_TYPE, {
    async deserializeWebviewPanel(panel: WebviewPanel, state: any) {
      panel.dispose();
    }
  });

  const onTextEditorChange = (editor: TextEditor) => {
    const uri = String(editor.document.uri);
    if (!isPaperclipFile(uri)) {
      if (_preview) {
        _preview.dispose();
        _preview = null;
      }
      return;
    }

    if (_preview) {
      _preview.open(uri);
      return;
    }

    const panel = window.createWebviewPanel(
      VIEW_TYPE,
      "Realtime Preview ⚡️",
      ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [Uri.file(path.join(extensionPath))]
      }
    );

    _preview = new PCPreview(panel, extensionPath);
    _preview.open(uri);
    _preview.updateFile(String(editor.document.uri), editor.document.getText());
  };

  window.onDidChangeActiveTextEditor(onTextEditorChange);

  workspace.onDidChangeTextDocument(editor => {
    if (_preview && isPaperclipFile(String(editor.document.uri))) {
      _preview.updateFile(
        String(editor.document.uri),
        editor.document.getText()
      );
    }
  });

  return {
    dispose() {}
  };
};

class PCPreview {
  constructor(
    readonly panel: WebviewPanel,
    private readonly _extensionPath: string
  ) {
    this.panel.webview.onDidReceiveMessage(this._onMessage);
    this._render();
  }
  open(documentUri: string) {
    this.panel.webview.postMessage({ type: "open", uri: documentUri });
    return this;
  }
  updateFile(uri: string, content: string) {
    this.panel.webview.postMessage({ type: "updateFile", uri, content });
    return this;
  }
  private _render() {
    this.panel.webview.html = this._getHTML();
  }
  private _onMessage = message => {};
  private _getHTML() {
    const scriptPathOnDisk = Uri.file(
      path.join(this._extensionPath, "lib", "preview", "index.js")
    );

    const scriptUri = this.panel.webview.asWebviewUri(scriptPathOnDisk);
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body>
      <script>
        const vscode = acquireVsCodeApi();
      </script>
      <script src="${scriptUri}"></script>
    </body>
    </html>`;
  }
  dispose() {
    this.panel.dispose();
  }
}

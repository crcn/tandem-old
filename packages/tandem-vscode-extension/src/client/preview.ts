// https://github.com/microsoft/vscode-extension-samples/blob/708bc3090845be767c92b0fe53fe855a0fdca985/webview-sample/src/extension.ts

import {
  Uri,
  window,
  workspace,
  TextEditor,
  ViewColumn,
  WebviewPanel,
  ExtensionContext
} from "vscode";
import { isPaperclipFile } from "./utils";
import * as path from "path";
import { Engine, EngineEvent, EngineEventType } from "paperclip";

const VIEW_TYPE = "preview";

export const activate = ({ extensionPath }: ExtensionContext) => {
  let _preview: PCPreview;
  const engine = new Engine();

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
      "Live Preview ⚡️",
      ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [Uri.file(path.join(extensionPath))]
      }
    );

    _preview = new PCPreview(engine, panel, extensionPath);
    _preview.open(uri);
  };

  window.onDidChangeActiveTextEditor(onTextEditorChange);
  if (window.activeTextEditor) {
    onTextEditorChange(window.activeTextEditor);
  }

  workspace.onDidChangeTextDocument(editor => {
    if (_preview && isPaperclipFile(String(editor.document.uri))) {
      engine.updateVirtualFileContent(
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
  private _currentFilePath: string;
  private _disposeEngineListener: () => void;

  constructor(
    private _engine: Engine,
    readonly panel: WebviewPanel,
    private readonly _extensionPath: string
  ) {
    this._disposeEngineListener = this._engine.onEvent(this._onEngineEvent);
    this.panel.webview.onDidReceiveMessage(this._onMessage);
    this._render();
  }
  open(documentUri: string) {
    if (this._currentFilePath) {
      this._engine.stopRuntime(this._currentFilePath);
    }
    this._currentFilePath = documentUri.replace("file://", "");
    this._engine.startRuntime(this._currentFilePath);
    // this.panel.webview.postMessage({ type: "open", uri: documentUri });
    return this;
  }
  private _render() {
    this.panel.webview.html = this._getHTML();
  }
  private _onMessage = message => {};
  private _onEngineEvent = (event: EngineEvent) => {
    if (event.file_path !== this._currentFilePath) {
      return;
    }

    this.panel.webview.postMessage(event);
  };
  private _getHTML() {
    const scriptPathOnDisk = Uri.file(
      path.join(
        this._extensionPath,
        "node_modules",
        "paperclip-web-renderer",
        "dist",
        "browser.js"
      )
    );

    const scriptUri = this.panel.webview.asWebviewUri(scriptPathOnDisk);
    console.log(String(scriptUri));
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
    this._disposeEngineListener();
    this.panel.dispose();
  }
}

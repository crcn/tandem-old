import { Engine, EngineEvent } from "paperclip";
import {
  Uri,
  window,
  commands,
  workspace,
  TextEditor,
  WebviewPanel,
  ExtensionContext,
  ViewColumn
} from "vscode";
import { isPaperclipFile } from "./utils";
import * as path from "path";
import { EventEmitter } from "events";

const VIEW_TYPE = "preview";

enum OpenLivePreviewOptions {
  Yes = "Yes",
  No = "No",
  DontAskMeAgain = "Don't Show Again"
}

type Config = {};

type LivePreviewState = {
  targetFilePath: string;
};

export const activate = (context: ExtensionContext) => {
  const { extensionPath } = context;
  // const config: Config = workspace.getConfiguration("tandem");

  let _previews: {
    [identifier: string]: LivePreview;
  } = {};
  let _dontPromptAgain = false;

  const engine = new Engine();

  const openLivePreview = async (editor: TextEditor) => {
    const paperclipUri = String(editor.document.uri);

    // do not prompt is preview already open
    if (_previews[paperclipUri]) {
      return window.showErrorMessage(`A live preview is already open`);
    }

    const panel = window.createWebviewPanel(
      VIEW_TYPE,
      `⚡️ ${path.basename(paperclipUri)}`,
      ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [Uri.file(path.join(extensionPath))]
      }
    );

    registerLivePreview(
      new LivePreview(engine, panel, extensionPath, paperclipUri)
    );
  };

  const registerLivePreview = (preview: LivePreview) => {
    _previews[preview.targetFilePath] = preview;
    let disposeListener = preview.onDidDispose(() => {
      delete _previews[preview.targetFilePath];
      disposeListener();
    });
  };

  const askToDisplayLivePreview = async (editor: TextEditor) => {
    // TODO - figure out whether it's possible to scan tabs for states. Or at least
    // file paths associated with them. Or possible whether they're part of Tandem.

    // There's the possibility that a preview window for this file is already open, but hidden.
    // In that case it won't be deserialized and added to _previews, so we need to limit the behavior to
    // ensure they're not asked again.
    if (Object.keys(_previews).length) {
      return;
    }

    if (_dontPromptAgain) {
      return;
    }

    const option = await window.showInformationMessage(
      `Would you like to open a live preview? Command: "Open Live Preview" is also available. `,
      OpenLivePreviewOptions.Yes,
      OpenLivePreviewOptions.No,
      OpenLivePreviewOptions.DontAskMeAgain
    );

    if (option === OpenLivePreviewOptions.Yes) {
      openLivePreview(editor);
    } else if (option === OpenLivePreviewOptions.DontAskMeAgain) {
      _dontPromptAgain = true;
    }
  };

  const onTextEditorChange = (editor: TextEditor) => {
    const uri = String(editor.document.uri);
    if (isPaperclipFile(uri)) {
      askToDisplayLivePreview(editor);
    }
  };

  window.registerWebviewPanelSerializer(VIEW_TYPE, {
    async deserializeWebviewPanel(
      panel: WebviewPanel,
      { targetFilePath }: LivePreviewState
    ) {
      registerLivePreview(
        new LivePreview(engine, panel, extensionPath, targetFilePath)
      );
    }
  });

  setTimeout(() => {
    window.onDidChangeActiveTextEditor(onTextEditorChange);
    if (window.activeTextEditor) {
      onTextEditorChange(window.activeTextEditor);
    }
  }, 500);

  workspace.onDidChangeTextDocument(editor => {
    engine.updateVirtualFileContent(
      String(editor.document.uri),
      editor.document.getText()
    );
  });

  commands.registerCommand("tandem.openPreview", () => {
    if (window.activeTextEditor) {
      if (isPaperclipFile(String(window.activeTextEditor.document.uri))) {
        openLivePreview(window.activeTextEditor);
      } else {
        window.showErrorMessage(
          `Only Paperclip (.pc) are supported in Live Preview`
        );
      }
    }
  });
};

class LivePreview {
  private _em: EventEmitter;
  private _disposeEngineListener: () => void;
  public readonly targetFilePath: string;

  constructor(
    private _engine: Engine,
    readonly panel: WebviewPanel,
    private readonly _extensionPath: string,
    targetFilePath: string
  ) {
    this._em = new EventEmitter();
    this.targetFilePath = targetFilePath;
    this._disposeEngineListener = this._engine.onEvent(this._onEngineEvent);
    this.panel.webview.onDidReceiveMessage(this._onMessage);
    this._render();
    panel.onDidDispose(this._onPanelDispose);
    panel.onDidChangeViewState(() => {
      // Need to re-render when the panel becomes visible
      if (panel.visible) {
        this._render();

        // panel content is disposed of, so eliminate the extra work
      } else {
        this._engine.stopRuntime(targetFilePath);
      }
    });
  }
  getState(): LivePreviewState {
    return {
      targetFilePath: this.targetFilePath
    };
  }
  blink() {}
  private _render() {
    // calling startEngine multiple times by the way just restarts it
    this._engine.startRuntime(this.targetFilePath);
    this.panel.webview.html = this._getHTML();
  }
  private _onPanelDispose = () => {
    this.dispose();
  };
  public onDidDispose(listener: () => void) {
    this._em.on("didDispose", listener);
    return () => {
      this._em.removeListener("didDispose", listener);
    };
  }
  private _onMessage = () => {
    // TODO when live preview tools are available
  };
  private _onEngineEvent = (event: EngineEvent) => {
    console.log(event);
    if (event.file_path !== stripFileProtocol(this.targetFilePath)) {
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
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body>
      <script>
        const vscode = acquireVsCodeApi();
        vscode.setState(${JSON.stringify(this.getState())});
      </script>
      <script src="${scriptUri}"></script>
    </body>
    </html>`;
  }
  dispose() {
    this._disposeEngineListener();
    this.panel.dispose();
    this._em.emit("didDispose");
  }
}

const stripFileProtocol = (filePath: string) => filePath.replace("file://", "");

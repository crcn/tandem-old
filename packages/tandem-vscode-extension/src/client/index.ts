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
  No = "No"
}

type LivePreviewState = {
  targetFilePath: string;
};

export const activate = (context: ExtensionContext) => {
  const { extensionPath } = context;

  let _previews: {
    [identifier: string]: LivePreview;
  } = {};
  let _showedOpenLivePreviewPrompt = false;

  const engine = new Engine();

  const openLivePreview = async (editor: TextEditor) => {
    const paperclipUri = String(editor.document.uri);

    // NOTE - don't get in the way of opening the live preview since
    // there's really no way to tell whether an existing tab is open which will
    // happen when the app loads with existing live preview tabs.

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

  /**
   * This really just provides a lower barrier to entry -- prompts once with
   * info about the command, then disappear
   */

  const askToDisplayLivePreview = async (editor: TextEditor) => {
    if (_showedOpenLivePreviewPrompt || Object.keys(_previews).length) {
      return;
    }

    _showedOpenLivePreviewPrompt = true;

    const option = await window.showInformationMessage(
      `Would you like to open a live preview? Command: "Open Live Preview" is also available. `,
      OpenLivePreviewOptions.Yes,
      OpenLivePreviewOptions.No
    );

    if (option === OpenLivePreviewOptions.Yes) {
      openLivePreview(editor);
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
        this._engine.unload(targetFilePath);
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
    this._engine.load(this.targetFilePath);
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
    if (event.file_path !== stripFileProtocol(this.targetFilePath)) {
      return;
    }

    this.panel.webview.postMessage(JSON.stringify(event));
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
      <style>
        html, body { 
          margin: 0;
          padding: 0;
        }
      </style>
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

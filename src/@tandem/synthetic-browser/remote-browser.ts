import { NoopRenderer, ISyntheticDocumentRenderer } from "./renderers";
import { OpenRemoteBrowserAction, SyntheticBrowserAction } from "./actions";
import { ISyntheticBrowser, SyntheticBrowser, BaseSyntheticBrowser } from "./browser";
import { Response } from "mesh";
import {
  fork,
  IActor,
  Action,
  isMaster,
  serialize,
  flattenTree,
  deserialize,
  Dependencies,
  MainBusDependency,
  BaseApplicationService
} from "@tandem/common";

import { BaseApplicationService2 } from "@tandem/editor/core/services";
import { SyntheticWindow, SyntheticDocument, SyntheticDocumentEdit } from "./dom";
import { Bundle, Bundler, BundlerDependency, SyntheticObjectEditor } from "@tandem/sandbox";

const NEW_DOCUMENT   = "newDocument";
const DOCUMENT_DIFF  = "documentDiff";

export class RemoteSyntheticBrowser extends BaseSyntheticBrowser {

  private _bus: IActor;
  private _bundle: Bundle;
  private _documentEditor: SyntheticObjectEditor;

  constructor(dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser) {
    super(dependencies, renderer, parent);
    this._bus = MainBusDependency.getInstance(dependencies);
  }
  async open2(url: string) {
    const remoteBrowserStream = this._bus.execute(new OpenRemoteBrowserAction(url));

    // TODO - new StreamBus(execute(action), onAction)
    remoteBrowserStream.pipeTo({
      write: this.onRemoteBrowserAction.bind(this),
      close: () => {
      },
      abort: (error) => {

      }
    })
  }

  onRemoteBrowserAction(action: any) {

    if (action.type === NEW_DOCUMENT) {

      const previousDocument = this.window && this.window.document;
      const newDocument      = deserialize(action.data, this._dependencies);
      this._documentEditor   = new SyntheticObjectEditor(newDocument);

      const window = new SyntheticWindow(this, this.location, newDocument);
      this.setWindow(window);

    } else if (action.type === DOCUMENT_DIFF) {
      const edit: SyntheticDocumentEdit = deserialize(action.edit, this._dependencies);
      this._documentEditor.applyEditActions(...edit.actions);
    }

    // explicitly request an update since some synthetic objects may not emit
    // a render action in some cases
    this.renderer.requestUpdate();

    this.notifyLoaded();
  }

}

export class RemoteBrowserService extends BaseApplicationService2 {
  [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {

    // TODO - move this to its own class
    return new Response((writer) => {
      const browser = new SyntheticBrowser(this.dependencies, new NoopRenderer());
      let currentDocument: SyntheticDocument;

      browser.observe({
        execute(action: Action) {
          if (action.type === SyntheticBrowserAction.BROWSER_LOADED) {
            if (currentDocument) {
              const edit = currentDocument.createEdit().fromDiff(browser.document);

              // need to patch existing document for now to maintain UID references
              new SyntheticObjectEditor(currentDocument).applyEditActions(...edit.actions);
              if (edit.actions.length) {
                writer.write({ type: DOCUMENT_DIFF, edit: serialize(edit) });
              }
            } else {
              currentDocument = browser.document;
              writer.write({ type: NEW_DOCUMENT, data: serialize(browser.document) });
            }
          }
        }
      });
      browser.open(action.url);
    });
  }
}
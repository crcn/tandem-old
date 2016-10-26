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
  serializable,
  flattenTree,
  deserialize,
  Dependencies,
  definePublicAction,
  PrivateBusDependency,
  BaseApplicationService
} from "@tandem/common";

import { BaseApplicationService2 } from "@tandem/core/services";
import { SyntheticWindow, SyntheticDocument, SyntheticDocumentEdit } from "./dom";
import { Bundle, Bundler, BundlerDependency, SyntheticObjectEditor } from "@tandem/sandbox";

@definePublicAction({
  serialize({ type, data }: RemoteBrowserDocumentAction) {
    return {
      type: type,
      data: serialize(data)
    }
  },
  deserialize({ type, data }: RemoteBrowserDocumentAction, dependencies: Dependencies) {
    return new RemoteBrowserDocumentAction(type, deserialize(data, dependencies));
  }
})
class RemoteBrowserDocumentAction extends Action {
  static readonly NEW_DOCUMENT   = "newDocument";
  static readonly DOCUMENT_DIFF  = "documentDiff";
  constructor(type: string, readonly data: any) {
    super(type);
  }
}

export class RemoteSyntheticBrowser extends BaseSyntheticBrowser {

  private _bus: IActor;
  private _bundle: Bundle;
  private _documentEditor: SyntheticObjectEditor;

  constructor(dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser) {
    super(dependencies, renderer, parent);
    this._bus = PrivateBusDependency.getInstance(dependencies);
  }
  async open2(url: string) {
    const remoteBrowserStream = this._bus.execute(new OpenRemoteBrowserAction(url));

    // TODO - new StreamBus(execute(action), onAction)
    remoteBrowserStream.pipeTo({
      write: this.onRemoteBrowserAction.bind(this),
      close: () => {
        console.log("CLOSED");
      },
      abort: (error) => {

      }
    })
  }

  onRemoteBrowserAction({ payload }) {

    const action = deserialize(payload, this.dependencies) as RemoteBrowserDocumentAction;
    console.log("receiving browser action", action);

    if (action.type === RemoteBrowserDocumentAction.NEW_DOCUMENT) {

      console.log("received new synthetic document");

      const previousDocument = this.window && this.window.document;
      const newDocument      = action.data;
      this._documentEditor   = new SyntheticObjectEditor(newDocument);

      const window = new SyntheticWindow(this, this.location, newDocument);
      this.setWindow(window);

    } else if (action.type === RemoteBrowserDocumentAction.DOCUMENT_DIFF) {
      console.log("received document diff");
      const edit: SyntheticDocumentEdit = action.data;
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

    console.log("opening up remote synthetic browser");

    // TODO - move this to its own class
    return new Response((writer) => {
      const browser = new SyntheticBrowser(this.dependencies, new NoopRenderer());
      let currentDocument: SyntheticDocument;

      browser.observe({
        execute(action: Action) {
          if (action.type === SyntheticBrowserAction.BROWSER_LOADED) {
            console.log('synthetic browser loaded');
            try {
              if (currentDocument) {
                const edit = currentDocument.createEdit().fromDiff(browser.document);

                // need to patch existing document for now to maintain UID references
                new SyntheticObjectEditor(currentDocument).applyEditActions(...edit.actions);
                console.log(edit.actions.length);
                if (edit.actions.length) {
                  writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.DOCUMENT_DIFF, edit)) });
                }
              } else {

                currentDocument = browser.document;
                writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.NEW_DOCUMENT, browser.document)) });
              }
            } catch(e) {
              console.error(e);
            }
          }
        }
      });
      browser.open(action.url);
    });
  }
}
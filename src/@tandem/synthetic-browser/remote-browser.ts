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
  Logger,
  loggable,
  IInjectable,
  flattenTree,
  deserialize,
  Dependencies,
  serializable,
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

@loggable()
export class RemoteSyntheticBrowser extends BaseSyntheticBrowser {

  readonly logger: Logger;

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
      },
      abort: (error) => {

      }
    })
  }

  onRemoteBrowserAction({ payload }) {

    const action = deserialize(payload, this.dependencies) as RemoteBrowserDocumentAction;

    if (action.type === RemoteBrowserDocumentAction.NEW_DOCUMENT) {
      this.logger.verbose("received new document");

      const previousDocument = this.window && this.window.document;
      const newDocument      = action.data;
      this._documentEditor   = new SyntheticObjectEditor(newDocument);

      const window = new SyntheticWindow(this, this.location, newDocument);
      this.setWindow(window);

    } else if (action.type === RemoteBrowserDocumentAction.DOCUMENT_DIFF) {
      const edit: SyntheticDocumentEdit = action.data;
      this.logger.verbose("received document diffs: %s", edit.actions.map(action => action.type).join(" "));
      this._documentEditor.applyEditActions(...edit.actions);
    }

    // explicitly request an update since some synthetic objects may not emit
    // a render action in some cases.
    this.renderer.requestRender();

    this.notifyLoaded();
  }
}

@loggable()
export class RemoteBrowserService extends BaseApplicationService2 {

  private _openBrowsers: any = {};

  $didInject() {
    super.$didInject();
    this._openBrowsers = {};
  }

  [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {

    // TODO - move this to its own class
    return new Response((writer) => {
      const browser: SyntheticBrowser = this._openBrowsers[action.url] || (this._openBrowsers[action.url] = new SyntheticBrowser(this.dependencies, new NoopRenderer()));
      let currentDocument: SyntheticDocument;

      const logger = this.logger.createChild(`${action.url} `);

      browser.open(action.url).then(() => {

        // clone the document since there may be other connected clients -- don't
        // want to mutate the original doc.
        if (!browser.document) {
          console.log(browser);
        }

        let currentDocument = browser.document.cloneNode(true);

        writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.NEW_DOCUMENT, browser.document)) });

        const observer = {
          execute: async (action: Action) => {
            if (action.type === SyntheticBrowserAction.BROWSER_LOADED) {

              const edit = currentDocument.createEdit().fromDiff(browser.document);

              // need to patch existing document for now to maintain UID references
              new SyntheticObjectEditor(currentDocument).applyEditActions(...edit.actions);
              if (edit.actions.length) {
                logger.verbose("sending changes: %s", edit.actions.map(action => action.type).join(" "));
                try {
                  await writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.DOCUMENT_DIFF, edit)) });
                } catch(e) {
                  logger.verbose("unable to send diffs to client");
                  browser.unobserve(observer);
                }
              }
            }
          }
        };

        browser.observe(observer);
      });
    });
  }
}
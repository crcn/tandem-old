import { NoopRenderer, ISyntheticDocumentRenderer } from "./renderers";
import { OpenRemoteBrowserAction, SyntheticBrowserAction, isDOMMutationAction } from "./actions";
import { ISyntheticBrowser, SyntheticBrowser, BaseSyntheticBrowser, ISyntheticBrowserOpenOptions } from "./browser";
import { Response, WrapBus } from "mesh";
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
  Injector,
  serializable,
  definePublicAction,
  PrivateBusProvider,
} from "@tandem/common";

import { BaseApplicationService } from "@tandem/core/services";
import { SyntheticWindow, SyntheticDocument, SyntheticDocumentEdit } from "./dom";
import { Dependency, DependencyGraph, BaseContentEdit, DependencyGraphProvider, SyntheticObjectEditor, IDependencyGraphStrategyOptions } from "@tandem/sandbox";

@definePublicAction({
  serialize({ type, data }: RemoteBrowserDocumentAction) {
    return {
      type: type,
      data: serialize(data)
    }
  },
  deserialize({ type, data }: RemoteBrowserDocumentAction, injector: Injector) {
    return new RemoteBrowserDocumentAction(type, deserialize(data, injector));
  }
})
export class RemoteBrowserDocumentAction extends Action {
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
  private _documentEditor: SyntheticObjectEditor;
  private _remoteStream: any;

  constructor(injector: Injector, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser) {
    super(injector, renderer, parent);
    this._bus = PrivateBusProvider.getInstance(injector);
  }

  async open2(options: ISyntheticBrowserOpenOptions) {
    if (this._remoteStream) this._remoteStream.cancel();

    const remoteBrowserStream = this._remoteStream = this._bus.execute(new OpenRemoteBrowserAction(options));

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

    const action = deserialize(payload, this.injector) as RemoteBrowserDocumentAction;

    if (action.type === RemoteBrowserDocumentAction.NEW_DOCUMENT) {
      this.logger.verbose("Received new document");

      const previousDocument = this.window && this.window.document;
      const newDocument      = action.data;
      this._documentEditor   = new SyntheticObjectEditor(newDocument);

      const window = new SyntheticWindow(this.location, this, newDocument);
      this.setWindow(window);

    } else if (action.type === RemoteBrowserDocumentAction.DOCUMENT_DIFF) {
      const edit: SyntheticDocumentEdit = action.data;
      this.logger.verbose("Received document diffs: >>%s", edit.actions.map(action => action.type).join(", "));
      this._documentEditor.applyEditActions(...edit.actions);
    }

    console.log(action);
    this.notify(action);

    // explicitly request an update since some synthetic objects may not emit
    // a render action in some cases.
    this.renderer.requestRender();

    this.notifyLoaded();
  }
}


@loggable()
export class RemoteBrowserService extends BaseApplicationService {

  private _openBrowsers: any = {};

  $didInject() {
    super.$didInject();
    this._openBrowsers = {};
  }

  [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {

    // TODO - move this to its own class
    return new Response((writer) => {
      const id = JSON.stringify(action.options);

      const browser: SyntheticBrowser = this._openBrowsers[id] || (this._openBrowsers[id] = new SyntheticBrowser(this.injector, new NoopRenderer()));
      let currentDocument: SyntheticDocument;

      const logger = this.logger.createChild(`${action.options.url} `);

      browser.open(action.options).then(() => {

        let currentDocument = browser.document.cloneNode(true);

        writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.NEW_DOCUMENT, browser.document)) });

        const observer = {
          execute: async (action: Action) => {
            if (action.type === SyntheticBrowserAction.BROWSER_LOADED) {

              const edit = currentDocument.createEdit().fromDiff(browser.document);

              // need to patch existing document for now to maintain UID references
              new SyntheticObjectEditor(currentDocument).applyEditActions(...edit.actions);
              if (edit.actions.length) {
                logger.info("Sending diffs: <<%s", edit.actions.map(action => action.type).join(", "));
                try {
                  await writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.DOCUMENT_DIFF, edit)) });
                } catch(e) {
                  logger.warn("Unable to send diffs to client, closing synthetic browser connection.");
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
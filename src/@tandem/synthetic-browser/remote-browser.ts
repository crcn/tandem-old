import { debounce } from "lodash";
import { NoopRenderer, ISyntheticDocumentRenderer } from "./renderers";
import { OpenRemoteBrowserRequest, isDOMMutationEvent } from "./messages";
import { ISyntheticBrowser, SyntheticBrowser, BaseSyntheticBrowser, ISyntheticBrowserOpenOptions } from "./browser";
import { CallbackDispatcher, IDispatcher, IStreamableDispatcher, WritableStream, DuplexStream, ReadableStream, ReadableStreamDefaultReader, pump } from "@tandem/mesh";
import {
  fork,
  Logger,
  Action,
  Status,
  isMaster,
  loggable,
  Mutation,
  bindable,
  Injector,
  serialize,
  flattenTree,
  deserialize,
  IInjectable,
  IDisposable,
  serializable,
  watchProperty,
  PrivateBusProvider,
} from "@tandem/common";

import { BaseApplicationService } from "@tandem/core/services";
import { SyntheticWindow, SyntheticDocument, SyntheticDocumentEdit } from "./dom";
import {
  Dependency,
  BaseContentEdit,
  DependencyGraph,
  ApplyFileEditRequest,
  SyntheticObjectEditor,
  DependencyGraphWatcher,
  DependencyGraphProvider,
  SyntheticObjectChangeWatcher,
  IDependencyGraphStrategyOptions
} from "@tandem/sandbox";

@serializable({
  serialize({ type, data }: RemoteBrowserDocumentMessage) {
    return {
      type: type,
      data: serialize(data)
    }
  },
  deserialize({ type, data }: RemoteBrowserDocumentMessage, injector: Injector) {
    return new RemoteBrowserDocumentMessage(type, deserialize(data, injector));
  }
})
export class RemoteBrowserDocumentMessage extends Action {
  static readonly NEW_DOCUMENT  = "newDocument";
  static readonly DOCUMENT_DIFF = "documentDiff";
  static readonly STATUS_CHANGE = "statusChange";
  constructor(type: string, readonly data: any) {
    super(type);
  }
}

@loggable()
export class RemoteSyntheticBrowser extends BaseSyntheticBrowser {

  readonly logger: Logger;

  private _bus: IStreamableDispatcher<any>;
  private _documentEditor: SyntheticObjectEditor;
  private _remoteStreamReader: ReadableStreamDefaultReader<any>;

  @bindable(true)
  public status: Status = new Status(Status.IDLE);

  constructor(injector: Injector, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser) {
    super(injector, renderer, parent);
    this._bus = PrivateBusProvider.getInstance(injector);
  }

  async open2(options: ISyntheticBrowserOpenOptions) {
    this.status = new Status(Status.LOADING);
    if (this._remoteStreamReader) this._remoteStreamReader.cancel("Re-opened");

    const remoteBrowserStream = this._bus.dispatch(new OpenRemoteBrowserRequest(options));
    const reader = this._remoteStreamReader = remoteBrowserStream.readable.getReader();

    let value, done;

    pump(reader, action => this.onRemoteBrowserAction(action));
  }

  onRemoteBrowserAction({ payload }) {

    const action = deserialize(payload, this.injector) as Action;

    this.logger.debug(`Received action: ${action.type}`);

    if (action.type === RemoteBrowserDocumentMessage.STATUS_CHANGE) {
      this.status = (<RemoteBrowserDocumentMessage>action).data;
    }

    if (action.type === RemoteBrowserDocumentMessage.NEW_DOCUMENT) {
      const { data } = <RemoteBrowserDocumentMessage>action;
      this.logger.debug("Received new document");

      const previousDocument = this.window && this.window.document;
      const newDocument      = data;
      this._documentEditor   = new SyntheticObjectEditor(newDocument);

      const window = new SyntheticWindow(this.location, this, newDocument);
      this.setWindow(window);
      this.status = new Status(Status.COMPLETED);
    } else if (action.type === RemoteBrowserDocumentMessage.DOCUMENT_DIFF) {
      const { data } = <RemoteBrowserDocumentMessage>action;
      const mutations: Mutation<any>[] = data;
      this.logger.debug("Received document diffs: >>", mutations.map(action => action.type).join(", "));
      this._documentEditor.applyEditChanges(...mutations);
      this.status = new Status(Status.COMPLETED);
    }

    this.notify(action);

    // explicitly request an update since some synthetic objects may not emit
    // a render action in some cases.
    this.renderer.requestRender();
  }
}


@loggable()
export class RemoteBrowserService extends BaseApplicationService {

  private _openBrowsers: {
    [Identifier: string]: SyntheticBrowser
  }

  $didInject() {
    super.$didInject();
    this._openBrowsers = {};
  }

  [OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserRequest) {

    // TODO - move this to its own class
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      const id = JSON.stringify(action.options);

      const browser: SyntheticBrowser = this._openBrowsers[id] || (this._openBrowsers[id] = new SyntheticBrowser(this.injector, new NoopRenderer()));
      let currentDocument: SyntheticDocument;

      const logger = this.logger.createChild(`${action.options.url} `);

      const changeWatcher = new SyntheticObjectChangeWatcher<SyntheticDocument>(async (mutations: Mutation<any>[]) => {

        logger.info("Sending diffs: <<", mutations.map(action => action.type).join(", "));
        await writer.write({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.DOCUMENT_DIFF, mutations)) });

      }, (clone: SyntheticDocument) => {
        logger.info("Sending <<new document");
        writer.write({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.NEW_DOCUMENT, clone)) });
      }, isDOMMutationEvent);

      if (browser.document) {
        changeWatcher.target = browser.document;
      }

      const onStatusChange = (status: Status) => {
        if (status) {
          if (status.type === Status.COMPLETED) {
            changeWatcher.target = browser.document;
          } else if (status.type === Status.ERROR) {
            this.logger.error("Sending error status: ", status.data);
          }
        }

        writer.write({ payload: serialize(new RemoteBrowserDocumentMessage(RemoteBrowserDocumentMessage.STATUS_CHANGE, status)) });
      };

      const watcher = watchProperty(browser, "status", onStatusChange);
      onStatusChange(browser.sandbox.status);

      browser.open(action.options);

      return {
        close() {

          // TODO - possibly shutdown here -- need to have increment counter.
          watcher.dispose();
          changeWatcher.dispose();
        }
      }
    });
  }
}
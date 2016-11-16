import { debounce } from "lodash";
import { NoopRenderer, ISyntheticDocumentRenderer } from "./renderers";
import { OpenRemoteBrowserAction, isDOMMutationAction } from "./actions";
import { CallbackDispatcher, IDispatcher, IStreamableDispatcher, WritableStream, DuplexStream, ReadableStream, ReadableStreamDefaultReader, pump } from "@tandem/mesh";
import { ISyntheticBrowser, SyntheticBrowser, BaseSyntheticBrowser, ISyntheticBrowserOpenOptions } from "./browser";
import {
  fork,
  Logger,
  Action,
  Status,
  isMaster,
  loggable,
  bindable,
  Injector,
  serialize,
  flattenTree,
  deserialize,
  IInjectable,
  IDisposable,
  serializable,
  watchProperty,
  definePublicAction,
  PrivateBusProvider,
} from "@tandem/common";

import { BaseApplicationService } from "@tandem/core/services";
import { SyntheticWindow, SyntheticDocument, SyntheticDocumentEdit } from "./dom";
import {
  Dependency,
  EditAction,
  BaseContentEdit,
  DependencyGraph,
  SyntheticObjectEditor,
  DependencyGraphWatcher,
  DependencyGraphProvider,
  SyntheticObjectChangeWatcher,
  IDependencyGraphStrategyOptions
} from "@tandem/sandbox";

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

    const remoteBrowserStream = this._bus.dispatch(new OpenRemoteBrowserAction(options));
    const reader = this._remoteStreamReader = remoteBrowserStream.readable.getReader();

    let value, done;

    pump(reader, action => this.onRemoteBrowserAction(action));
  }

  onRemoteBrowserAction({ payload }) {

    const action = deserialize(payload, this.injector) as Action;

    this.logger.verbose(`Received action: ${action.type}`);

    if (action.type === RemoteBrowserDocumentAction.STATUS_CHANGE) {
      this.status = (<RemoteBrowserDocumentAction>action).data;
    }

    if (action.type === RemoteBrowserDocumentAction.NEW_DOCUMENT) {
      const { data } = <RemoteBrowserDocumentAction>action;
      this.logger.verbose("Received new document");

      const previousDocument = this.window && this.window.document;
      const newDocument      = data;
      this._documentEditor   = new SyntheticObjectEditor(newDocument);

      const window = new SyntheticWindow(this.location, this, newDocument);
      this.setWindow(window);
      this.status = new Status(Status.COMPLETED);
    } else if (action.type === RemoteBrowserDocumentAction.DOCUMENT_DIFF) {
      const { data } = <RemoteBrowserDocumentAction>action;
      const actions: EditAction[] = data;
      this.logger.verbose("Received document diffs: >>%s", actions.map(action => action.type).join(", "));
      this._documentEditor.applyEditActions(...actions);
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

  private _openBrowsers: any = {};

  $didInject() {
    super.$didInject();
    this._openBrowsers = {};
  }

  [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {

    // TODO - move this to its own class
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      const id = JSON.stringify(action.options);

      const browser: SyntheticBrowser = this._openBrowsers[id] || (this._openBrowsers[id] = new SyntheticBrowser(this.injector, new NoopRenderer()));
      let currentDocument: SyntheticDocument;

      const logger = this.logger.createChild(`${action.options.url} `);

      const changeWatcher = new SyntheticObjectChangeWatcher<SyntheticDocument>(async (actions: EditAction[]) => {
        logger.info("Sending diffs: <<%s", actions.map(action => action.type).join(", "));
        await writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.DOCUMENT_DIFF, actions)) });
      }, (clone: SyntheticDocument) => {
        logger.info("Sending <<new document");
        writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.NEW_DOCUMENT, clone)) });
      }, isDOMMutationAction);

      if (browser.document) {
        changeWatcher.target = browser.document;
      }

      const onStatusChange = (status: Status) => {
        if (status && status.type === Status.COMPLETED) {
          changeWatcher.target = browser.document;
        }
        writer.write({ payload: serialize(new RemoteBrowserDocumentAction(RemoteBrowserDocumentAction.STATUS_CHANGE, status)) });
      };

      const watcher = watchProperty(browser.sandbox, "status", onStatusChange);
      onStatusChange(browser.sandbox.status);

      browser.open(action.options);

      return {
        close() {
          watcher.dispose();
          changeWatcher.dispose();
        }
      }
    });
  }
}
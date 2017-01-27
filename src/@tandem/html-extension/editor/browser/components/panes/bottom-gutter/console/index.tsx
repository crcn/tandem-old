import "./index.scss";
import cx = require("classnames");
import React = require("react");
import { HTMLExtensionStore } from "@tandem/html-extension/editor/browser/stores";
import { HTMLExtensionStoreProvider } from "@tandem/html-extension/editor/browser/providers";
import { BaseApplicationComponent, inject, LogLevel } from "@tandem/common";
import { ansi_to_html } from "ansi_up";

export class ConsoleComponent extends BaseApplicationComponent<any, any> {

  @inject(HTMLExtensionStoreProvider.ID)
  private _store: HTMLExtensionStore;

  render() {
    const logs = this._store.vmLogs;
    return <div className="console-gutter-component">
      <ul className="logs">
        {
          logs.map((log) => {
            return <li className={cx({ 
              warning: log.level === LogLevel.WARNING, 
              error: log.level === LogLevel.ERROR, 
              info: log.level === LogLevel.INFO, 
              verbose: log.level === LogLevel.VERBOSE
            })}>
              <span  dangerouslySetInnerHTML={{__html: ansi_to_html(log.text) }} />
            </li>
          })
        }
      </ul>
    </div>;
  }
}
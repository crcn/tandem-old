import "./index.scss";
import cx = require("classnames");
import React = require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { ansi_to_html } from "ansi_up";
import { HTMLExtensionStore } from "@tandem/html-extension/editor/browser/stores";
import { BaseSyntheticBrowser } from "@tandem/synthetic-browser";
import { HTMLExtensionStoreProvider } from "@tandem/html-extension/editor/browser/providers";
import { BaseApplicationComponent, inject, LogLevel } from "@tandem/common";

export class ConsoleComponent extends BaseApplicationComponent<{ workspace: Workspace, activeSyntheticBrowser: BaseSyntheticBrowser }, any> {

  render() {
    const { activeSyntheticBrowser } = this.props;
    const { logs } = activeSyntheticBrowser;

    return <div className="console-gutter-component">
      <ul className="logs">
        {
          logs.map((log, i) => {
            return <li key={i} className={cx({ 
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
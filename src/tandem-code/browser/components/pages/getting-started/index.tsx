import "./index.scss";

import React = require("react");
import cx = require("classnames");
import { BaseApplicationComponent } from "@tandem/common";
import { ExecuteCommandRequest, UpdateUserSettingsRequest, IUserSettings } from "tandem-code/common";

// MVP getting started page. Fugly as hell.
export class GettingStartedComponent extends BaseApplicationComponent<any, { page: number, selectedExtensionIndex: number, loading: boolean }> {

  state = {
    page: window["GET_STARTED_PAGE"] || 0,
    selectedExtensionIndex: 0,
    loading: false
  }

  private _extensions = [
    {
      label: "Atom",
      iconUrl: require("./atom.png"),
      installCommand: "apm install atom-tandem-extension",
      openBin: "atom"
    },
    {
      label: "VSCode",
      iconUrl: require("./vscode.png"),
      installCommand: "code --install-extension tandemcode.tandem-vscode-extension",
      openBin: "code"
    },
    {
      label: "None",
      iconUrl: require("./icon_blue.png"),
      installCommand: undefined,
      openBin: undefined
    }
  ]
  
  nextPage = async (load, ended) => {
    this.setState({ page: this.state.page, selectedExtensionIndex: this.state.selectedExtensionIndex, loading: true });

    try {
      if (load) await load();
    } catch(e) {
      this.setState({ page: this.state.page, selectedExtensionIndex: this.state.selectedExtensionIndex, loading: false });
      return alert(e.message);
    }

    if (ended) {
      return this.complete();
    }
    this.setState({ page: this.state.page + 1, selectedExtensionIndex: this.state.selectedExtensionIndex, loading: false });
  }

  prevPage = async (ended) => {
    this.setState({ page: this.state.page - 1, selectedExtensionIndex: this.state.selectedExtensionIndex, loading: this.state.loading });
  }

  complete = async () => {

    const selectedExtension = this._extensions[this.state.selectedExtensionIndex];

    const userSettings: IUserSettings = {
      textEditor: {
        bin: selectedExtension.openBin
      }
    }

    // SAVE USER SETTINGS HERE
    await this.bus.dispatch(new UpdateUserSettingsRequest(userSettings)).readable.getReader().read();

    window.close();
  }

  selectExtension = (index) => {
    this.setState({ page: this.state.page, selectedExtensionIndex: index, loading: this.state.loading });
  }

  installSelectedExtension = async () => {
    const selected = this._extensions[this.state.selectedExtensionIndex];
    if (!selected.installCommand) return null;


    return new Promise((resolve, reject) => {
      ExecuteCommandRequest.dispatch(selected.installCommand, this.bus).then(resolve).catch((err) => {
        const message = err.message;
        alert(message);
        return reject(new Error(`Unable to install ${selected.label} extension. Try running "${selected.installCommand}" in Terminal to manually install the extension. After that, select "None" to continue.`));
      });
    });
  }

  render() {

    const pages = [
      [this.renderHello],
      [this.renderInstallExtensions, this.installSelectedExtension],
      // this.howToUse,
      [this.done]
    ];

    const ended = this.state.page === pages.length -1;

    const [currentPage, load] = pages[Math.min(this.state.page, pages.length - 1)];

    return <div className="getting-started-component">
      <div className="content container">
        {currentPage()}
      </div>
      <div className="footer container">
        <div className="row">
          <div className="col-12">
            { this.state.page !== 0 ? <a href="#" className="button pull-left" onClick={this.prevPage.bind(this, ended)}>
              { "Back" }
            </a> : undefined }
            <a href="#" className={cx({ disabled: this.state.loading }, "button pull-right")} onClick={this.state.loading ? undefined : this.nextPage.bind(this, load, ended)}>
              { ended ? "Start using tandem" : this.state.loading ? "Loading..." : "Next" }
            </a>
          </div>
        </div>
      </div>
    </div>;
  }

  renderHello = () => {
    return <div>
      <div className="hello row">
        <div className="col-12">
          <div className="logo">
            <img src={require("./icon_black.png")} />
            Tandem

          </div>
          <div className="description">
            Welcome to Tandem! This brief guide will help you get started.
          </div>
        </div>
      </div>
    </div>
  }

  // TODO - auto-detect extension here
  renderInstallExtensions = () => {

    // TODO - should not hard-code here. Okay for MVP.
    const options = this._extensions;

    return <div className="install-text-editor-extension">
      <div className="row">
        <div className="col-12">
          <div className="title">
            Install a text editor extension
          </div>
          <div className="description">
            This extension enables Tandem to synchronize changes with your text editor. You can always install it later on.
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <ul className="options">
            {
              options.map(({ label, iconUrl, }, index) => {
                return <li className={cx({ selected: this.state.selectedExtensionIndex === index }, "fill-text")} onClick={this.selectExtension.bind(this, index)}>
                <img src={iconUrl} />
                <label>{label}</label>
              </li>
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }

  howToUse = () => {
    return <div>
      How to use
    </div>
  }

  captureUsage = () => {

  }

  done = () => {
    return <div className="done">
      <div className="row">
        <div className="col-12">
          <div className="title">
            
            All done! You can now start using Tandem.

          </div>
        </div>
      </div>
    </div>;
  }
}
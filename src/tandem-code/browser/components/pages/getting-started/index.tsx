import "./index.scss";

import React = require("react");
import cx = require("classnames");
import { BaseApplicationComponent } from "@tandem/common";
import { OpenNewWorkspaceRequest } from "@tandem/editor/common";
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
      installCommand: "/usr/local/bin/apm install atom-tandem-extension",
      openBin: "/usr/local/bin/atom"
    },
    {
      label: "VSCode",
      iconUrl: require("./vscode.png"),
      installCommand: "/usr/local/bin/code --install-extension tandemcode.tandem-vscode-extension",
      openBin: "/usr/local/bin/code"
    },
    {
      label: "None",
      iconUrl: require("./icon_blue.png"),
      installCommand: undefined,
      openBin: undefined
    }
  ]
  
  nextPage = async (load, ended) => {
    this.setState(Object.assign({}, this.state, { loading: true }));

    try {
      if (load) await load();
    } catch(e) {
      this.setState(Object.assign({}, this.state,  { loading: false }));
      return alert(e.message);
    }

    if (ended) {
      return this.complete();
    }
    this.setState(Object.assign({}, this.state, { page: this.state.page + 1, loading: false }));
  }

  prevPage = async (ended) => {
    this.setState(Object.assign({}, this.state, { page: this.state.page - 1 }));
  }


  complete = async () => {

    const selectedExtension = this._extensions[this.state.selectedExtensionIndex];

    const userSettings: IUserSettings = {
      textEditor: {
        bin: selectedExtension.openBin
      }
    }

    // save settings so that the getting started prompt does not come up again
    await this.bus.dispatch(new UpdateUserSettingsRequest(userSettings)).readable.getReader().read();


    const { dialog } = require("electron").remote;

    dialog.showOpenDialog({
      filters: [
        {name: "HTML Files", extensions: ["html"] }
      ],
    }, async ([filePath]) => {
      await this.bus.dispatch(new OpenNewWorkspaceRequest("file://" + filePath));
      window.close();
    });
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
      ["Next", this.renderHello],
      ["Install and continue", this.renderInstallExtensions, this.installSelectedExtension],
      // ["Next", this.selectOptions],
      // this.howToUse,
      ["Open HTML file", this.done]
    ];

    const ended = this.state.page === pages.length -1;
    const [label, currentPage, load] = pages[Math.min(this.state.page, pages.length - 1)];

    return <div className="getting-started-component">
      <div className="content container">
        {(currentPage as Function)()}
      </div>
      <div className="footer container">
        <div className="row">
          <div className="col-12">
            { this.state.page !== 0 ? <a href="#" className="button pull-left" onClick={this.prevPage.bind(this, ended)}>
              { "Back" }
            </a> : undefined }
            <a href="#" className={cx({ disabled: this.state.loading }, "button pull-right")} onClick={this.state.loading ? undefined : this.nextPage.bind(this, load, ended)}>
              { this.state.loading ? "Loading..." : label }
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
            Install the text editor extension
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

  selectOptions = () => {
    return <div>
      <div className="row">
        <div className="col-12">
          <div className="title">
            Prepare your project
          </div>
          <div className="description">

          </div>
        </div>
      </div>
    </div>
  }


  prepareProject = () => {
    return <div>
      <div className="row">
        <div className="col-12">
          <div className="title">
            2. Prepare your project
          </div>
          <div className="description">

          </div>
        </div>
      </div>
    </div>
  }

  done = () => {
    return <div className="done">
      <div className="row">
        <div className="col-12">
          <div className="title">
            All done! 
          </div>
          <div className="description">
            You're ready to start using Tandem.
          </div>
        </div>
      </div>
    </div>;
  }
}
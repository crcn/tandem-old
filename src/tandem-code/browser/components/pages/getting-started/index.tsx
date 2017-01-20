import "./index.scss";

import React = require("react");
import cx = require("classnames");

export class GettingStartedComponent extends React.Component<any, { page: number, selectedExtensionIndex: number }> {

  state = {
    page: window["GET_STARTED_PAGE"] || 0,
    selectedExtensionIndex: 0
  }
  
  nextPage = async (ended) => {
    if (ended) {
      await this.openWorkspace();
      window.close();
    }
    this.setState({ page: this.state.page + 1, selectedExtensionIndex: this.state.selectedExtensionIndex});
  }

  prevPage = async (ended) => {
    this.setState({ page: this.state.page - 1, selectedExtensionIndex: this.state.selectedExtensionIndex });
  }

  openWorkspace = async () => {
    // TODO - prompt to open file
  }

  selectExtension = (index) => {
    this.setState({ page: this.state.page, selectedExtensionIndex: index });
  }

  render() {

    const pages = [
      this.renderHello,
      this.renderInstallExtensions,
      // this.howToUse,
      this.done
    ];

    const ended = this.state.page === pages.length -1;

    return <div className="getting-started-component">
      <div className="content container">
        {pages[Math.min(this.state.page, pages.length - 1)]()}
      </div>
      <div className="footer container">
        <div className="row">
          <div className="col-12">
            { this.state.page !== 0 ? <a href="#" className="button pull-left" onClick={this.prevPage.bind(this, ended)}>
              { "Back" }
            </a> : undefined }
            <a href="#" className="button pull-right" onClick={this.nextPage.bind(this, ended)}>
              { ended ? "Start using tandem" : "Next" }
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
    const options = [
      {
        label: "Atom",
        iconUrl: require("./atom.png")
      },
      {
        label: "VSCode",
        iconUrl: require("./vscode.png")
      },
      {
        label: "None",
        iconUrl: require("./icon_blue.png")
      }
    ];

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
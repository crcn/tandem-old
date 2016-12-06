import "./index.scss";
import React =  require("React");
import { PortalComponent } from "../portal";

export interface IDropdownComponentProps {
  renderMenu(props): any;
  showMenu?: boolean;
}

export class DropdownComponent extends React.Component<IDropdownComponentProps, { showMenu: boolean }> {

  state = {
    showMenu: false
  };

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }

  render() {
    return <span className="dropdown" onClick={this.toggleMenu}>
      { this.props.children }
      { this.props.showMenu || this.state.showMenu ? this.renderMenu() : null}
    </span>
  }

  renderMenu() {

    return <PortalComponent>
      <span className="menu">
        <span className="menu-inner">
          { this.props.renderMenu(this.props) }
        </span>
      </span>
    </PortalComponent>;
  }
}
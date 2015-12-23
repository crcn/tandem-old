import './index.scss';

import cx from 'classnames';
import React from 'react';
import PortalComponent from 'common/components/portal';
import PopdownComponent from 'common/components/popdown';

class MenuComponent extends React.Component {

  constructor() {
    super();
    this.state = { buttonWidth: 0, show: false };
  }

  componentDidMount() {

    // fugly, but clear and does the trick of moving the f'ing
    // arrow.
    this.setState({
      buttonWidth: this.refs.button.offsetWidth
    });

  }

  show() {
    this.setState({
      show: true
    });

    if (this.props.onMenuShow) {
      this.props.onMenuShow();
    }
  }

  focus() {
    this.refs.menu.focus();
  }

  hide() {
    this.setState({
      show: false
    });

    if (this.props.onMenuHide) {
      this.props.onMenuHide();
    }
  }

  toggleMenu(event) {
    event.stopPropagation();
    if (this.state.show) {
      this.hide();
    } else {
      this.show();
    }
  }

  onKeyDown(event) {

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }

    // enter or escape
    if (!/13|27/.test(String(event.keyCode))) return;

    this.toggleMenu(event);
  }

  render() {

    var show       = this.props.show || this.state.show;

    var sections = {};

    if (show) {
      sections.items = <PortalComponent><div onKeyDown={this.onKeyDown.bind(this)}><PopdownComponent {...this.props} styles={{
          arrow: {
            left: this.state.buttonWidth ? (this.state.buttonWidth / 2) + 'px' : '50%'
          }
        }}>
        {
          this.props.createMenu   ?
          this.props.createMenu() :
          this.props.children[1]
        }
      </PopdownComponent></div></PortalComponent>;

      sections.bgClick = <div className='m-menu--bg-click' onClick={this.hide.bind(this)}>

      </div>;
    }

    var classNames = cx({
      'm-menu': true,
      'disable': this.props.disable
    });

    return <div ref="menu" tabIndex={this.props.tabbable !== false ? this.props.disable ? void 0 : 0 : void 0} onKeyDown={this.onKeyDown.bind(this)} className={[classNames, this.props.className].join(' ')}>

      <span ref='button' onClick={this.toggleMenu.bind(this)}>
        {
          Array.isArray(this.props.children) ?
          this.props.children[0]             :
          this.props.children
        }
      </span>

      <div ref='menuItems' className='m-menu--items'>{ sections.items }</div>
      { sections.bgClick }
    </div>
  }
}

export default MenuComponent;

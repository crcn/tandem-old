import './index.scss';
import React from 'react';
import PopdownComponent from 'common/components/popdown';
import ArrowComponent from 'common/components/arrow';

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
  }

  hide() {
    this.setState({
      show: false
    });
  }

  toggleMenu(event) {
    this.setState({
      show: !this.state.show
    });
  }

  render() {

    var show       = this.props.show || this.state.show;

    var sections = {};

    if (show) {
      sections.items = <PopdownComponent styles={{
          arrow: {
            left: this.state.buttonWidth ? (this.state.buttonWidth / 2) + 'px' : '50%'
          }
        }}>
        {
          this.props.createMenu   ?
          this.props.createMenu() :
          this.props.children[1]
        }
      </PopdownComponent>;

      sections.bgClick = <div className='m-menu--bg-click' onClick={this.hide.bind(this)}>

      </div>;
    }

    return <div className={['m-menu', this.props.className].join(' ')}>

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

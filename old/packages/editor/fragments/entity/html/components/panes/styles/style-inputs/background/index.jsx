import './index.scss';

import React from 'react';
import CSSParser from 'saffron-common/parsers/css';
import MenuComponent from 'saffron-common/components/menu';

class BackgroundInputComponent extends React.Component {
  render() {
    var value = this.props.reference.getValue();

    var ast = CSSParser.parse(value);

    return <MenuComponent className='input m-background-input'>
      <div
        className='m-background-input--preview'
        style={{
          background: value
        }}>

      </div>
    </MenuComponent>;
  }
}

export default BackgroundInputComponent;

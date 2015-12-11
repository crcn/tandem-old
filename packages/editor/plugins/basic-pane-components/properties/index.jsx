import React from 'react';
import RegisteredComponent from 'common/components/registered-component';

class PropertiesComponent extends React.Component {
  render() {
    var focus = this.props.app.focus;
    return <div className='m-properties-pane-component'>
      <RegisteredComponent query={focus ? { paneType: focus.componentType } : void 0 } {...this.props} />
    </div>;
  }
}

export default PropertiesComponent;

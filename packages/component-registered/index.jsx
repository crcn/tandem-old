import React from 'react';
import sift from 'sift';

class RegisteredComponent extends React.Component {
  render() {

    var components = this.props.app.registry.filter(sift(this.props.query)).map((entry) => {
      return entry.create(this.props);
    });

    return components.length === 1 ? components[0] : <span>
      { components }
    </span>;
  }
}

export default RegisteredComponent;

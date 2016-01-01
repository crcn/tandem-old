import React from 'react';
import ReactDOM from 'react-dom';

class EntityComponent extends React.Component {

  render() {

    var children = this.props.entity.children.map((child, i) => {
      return <EntityComponent  key={child.id || i} entity={ child } app={ this.props.app } />;
    });

    if (!this.props.entity.componentType) {
      return children.length > 1 ? <span>{children}</span> : children[0];
    }

    var fragment = this.props.app.fragments.queryOne({
        componentType: this.props.entity.componentType
    });

    if (!fragment) {
      throw new Error(this.props.entity.componentType + ' does not exist');
    }

    return fragment.factory.create({ entity: this.props.entity }, children);
  }
}

export default EntityComponent;

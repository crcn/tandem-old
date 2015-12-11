import React from 'react';
import ReactDOM from 'react-dom';
import sift from 'sift';

class NodeComponent extends React.Component {

  render() {

    var plugin = this.props.app.plugins.find(sift({
        componentType: this.props.node.componentType
    }));

    if (!plugin) {
      throw new Error(this.props.node.componentType + ' does not exist');
    }

    return plugin.factory.create({ node: this.props.node }, this.props.node.children.map((child, i) => {
      return <NodeComponent  key={child.id || i} node={ child } app={ this.props.app } />;
    }));
  }
}

export default NodeComponent;

import React from 'react';
import RegisteredComponent from 'component-registered';
import sift from 'sift';
import { PaneComponentEntry } from 'registry-entries';
import SymbolComponent from './symbol-component';

class ComponentPaneComponent extends React.Component {
  render() {
    // fdsfds
    return <ul>
      {
        this.props.app.registry.filter(sift({ symbolType: 'component' })).map(function(entry) {
          return <SymbolComponent entry={entry} key={entry.id} />;
        })
      }
    </ul>;
  }
}

export default ComponentPaneComponent;

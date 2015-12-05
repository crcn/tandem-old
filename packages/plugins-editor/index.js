import DataObject from 'object-base';
import { ComponentEntry, RootComponentEntry } from 'registry-entries';
import MainComponent from './components/main';
import React from 'react';

class PaneTest extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}

export default {
  create({ app }) {
    app.registry.push(RootComponentEntry.create({
      componentClass : MainComponent
    }));

    app.registry.push(ComponentEntry.create({
      id: 'pane1',
      componentClass: PaneTest
    }));
  }
}

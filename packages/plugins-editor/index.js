import DataObject from 'base-object';
import { ComponentEntry } from 'registry';
import MainComponent from './components/main';
import React from 'react';

class PaneTest extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}

export default {
  create({ application }) {
    application.registry.push(ComponentEntry.create({
      id             : 'rootComponent',
      componentClass : MainComponent
    }));

    application.registry.push(ComponentEntry.create({
      id: 'pane1',
      componentClass: PaneTest
    }));
  }
}

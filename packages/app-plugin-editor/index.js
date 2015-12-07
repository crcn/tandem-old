import DataObject from 'object-base';
import { ComponentEntry, SymbolPaneComponentEntry, RootComponentEntry, AppPaneComponentEntry } from 'registry-entries';
import LayersPaneComponent from './components/panes/layers';
import MainComponent from './components/main';
import React from 'react';

export default {
  create({ app }) {
    registerComponents(app);
  }
}

function registerComponents(app) {

  // actual editor
  app.registry.push(RootComponentEntry.create({
    componentClass : MainComponent
  }));

  // panes
  app.registry.push(AppPaneComponentEntry.create({
    id             : 'layersPane',
    label          : 'Layers',
    componentClass : LayersPaneComponent
  }));
}

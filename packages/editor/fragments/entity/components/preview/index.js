import {
  Fragment,
  ComponentFragment,
  KeyCommandFragment,
  ApplicationFragment,
  PreviewComponentFragment
} from 'editor/fragment/types';

import { CallbackNotifier } from 'common/notifiers';

import React from 'react';
import Preview from './facades/preview';
import PreviewComponent from './components/preview';
import { create as createBasicToolsFragment } from './components/basic-tools';
import { create as createKeyCommandsFragment } from './key-commands';

export function create({ app }) {

  var preview = app.preview = Preview.create({
    zoom         : 0.70,
    // notifier     : app.notifier,
    canvasWidth  : 1024,
    canvasHeight : 768
  });

  app.notifier.push(preview);
  preview.notifier.push(app.notifier);

  return [
    ...createBasicToolsFragment({ app, preview }),
    ...createKeyCommandsFragment({ app, preview }),
    PreviewComponentFragment.create({
      id             : 'basicPreview',
      componentClass : PreviewComponent
    })
  ];
}

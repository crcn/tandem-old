import {
  ApplicationFragment,
  PreviewComponentFragment,
  ComponentFragment,
  Fragment,
  KeyCommandFragment
} from 'editor/fragment/types';

import { CallbackNotifier } from 'common/notifiers';

import React from 'react';
import Preview from './facades/preview';
import PreviewComponent from './components/preview';
import { create as createBasicToolsFragment } from './fragments/basic-tools';
import { create as createKeyCommandsFragment } from './fragments/key-commands';

export function create({ app }) {

  var preview = app.preview = Preview.create({
    canvasWidth  : 1024,
    canvasHeight : 768,
    zoom         : 0.90,
    notifier     : app.notifier
  });

  app.notifier.push(preview);

  return [
    ...createBasicToolsFragment({ app }),
    ...createKeyCommandsFragment({ app, preview }),
    PreviewComponentFragment.create({
      id             : 'basicPreview',
      componentClass : PreviewComponent
    })
  ];
};
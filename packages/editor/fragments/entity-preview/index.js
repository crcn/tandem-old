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

export default ApplicationFragment.create({
  id: 'componentPreview',
  factory: {
    create({ app }) {

      var preview = app.preview = Preview.create({
        canvasWidth  : 1024,
        canvasHeight : 768,
        zoom         : 0.90,
        notifier     : app.notifier
      });

      app.notifier.push(preview);

      app.fragments.push(PreviewComponentFragment.create({
        id             : 'basicPreview',
        componentClass : PreviewComponent
      }));

      app.fragments.push(
        KeyCommandFragment.create({
          id         : 'zoomInKeyCommand',
          keyCommand : 'meta+=',
          notifier   : CallbackNotifier.create(
            preview.zoomIn.bind(preview)
          )
        }),
        KeyCommandFragment.create({
          id         : 'zoomOutKeyCommand',
          keyCommand : 'meta+-',
          notifier   : CallbackNotifier.create(
            preview.zoomOut.bind(preview)
          )
        })
      );
    }
  }
})

import {
  ApplicationPlugin,
  PreviewComponentPlugin,
  ComponentPlugin,
  Plugin,
  KeyCommandPlugin
} from 'editor/plugin/types';

import { CallbackNotifier } from 'common/notifiers';

import React from 'react';
import Preview from './facades/preview';
import PreviewComponent from './components/preview';

export default ApplicationPlugin.create({
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

      app.plugins.push(PreviewComponentPlugin.create({
        id             : 'basicPreview',
        componentClass : PreviewComponent
      }));

      app.plugins.push(
        KeyCommandPlugin.create({
          id         : 'zoomInKeyCommand',
          keyCommand : 'ctrl+]',
          notifier   : CallbackNotifier.create(
            preview.zoomIn.bind(preview)
          )
        }),
        KeyCommandPlugin.create({
          id         : 'zoomOutKeyCommand',
          keyCommand : 'ctrl+[',
          notifier   : CallbackNotifier.create(
            preview.zoomOut.bind(preview)
          )
        })
      );

      registerNudgeCommands(app);
    }
  }
})

function registerNudgeCommands(app) {

  var moveEntityNotifier = { notify: function(message) {

    // ensure that there is NO focus (inputs)
    if (document.activeElement !== document.body) return;

    var entity = app.focus;
    var style = entity.getComputedStyle();

    var left = style.left;
    var top  = style.top;

    if (message.keyCode === 38) {
      top--;
    } else if (message.keyCode == 40) {
      top++;
    } else if (message.keyCode === 37) {
      left--;
    } else if (message.keyCode === 39) {
      left++;
    }

    entity.getComputer().setPositionFromAbsolutePoint({
      left: left,
      top: top
    });
  }};

  app.plugins.push(
    KeyCommandPlugin.create({
      id: 'upCommand',
      keyCommand: 'up',
      notifier: moveEntityNotifier
    }),

    KeyCommandPlugin.create({
      id: 'rightCommand',
      keyCommand: 'right',
      notifier: moveEntityNotifier
    }),

    KeyCommandPlugin.create({
      id: 'downCommand',
      keyCommand: 'down',
      notifier: moveEntityNotifier
    }),

    KeyCommandPlugin.create({
      id: 'leftCommand',
      keyCommand: 'left',
      notifier: moveEntityNotifier
    })
  );
}

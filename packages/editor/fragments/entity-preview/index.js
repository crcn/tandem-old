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

  app.fragments.push(
    KeyCommandFragment.create({
      id: 'upCommand',
      keyCommand: 'up',
      notifier: moveEntityNotifier
    }),

    KeyCommandFragment.create({
      id: 'rightCommand',
      keyCommand: 'right',
      notifier: moveEntityNotifier
    }),

    KeyCommandFragment.create({
      id: 'downCommand',
      keyCommand: 'down',
      notifier: moveEntityNotifier
    }),

    KeyCommandFragment.create({
      id: 'leftCommand',
      keyCommand: 'left',
      notifier: moveEntityNotifier
    })
  );
}

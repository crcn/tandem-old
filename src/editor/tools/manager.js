import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/busses';
import { WrapBus } from 'mesh';

export const fragment = ApplicationFragment.create({
  ns         : 'application/toolHandler',
  initialize : create,
});

function create(app) {
  var currentTool;

  app.busses.push(
    TypeCallbackBus.create('setCurrentTool', onSetTool),
    WrapBus.create(execEventOnCurrentTool)
  );

  app.currentTool = {};

  function onSetTool({ tool }) {
    app.setProperties({ currentTool: currentTool = tool });
  }

  function execEventOnCurrentTool(event) {
    if (currentTool) {
      return currentTool.execute(event);
    }
  }
}

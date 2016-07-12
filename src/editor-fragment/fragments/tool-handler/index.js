import { ApplicationFragment } from 'common/application/fragments';
import { LOAD } from 'common/application/events';
import { TypeCallbackBus } from 'common/mesh';
import { WrapBus } from 'mesh';

export const fragment = ApplicationFragment.create({
  ns         : 'application/toolHandler',
  initialize : create
});

function create(app) {

  app.busses.push(
    TypeCallbackBus.create(LOAD, onLoad),
    TypeCallbackBus.create('setCurrentTool', onSetTool),
    WrapBus.create(execEventOnCurrentTool)
  );

  var tools = [];
  var currentTool;
  app.currentTool = {};

  function onLoad(event) {
    for (var fragment of app.fragmentDictionary.queryAll('tools/**')) {
      loadToolFragment(fragment);
    }
  }

  function loadToolFragment(fragment) {
    var tool = fragment.create({
      bus: app.bus
    });
  }

  function onSetTool({ tool }) {
    app.setProperties({ currentTool: currentTool = tool });
  }

  function execEventOnCurrentTool(event) {
    if (currentTool) {
      return currentTool.execute(event);
    }
  }
}

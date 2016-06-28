import IEvent from 'common/events/IEvent';
import { INITIALIZE } from 'common/events/types';
import { 
  APPLICATION as APPLICATION_NS, 
  ROOT_COMPONENT as ROOT_COMPONENT_NS 
} from 'common/fragments/namespaces';

import TypeDispatcher from 'common/dispatchers/type';
import BaseApplication from 'common/application/base';
import ApplicationFragment from 'common/fragments/application';
import CallbackDispatcher from 'common/dispatchers/Callback';
import FragmentDictionary from 'common/fragments/dictionary';
import RegisteredComponent from 'common/components/registered/index';
import { throttle } from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';

function createFragment(app:BaseApplication) {

  // re-render the root component whenever a message gets passed to the
  // central dispatcher
  app.dispatcher.push(
    CallbackDispatcher.create(throttle(update, 100))
  );

  function update() {
    render(<RootComponent app={app} fragments={app.fragments} />, (app as any).element);
  }
}

export class RootComponent extends React.Component<{ app:any, fragments:FragmentDictionary }, {}> {
  render() {
    return <div className='root'>
      <RegisteredComponent ns={ROOT_COMPONENT_NS} app={this.props.app} />
    </div>
  }
}

export default new ApplicationFragment(createFragment);

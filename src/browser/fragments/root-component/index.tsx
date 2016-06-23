import IEvent from 'common/events/IEvent';
import { INITIALIZE } from 'common/events/types';
import TypeDispatcher from 'common/dispatchers/Type';
import FactoryFragment from 'common/fragments/Factory';
import CallbackDispatcher from 'common/dispatchers/Callback';
import FragmentDictionary from 'common/fragments/Dictionary';
import RegisteredComponent from 'common/components/registered';
import { throttle } from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';

export default FactoryFragment.create(
  'application/rootComponent',
  { create: create }
)

function create({ application }:any) {

  // re-render the root component whenever a message gets passed to the
  // central dispatcher
  application.dispatcher.push(
    CallbackDispatcher.create(throttle(update, 100))
  );

  function update() {
    render(<RootComponent application={application} fragments={application.fragments} />, application.element);
  }
}

class RootComponent extends React.Component<{ application:any, fragments:FragmentDictionary }, {}> {
  render() {
    return <div className='root'>
      <RegisteredComponent ns='rootComponent' fragments={this.props.fragments} />
    </div>
  }
}
import BaseApplication from 'common/application/Base';
import TypeDispatcher from 'common/dispatchers/Type';
import CallbackDispatcher from 'common/dispatchers/Callback';
import FactoryFragment from 'common/fragments/Factory';
import { INITIALIZE } from 'common/events/types';
import { render } from 'react-dom';
import * as React from 'react';
import TestComponent from './TestComponent';

export default FactoryFragment.create(
  'application/mainComponent',
  { create: create }
); 

function create({ application }: any) {

  application.dispatcher.push(
    TypeDispatcher.create( 
      INITIALIZE,
      CallbackDispatcher.create(initialize)
    )
  );

  function initialize(event) {
    console.log('en');
    render(<TestComponent />, application.element);
  }
}


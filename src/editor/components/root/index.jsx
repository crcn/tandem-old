import './index.scss';
import React from 'react';

import CenterComponent from './center';
import { ReactComponentFactoryFragment } from 'common/react/fragments';

export default class RootEditorComponent extends React.Component {
  render() {
    return (<div className='m-editor'>
      <CenterComponent {...this.props} entity={this.props.app.rootEntity} zoom={1} />
    </div>);
  }
}

export const fragment = ReactComponentFactoryFragment.create({
  ns             : 'rootComponentClass',
  componentClass : RootEditorComponent,
});

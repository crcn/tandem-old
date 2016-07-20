import './index.scss';

import * as React from 'react';
import HeaderComponent from './header/index';
import FooterComponent from './footer/index';
import CanvasComponent from './canvas/index';
import { ReactComponentFactoryFragment } from 'saffron-common/lib/react/fragments/index';

export default class StageComponent extends React.Component<any, any> {
  render() {
    var file = this.props.file;
    var entity = file.entity;

    // entity might not have been loaded yet
    if (!entity) return null;
    return (<div className='m-editor-stage noselect'>
      <HeaderComponent {...this.props} />
      <CanvasComponent {...this.props} entity={entity} zoom={this.props.app.zoom} />
      <FooterComponent {...this.props} />
    </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment('components/stage/sfn', StageComponent);

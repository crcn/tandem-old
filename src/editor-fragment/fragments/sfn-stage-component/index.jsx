import './index.scss';

import React from 'react';
import HeaderComponent from './header';
import FooterComponent from './footer';
import CanvasComponent from './canvas';
import { ReactComponentFactoryFragment } from 'common/react/fragments';

export default class StageComponent extends React.Component {
  render() {
    var file = this.props.file;
    var entity = file.entity;
    return (<div className='m-editor-stage noselect'>
      <HeaderComponent {...this.props} />
      <CanvasComponent {...this.props} entity={entity} />
      <FooterComponent {...this.props} />
    </div>);
  }
}

export const fragment = ReactComponentFactoryFragment.create('components/stage/sfn', StageComponent);

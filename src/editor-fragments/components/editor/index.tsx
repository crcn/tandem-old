import * as React from 'react';
import { ROOT_COMPONENT as ROOT_COMPONENT_NS } from 'common/fragments/namespaces';
import BaseApplication from 'common/application/base';
import ComponentFragment from 'common/fragments/component';
import StageComponent from './stage/index';

export default class EditorComponent extends React.Component<{app:BaseApplication}, {}> {
  render() {
    return <StageComponent app={this.props.app} />;
  }
}

export const fragment = new ComponentFragment(ROOT_COMPONENT_NS, EditorComponent);

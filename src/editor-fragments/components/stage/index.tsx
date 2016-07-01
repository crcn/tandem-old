import * as React from 'react';
import ComponentFragment from 'common/fragments/component';
import { ROOT_COMPONENT as ROOT_COMPONENT_NS } from 'common/fragments/namespaces';

export default class EditorComponent extends React.Component<{}, {}> {
  render() {
    return <div>Hello</div>;
  }
}

export const fragment = new ComponentFragment(ROOT_COMPONENT_NS, EditorComponent);
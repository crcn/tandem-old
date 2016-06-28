import BaseApplicaton from 'common/application/base';
import RegisteredComponent from 'common/components/registered/index';
import * as React from 'react';

export default class PreviewComponent extends React.Component<{app:BaseApplicaton}, {}> {
  render() {
    return <div className='m-editor-preview m-editor-layer'>
      <RegisteredComponent ns={'previewComponent'} app={this.props.app} />
    </div>
  }
}
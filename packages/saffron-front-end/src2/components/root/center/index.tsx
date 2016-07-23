import './index.scss';
import * as React from 'react';
import RegisteredComponent from 'saffron-front-end/src/components/registered';

export default class CenterComponent extends React.Component<any, any> {
  render() {
    var currentFile = this.props.app.currentFile;
    return (<div className='m-editor-center'>
      {currentFile ? <RegisteredComponent {...this.props} ns={`components/stage/${currentFile.ext}`} file={currentFile} /> : void 0}
    </div>);
  }
}

import './index.scss';
import React from 'react';
import RegisteredComponent from 'common/react/components/registered';

export default class CenterComponent extends React.Component {
  render() {
    var currentFile = this.props.app.currentFile;
    return (<div className='m-editor-center'>
      {currentFile ? <RegisteredComponent ns={`components/stage/${currentFile.ext}`} file={currentFile} {...this.props} /> : void 0}
    </div>);
  }
}

import './index.scss';
import React from 'react';
import RegisteredComponent from 'common/react/components/registered';

export default class ToolsComponent extends React.Component {
  render() {

    var entity           = this.props.entity;
    var allEntities      = entity.flatten();
    var currentTool      = this.props.app.currentTool || {};
    var selectedEntities = this.props.app.selection || [];
    const zoom           = this.props.app.zoom;

    return (<div className='m-stage-tools'>
      <RegisteredComponent {...this.props} ns={`components/tools/${currentTool.name}/**`} allEntities={allEntities} selection={selectedEntities} zoom={zoom} />
    </div>);
  }
}

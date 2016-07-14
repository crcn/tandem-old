import React from 'react';
import DOMComponent from 'common/react/components/dom';
import compileXMLtoJS from 'common/compilers/xml';

import { ReactComponentFactoryFragment } from 'common/react/fragments';

// function convertStyle(style) {
//   const converted = {};
//   for (const key in style) {
//     let v = style[key];
//     if (/left|top|margin|width|height/.test(key) && !isNaN(v)) {
//       v = v + 'px';
//     }
//     converted[key] = v;
//   }
//   return converted;
// }

function renderPreview(entity, props) {
  var childNodes = (entity.childNodes || []).map(function(childNode) {

  });

  if (entity.type === 'display') {
    return;
  } else {

  }
}

export default class PreviewComponent extends React.Component {
  componentDidMount() {
    this._update();
  }
  shouldComponentUpdate(props) {
    return this.props.entity !== props.entity;
  }
  componentWillUpdate() {
    this.props.entity.section.remove();
  }
  componentDidUpdate() {
    this._update();
  }
  _update() {
    this.refs.container.appendChild(this.props.entity.section.toFragment());
  }
  render() {
    return (<div ref='container'>

    </div>);
  }
}

export const fragment = ReactComponentFactoryFragment.create({ ns: 'components/preview', componentClass: PreviewComponent });

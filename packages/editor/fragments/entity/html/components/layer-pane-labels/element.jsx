import './element.scss';
import React from 'react';

const CLASS_NAME_PRIORITY = [
  'id',
  'class'
];

class ElementLayerLabelComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    var label = [
      <span className='m-element-layer-label--tag'>&lt;</span>,
      <span className='m-element-layer-label--tag-name'>{entity.tagName}</span>
    ];

    var attrs = [];

    // pluck out the attributes
    for (var property in entity.attributes) {
      attrs.push({
        key   : property,
        value : entity.attributes[property]
      });
    }

    // filter them, and remove the items we do not want to display
    // (for now)
    attrs = attrs.filter(function(a) {
      return !!~CLASS_NAME_PRIORITY.indexOf(a.key);
    }).sort(function(a, b) {
      return CLASS_NAME_PRIORITY.indexOf(a.key) > CLASS_NAME_PRIORITY.indexOf(b.key) ? 1 : -1;
    });

    attrs.forEach(function(attr) {
      label.push(
        <span className='m-element-layer-label--key'>&nbsp;{attr.key}</span>,
        <span className='m-element-layer-label--operator'>=</span>,
        <span className='m-element-layer-label--string'>"{attr.value}"</span>
      )
    });

    label.push(

      <span className='m-element-layer-label--tag'>
        { entity.children.length === 0 ? ' /' : void 0 }
        &gt;
      </span>
    );

    return <div className='m-element-layer-label'>
      { label }
    </div>;
  }
}

export default ElementLayerLabelComponent;
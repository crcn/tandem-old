// // TODO - cache ALL computed information here until entity, or
// // parent entity changes.

// import CoreObject from 'saffron-common/src/object/index';
// import BoundingRect from 'saffron-common/src/geom/bounding-rect';

// import { translateStyleToIntegers } from 'saffron-common/src/utils/css/translate-style';

// import {
//   translateStyle,
// } from 'saffron-common/src/utils/css/index';

// import {
//   calculateZoom,
//   multiplyStyle,
// } from 'saffron-common/src/utils/html/index';

// class ReactEntityPreview extends CoreObject {


//   constructor(entity, node) {
//     super({
//       entity: entity,
//       node  : node,
//     });
//   }

//   setPositionFromAbsolutePoint(point) {

//     // absolute positions are always in pixels - always round
//     // to the nearest one
//     var element = this.node;
//     var offset  = getElementOffset(this.entity);

//     var bounds = this.getBoundingRect(false);
//     var style  = this.getStyle(false);

//     var originLeft = bounds.left - style.left;
//     var originTop  = bounds.top  - style.top;

//     var left = point.left;
//     var top  = point.top;

//     left -= offset.left;
//     top  -= offset.top;

//     // offset relative position (based on children)
//     if (/relative|static/.test(style.position)) {
//       left -= originLeft - offset.left;
//       top -= originTop - offset.top;
//     }

//     const newStyle = translateStyle({
//       left: left,
//       top: top,
//     }, this.entity.style, element);


//     this.entity.setProperties({ style: newStyle });
//   }

//   getZoom() {
//     return calculateZoom(this.node);
//   }

//   setBoundingRect(bounds) {

//     // NO zoom here - point is NOT fixed, but relative
//     var absStyle = this.getStyle(false);

//     var props = { ...bounds };

//     var paddingWidth = absStyle.paddingLeft + absStyle.paddingRight;
//     var paddingHeight = absStyle.paddingTop  + absStyle.paddingBottom;

//     props.width = Math.max(props.width - paddingWidth, 0);
//     props.height = Math.max(props.height - paddingHeight, 0);

//     // convert px to whatever unit is set on the style
//     Object.assign(props, translateStyle({
//       width: props.width,
//       height: props.height,
//     }, this.entity.style, this.node));

//     // FIXME: wrong place here - this is just a quick
//     // check to see if this *actually* works
//     this.setPositionFromAbsolutePoint({
//       left: bounds.left,
//       top : bounds.top,
//     });

//     delete props.left;
//     delete props.top;

//     this.entity.setProperties({ style: props });
//   }


//   getStyle(zoomProperties) {

//     var node = this.node;

//     var entity = this.entity;

//     var style = entity.style;

//     var { left, top } = translateStyleToIntegers({
//       left: style.left || 0,
//       top : style.top || 0,
//     }, node);

//     // normalize computed styles to pixels
//     var cStyle = this.getComputedStyle();

//     // zooming happens a bit further down
//     var rect = this.getBoundingRect(false);
//     var w = rect.right  - rect.left;
//     var h = rect.bottom - rect.top;

//     style = {
//       ...cStyle,
//       left      : left,
//       top       : top,
//       width     : w,
//       height    : h,

//       // for rect consistency
//       right     : left + w,
//       bottom    : top  + h,
//     };

//     // this normalizes the properties so that the calculated values
//     // are also based on the zoom level. Important for overlay data such as
//     // tools and information describing the target entity
//     if (zoomProperties) {
//       style = multiplyStyle(style, this.getZoom());
//     }

//     return style;
//   }
// }

// export default ReactEntityPreview;

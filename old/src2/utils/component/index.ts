export { default as startDrag } from './start-drag';

export function getStyle(props, styleName, defaults) {
  if (!props.styles || !props.styles[styleName]) return defaults;
  return props.styles[styleName];
}

// react logs an error without this
export function shutUpChange() {

}

export default function(entity, styleName) {
  return {
    property: styleName,
    target: entity,
    getValue() {
      return entity.attributes.style[styleName];
    },
    setValue(value) {
       entity.setStyle({
         [styleName]: value
       })
    }
  };
};

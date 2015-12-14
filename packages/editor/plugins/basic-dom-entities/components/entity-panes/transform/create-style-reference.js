export default function(entity, styleName) {
  return {
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

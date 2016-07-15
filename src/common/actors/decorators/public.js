export default (proto, name) => {

  if (!proto.__publicProperties) {
    proto.__publicProperties = [];
  }

  proto.__publicProperties.push(name);
};

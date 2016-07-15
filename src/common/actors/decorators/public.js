export default (proto, name) => {

  if (!proto.publicProperties) {
    proto.publicProperties = [];
  }

  proto.publicProperties.push(name);
};

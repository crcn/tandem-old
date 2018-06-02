module.exports = (module) => {

  const mapModule = (module) => {
    return Object.assign({}, module, {
      version: "0.0.3",
      children: module.children.map(mapFrame)
    });
  };

  const mapFrame = (frame) => {
    const firstChild = mapNode(frame.children[0]);
    return Object.assign({}, firstChild, {
      metadata: {
        bounds: frame.bounds
      }
    });
  };

  const mapNode = (node) => Object.assign({}, node, {
    metadata: {},
    children: node.children.map(mapNode)
  });

  return mapModule(module);
};
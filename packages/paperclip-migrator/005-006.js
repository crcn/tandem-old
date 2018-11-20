module.exports = (module) => {
  const mapModule = (module) => {
    return {
      id: module.id,
      version: "0.0.6",
      metadata: {},
      name: "module",
      children: module.children.map(mapNode)
    };
  };

  const mapNode = (node) => {
    if (node.name === "media-query") {
      return {
        id: node.id,
        children: node.children,
        metadata: node.metadata,
        label: node.label,
        name: "query",
        type: 0,
        condition: {
          minWidth: node.minWidth,
          maxWidth: node.maxWidth
        }
      }
    }

    return node;
  };

  return mapModule(module);
};

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
    if (!node.style) {
      return {
        ...node,
        children: node.children.map(mapNode)
      }
    }

    const style = {};

    for (const key in node.style) {
      style[key] = {
        type: "raw",
        value: node.style[key]
      };
    }

    return {
      ...node,
      children: node.children.map(mapNode),
      style
    };
  };

  return mapModule(module);
};

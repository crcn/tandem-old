module.exports = (module) => {
  const mapModule = (module) => {
    return {
      id: module.id,
      version: "1.0.0",
      metadata: {},
      name: "module",
      children: module.children.map(mapNode)
    };
  };

  const mapNode = (node) => {

    let newNode = {...node};

    if (node.style) {
      const newStyle = [];
      for (const key in node.style) {
        newStyle.push({
          key,
          value: node.style[key]
        })
      }
      newNode.style = newStyle;
    }

    if (node.attributes) {
      const newAttributes = [];
      for (const key in node.style) {
        newAttributes.push({
          key,
          value: node.attributes[key]
        })
      }
      newNode.attributes = newAttributes;
    }

    return {
      ...newNode,
      children: node.children.map(mapNode)
    };
  };

  return mapModule(module);
};

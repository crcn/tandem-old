module.exports = (module) => {
  const mapModule = (module) => {
    return {
      id: module.id,
      version: "1.0.1",
      metadata: {},
      name: "module",
      children: module.children.map(mapNode)
    };
  };

  const mapNode = (node) => {

    let newNode = {...node};

    if (node.name === 'override') {
      newNode.type = node.propertyName;
      delete newNode.propertyName;
      if (node.propertyName === 'style') {
        newNode.type = 'add-style-block';
        const value = [];
        for (const key in node.value) {
          value.push({key, value: node.value[key]});
        }
        newNode.value = value;
      }
      if (node.propertyName === 'attributes') {
        newNode.type = 'add-attributes';
        const value = [];
        for (const key in node.value) {
          value.push({key, value: node.value[key]});
        }
        newNode.value = value;
      }
    }

    

    return {
      ...newNode,
      children: node.children.map(mapNode)
    };
  };

  return mapModule(module);
};

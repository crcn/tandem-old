const generateId = () => (Math.round(Math.random() * 9999999999) + "." + Date.now());

module.exports = (module) => {
  const mapModule = (module) => {
    return {
      id: module.id,
      version: "1.0.2",
      metadata: {},
      name: "module",
      children: module.children.map(mapNode)
    };
  };

  const mapNode = (node) => {

    let newNode = {...node};

    if (node.name === 'override' && node.type === 'add-style-block') {
      newNode = {
        ...newNode,
        type: 'add-style-blocks'
        value: 
      }
    }

    

    return {
      ...newNode,
      children: node.children.map(mapNode)
    };
  };

  return mapModule(module);
};

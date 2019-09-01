module.exports = (module) => {
  const mapModule = (module) => {
    return {
      id: module.id,
      version: "1.0.4",
      metadata: {},
      name: "module",
      children: module.children.map(mapNode)
    };
  };

  const mapNode = (node) => {

    let newNode = {...node};

    const overrides = node.children.filter(child => child.name === 'override');

    if (node.name === 'component' || node.name === 'component-instance') {
      newNode = {
        ...newNode,
        overrides: overrides.map(override => ({
          ...override,
          name: undefined,
        }))
      }
    } else if (overrides.length) {
      console.error(`Override child of ${node.id} not part of instance of component`);
    }

    return {
      ...newNode,
      children: node.children.filter(child => child.name !== 'override').map(mapNode)
    };
  };

  return mapModule(module);
};

const generateId = () => (Math.round(Math.random() * 9999999999) + '.' + Date.now());

module.exports = (module) => {
  const mapModule = (module) => {
    return {
      id: module.id,
      version: '1.0.2',
      metadata: {},
      name: 'module',
      children: module.children.map(mapNode)
    };
  };

  const mapNode = (node) => {

    let newNode = {...node};
    
    if (node.styleMixins) {
      newNode = {
        ...newNode,
        styles: Object.keys(newNode.styleMixins).sort((a, b) => {
          return newNode.styleMixins[a].priority > newNode.styleMixins[b].priority ? 1 : -1
        }).map(key => ({
          id: generateId(),
          mixinId: key,
          parts: {},
          properties: [],
        }))
      }

      delete newNode.styleMixins;
    }

    if (node.style) { 
      const styles = newNode.styles || [];
      newNode = {
        ...newNode,
        styles: [createStyleDeclaration(newNode.style, newNode.variantId), ...styles]
      }
      delete newNode.style;
    }
    
    if (node.name === 'override' && node.type === 'add-style-block') {
      newNode = {
        id: node.id,
        name: 'override',
        type: 'styles',
        targetIdPath: newNode.targetIdPath,
        value: [
          convertStyleOverride(node)
        ]
      }
    }

  
    return {
      ...newNode,
      children: node.children.map(mapNode)
    };
  };

  return mapModule(module);
};

const convertStyleOverride = (node) => createStyleDeclaration(node.value, node.variantId);

const createStyleDeclaration = (properties, variantId) => ({
  id: generateId(),
  parts: {},
  variantId,
  properties
});


const getSelfOverrides = (node) => node.children.find(child => {
  return child.name === 'override' && child.targetIdPath.length === 0;
});



const getSelfStyleOverrides = (node) => node.children.find(child => {
  return child.name === 'override' && child.targetIdPath.length === 0;
});
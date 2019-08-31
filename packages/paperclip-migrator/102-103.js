const {memoize} = require('tandem-common');

module.exports = (module) => {

  const mapModule = (module) => {
    return {
      id: module.id,
      version: '1.0.3',
      metadata: {},
      name: 'module',
      children: module.children.map(mapNode)
    };
  };

  const mapNode = (node) => {

    let newNode = {...node};

    const directOverrides = getDirectOverrides(node, module);

    if (directOverrides.length) {
      console.log("HAS DIRECT");
    }
  
    return {
      ...newNode,
      children: node.children.filter(child => {
        return !isDirectOverride(child, module);
      }).map(mapNode)
    };
  };

  return mapModule(module);
};

const getParentChildMap = memoize((parent) => {
  const map = {};
  for (const child of parent.children) {
    map[child.id] = parent;
    Object.assign(map, getParentChildMap(child));
  }
  return map;
});

const getNodeById = memoize((nodeId, root) => {
  if (nodeId === root.id)  return root;
  const parentChildMap = getParentChildMap(root);
  const parent = parentChildMap[nodeId];
  return parent && parent.children.find(child => child.id === nodeId);
});

const getContentNode = (node, module) => {
  const ancestors = getAncestors(node, module);
  return ancestors[0];
}; 

const getAllOverrides = memoize((currentNode) => { 
  const overrides = [];
  for (const child of currentNode.children) {
    if (child.name === "override") {
      overrides.push(child);
    }
    overrides.push(...getAllOverrides(child));
  }
  return overrides;
});

const getDirectOverrides = memoize((node, module) => {
  return getAllOverrides(module).filter((override) => {
    if (override.targetIdPath.length === 0) {
      return node.children.some(child => child.id === override.id);
    }

    if (override.targetIdPath.length === 1 && override.targetIdPath[override.targetIdPath.length - 1] === node.id && getContentNode(override, module) === getContentNode(node, module)) {
      return true;
    }

    return false;
  });
});

const isDirectOverride = memoize((override, module) => {
  if (override.name !== "override") {
    return false;
  }
  
  if (override.targetIdPath.length === 0) {
    return true;
  }
  if (override.targetIdPath.length > 1) {
    return false;
  }

  const targetNodeId = override.targetIdPath[override.targetIdPath.length - 1];
  const targetNode = getNodeById(targetNodeId, module);
  return targetNode && getContentNode(targetNode, module) === getContentNode(override, module);
});

const containsNodeId = (nodeId, containerNode) => Boolean(getParentChildMap(containerNode)[nodeId]);

const getAncestors = memoize((node, module) => {
  const parentChildMap = getParentChildMap(module);
  const ancestors = [];
  let current = node;
  while (1) {
    const parent = current = parentChildMap[current.id];
    if (!parent) {
      break;
    }
    ancestors.push(parent);
  }

  return ancestors;
});
const { merge } = require("lodash");

module.exports = (module) => merge({}, module, {
  version: "0.0.1",
  children: module.children.map(mapModuleChild)
});

const mapModuleChild = (child) => {
  if (child.name === "component") {
    return mapComponent(child);
  }
  return child;
}

const mapComponent = (component) => merge({}, component, {
  attributes: {
    core: {
      name: component.attributes.core.id,
      id: null
    }
  }
});
const _000 = require("./0.0.0");

const migrators = {
  "0.0.0": _000
};

module.exports = (oldModule) => {
  const migrate = migrators[oldModule.version || "0.0.0"];
  return migrate ? migrate(oldModule) : oldModule;
};

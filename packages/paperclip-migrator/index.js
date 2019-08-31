const _000_001 = require("./000-001");
const _001_002 = require("./001-002");
const _002_003 = require("./002-003");
const _003_004 = require("./003-004");
const _004_005 = require("./004-005");
const _005_006 = require("./005-006");
const _006_100 = require("./006-100");
const _100_101 = require("./100-101");
const _101_102 = require("./101-102");
const _102_103 = require("./102-103");

const migrators = {
  "0.0.0": _000_001,
  "0.0.1": _001_002,
  "0.0.2": _002_003,
  "0.0.3": _003_004,
  "0.0.4": _004_005,
  "0.0.5": _005_006,
  "0.0.6": _006_100,
  "1.0.0": _100_101,
  "1.0.1": _101_102,
  "1.0.2": _102_103,
};

module.exports = (oldModule) => {
  const migrate = migrators[oldModule.version || "0.0.0"];
  return migrate ? module.exports(migrate(oldModule)) : oldModule;
};

const fs = require("fs");
const path = require("path");
const { PACKAGES, PM_BIN } = require("../constants");
const { logNotice, exec, vtok } = require("../utils");
const linkPackages = require("./link-packages");
const installPackages = require("./install-packages");
const buildPackages = require("./build-packages");

setup({
  packages: PACKAGES,
  only: vtok((process.env.ONLY || "install/link/build").split("/")),
  no: vtok((process.env.NO || "").split("/")),
  watch: Boolean(process.env.WATCH)
});

async function setup(context) {
  if (context.only.install && !context.no.install) {
    await installPackages(context);
  }
  if (context.only.link && !context.no.link) {
    await linkPackages(context);
  }
  if (context.only.build && !context.no.build) {
    await buildPackages(context);
  }
}

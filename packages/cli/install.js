const path = require("path");
const fs = require("fs");
const {platform, arch} = process;
const { tmpdir } = require("os");
const { version } = require("./package");
const request = require("request");
const ProgressBar = require("progress");
const {mkdirpSync} = require("fs-extra");
const { spawn } = require("child_process");
const glob = require("glob");

const archName = `${platform}-${arch}`;
const fileName = `${archName}-v${version}.zip`;
const filePath = path.join(__dirname, fileName);
const url = `https://github.com/tandemcode/tandem/releases/download/v${version}/${archName}.zip`;

download(url, `${tmpdir()}/tandem/${fileName}`, path.join(__dirname, "app"));

function download(url, filePath, unzipPath) {
  if (fs.existsSync(filePath)) {
    return install(filePath, unzipPath);
  }

  console.log(`Downloading %s`, url);

  try {
    mkdirpSync(path.dirname(filePath));
  } catch(e) {

  }

  return new Promise((resolve, reject) => {
    request.get(url).on("response", (response) => {
      const contentLength = parseInt(response.headers['content-length'], 10);
      const bar = new ProgressBar(`Downloading Tandem [:bar]`, { width: 40, total: contentLength })

      response.on("data", (chunk) => {
        bar.tick(chunk.length);
      });

      response.on("end", function () {
        console.log("\n");
        install(filePath, unzipPath).then(resolve, reject);
      });

    })
    .pipe(fs.createWriteStream(filePath));
  });
};

function install(filePath, unzipPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(unzipPath)) {
      return resolve();
    }
    const proc = spawn("unzip", [filePath, "-d", unzipPath]);
    proc.on("end", resolve);
  }).then(() => {
    return link(unzipPath);
  });
}

function link(unzipPath) {
  const symlinkPath =  path.join(__dirname, "app", "tandem");
  const [appFilePath] = glob.sync(path.join(unzipPath, "*/Tandem.app"));
  const binPath = path.join(appFilePath, "Contents", "Resources", "app", "bin", "tandem");
  try {
    fs.unlinkSync(symlinkPath);
  } catch(e) {

  }
  console.log(binPath);
  fs.symlinkSync(binPath, symlinkPath);
  return Promise.resolve();
}

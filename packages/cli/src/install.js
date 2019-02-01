const path = require("path");
const fs = require("fs");
const {platform, arch} = process;
const { tmpdir } = require("os");
const { distVersion } = require("../package");
const request = require("request");
const ProgressBar = require("progress");
const {mkdirpSync} = require("fs-extra");
const { spawn } = require("child_process");
const glob = require("glob");

const archName = `${platform}-${arch}`;
const fileName = `${archName}-v${distVersion}.zip`;
const filePath = path.join(__dirname, fileName);
const url = `https://github.com/tandemcode/tandem/releases/download/v${distVersion}/${archName}.zip`;

exports.start = () => {
  download(url, `${tmpdir()}/tandem/${fileName}`, path.join(__dirname, "app")).then(() => {
    console.log("Done!");
  });
}

function download(url, filePath, unzipPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      return resolve();
    }

    try {
      mkdirpSync(path.dirname(filePath));
    } catch(e) {

    }
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
    .pipe(fs.createWriteStream(filePath))
    .on("end", resolve);
  }).then(() => {
    return install(filePath, unzipPath);
  });
};

function install(filePath, unzipPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(unzipPath)) {
      return resolve();
    }
    console.log("Unzipping %s", filePath);
    const proc = spawn("unzip", ["-qq", filePath, "-d", unzipPath]);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("exit", resolve);
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
  fs.symlinkSync(binPath, symlinkPath);
  return Promise.resolve();
}

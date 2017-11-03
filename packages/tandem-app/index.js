// used for code editor extensions


exports.getEntryHTML = function({ filePrefix, apiHost, proxy, localStorageNamespace }) {
  if(!filePrefix) {
    filePrefix = `file://${__dirname}`;
  }
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Tandem</title>
    <link rel="stylesheet" href="${filePrefix}/lib/front-end/entry.bundle.css">
  </head>
  <body>
    <div id="application"></div>
    <script>
      var config = {
        apiHost: "${apiHost}",
        proxy: "${proxy}",
        localStorageNamespace: "${localStorageNamespace}"
      }
    </script>
    <script src="${filePrefix}/lib/front-end/entry.bundle.js"></script>
  </body>
</html>
`;
}
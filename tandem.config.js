module.exports = {
  dependencyGraph: {

  },
  artboard: {
    templates: {
      test: /tsx/,

      // optional. If this is omitted, the component
      // is used as an entry point
      use: template`
        import * as React;
        import * from "${filePath}";
        export cont renderPreview = (() => {
          // render component here
        })
      `
    }
  }
};
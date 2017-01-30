
#### Installing

Before you begin, ensure that you have `Node@7.4.0` or newer installed.

Assuming that you're running on `OSX`, or `Linux`, go ahead and run `git clone git@github.com:tandemcode/tandem.git; cd tandem; npm install; WATCH=1 npm run build`. After that, go ahead and run `npm run code workspace.tandem` which will open Tandem *in* Tandem:

After you've booted up Tandem in Tandem, open up the `src/**` directory and start hacking away.

#### CLI commands

Other CLI commands that may help with the dev process

```
# builds the source files in out/
npm run build;

# builds the distributable app in dist/zip/[app].zip
npm run build:dist

# runs the desktop application
npm run code;

# runs tests
npm test;
```

#### Directory structure

- `src/` - source files for main `Tandem` application, and packages
  - `@tandem/` - tandem packages (core modules & extensions)
  - `tandem-client/` - client library communicating with tandem app - used in vscode, and atom extensions.
  - `tandem-code/` - tandem desktop application sources
  - `webpack-tandem-jsx-loader/` - [Webpack](//webpack.js.org) JSX loader for Tandem

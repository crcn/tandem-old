## 1. Creating a new project

If you haven't already installed the command line tools, go ahead and `cd` to your project directory, then run:

```
npm install tandem-cli --save-dev
```

After that you can initialize a new Tandem project by running:

```
./node_modules/.bin/tandem init
```

> If Tandem isn't already downloaded, `init` will go ahead and download the release associated with the `tandem-cli` version. Installing the `tandem-cli` package with your project (instead of globally) ensures that you're using the _correct_ version of Tandem with your UI files.

After you've initialized your project, you can open it up with:

```
./node_modules/.bin/tandem open
```

> More docs for the CLI fool can be found in the [CLI package](./packages/cli)

At this point Tandem should be opened. Go ahead and create your first component file like so:

![Add new file](./assets/add-new-component-file.gif)

That's it! From here you can start building UIs. Note that you can have as many UI files as you want, and they can be organized anywhere in your project. Generally what _I_ like to do is create one UI file per component.

Now onto setting up your build configuration.

## 2. Configuring your bundler

Setting up the build configuration is necessary in order to connect UI files with your application code.

#### Webpack setup

Here's a basic `webpack.config.js` example:

```javascript
const fs = require("fs");

module.exports = {
  mode: "development",
  entry: "./src/index,js",
  output: {
    path: "./lib",
    filename: "[name].bundle.js"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /.pc$/,
        use: [
          {
            loader: "paperclip-react-loader",
            options: {
              // the config is just the contents of your Tandem project file.
              config: JSON.parse(fs.readFileSync("./app.tdproject", "utf8"))
            }
          }
        ]
      }
    ]
  }
};
```

Additonal documentation for Webpack can be found in the [paperclip-react-loader package](../packages/paperclip-react-loader).

---

After you have your webpack

## 3. Creating UI controllers

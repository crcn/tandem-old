import * as React from "react";
import { ProjectTemplate, ProjectFileCreator } from "../../state";
import { ReactStartKitOptionsForm } from "./form.pc";
import {
  createPCModule,
  createPCComponent,
  createPCTextNode,
  PCVisibleNodeMetadataKey
} from "paperclip";
import { createBounds } from "tandem-common";

export const template: ProjectTemplate = {
  id: "react",
  icon: null,
  label: "React"
};

export type ReactProjectOptions = {
  packageName?: string;
};

export class OptionsForm extends React.PureComponent<{ onChangeComplete }> {
  render() {
    return <ReactStartKitOptionsForm />;
  }
}

export const createFiles: ProjectFileCreator = ({
  packageName = "my-app-name"
}: ReactProjectOptions) => {
  let mainComponent = createPCComponent(
    "Application",
    null,
    null,
    null,
    [createPCTextNode("App content")],
    {
      [PCVisibleNodeMetadataKey.BOUNDS]: createBounds(0, 600, 0, 400)
    }
  );

  mainComponent = {
    ...mainComponent,
    controllers: ["./main.tsx"]
  };

  return {
    "package.json": JSON.stringify(
      {
        name: packageName,
        version: "1.0.0",
        description: "",
        main: "index.js",
        scripts: {
          test: 'echo "Error: no test specified" && exit 1',
          build: "webpack",
          design: "tandem app.tdproject"
        },
        repository: {
          type: "git",
          url: "git+https://github.com/tandemcode/tandem-react-starter-kit.git"
        },
        author: "",
        license: "ISC",
        bugs: {
          url: "https://github.com/tandemcode/tandem-react-starter-kit/issues"
        },
        homepage:
          "https://github.com/tandemcode/tandem-react-starter-kit#readme",
        devDependencies: {
          "html-webpack-plugin": "^3.2.0",
          "paperclip-react-loader": "^10.0.10",
          "tandem-cli": "10.0.21",
          "ts-loader": "^4.4.2",
          typescript: "^2.9.2",
          webpack: "^4.15.1",
          "webpack-cli": "^3.0.8"
        },
        dependencies: {
          react: "^16.4.1",
          "react-dom": "^16.4.1"
        }
      },
      null,
      2
    ),
    "./src/main.pc": JSON.stringify(createPCModule([mainComponent]), null, 2),
    "./src/main.tsx":
      `` +
      `import * as React from "react";
import {BaseApplicationProps} from "./main.pc"

export type Props = {

};

export const (Base: React.ComponentClass<BaseApplicationProps>) class ApplicationController extends React.PureComponent<Props> {
  render() {
    return <Base />;
  }
}

`,
    "webpack.config.js":
      `` +
      `
const {resolve} = require("path");
const webpack   = require("webpack");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  devtool: "none",
  mode: "development",
  entry: {
    index: [__dirname + "/src/entry.ts"]
  },
  output: {
    path: resolve(__dirname, "lib"),
    filename: "[name].bundle.js"
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    modules: [
      resolve(__dirname, "node_modules")
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [
      { test: /\.pc$/, use: [{
          loader: "paperclip-react-loader",
          options: {
            config: JSON.parse(fs.readFileSync("./app.tdproject", "utf8"))
          }
        }]
      },
      {
        test: /\.tsx?$/,
        use: ["ts-loader"]
      }
    ]
  }
};
`
  };
};

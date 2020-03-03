<!--

TODOS:

- When to use slots
- importing components
- moduleDirectories

-->

1. First download the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=crcn.paperclip-vscode-extension). 
1. Open any project, and create a Paperclip file (something like `hello-world.pc`).
1. Open the Paperclip Preview & start typing away!

**What if I don't have VS Code??**

For _now_ you can use Webpack + HMR. For this initial Alpha version though, Paperclip's live preview functionality only works in VS Code. 

## Setting up Webpack + React

For this step you'll need to be familiar with Webpack and React

> ✨I'd recommend you take a look at the [React TodoMVC](../../examples/react-todomvc) example to have a better look about how to configure Paperclip with your React app. 

You'll need to install `paperclip-loader`, and `paperclip-react-compiler` as dev dependencies. After that, you'll need a `pcconfig.json` that looks something like:

```json
{
  "compilerOptions": {
    "name": "paperclip-react-compiler"
  },
  "moduleDirectories": ["./src"],
  "filesGlob": "./src/**/*.pc"
}

```

> Documentation for `pcconfig.json` can be found [here](../Paperclip%20Config).

From there, go ahead and set up your `webpack.config.js` file to include the `paperclip-loader`:

```javascript

module.exports = {
  /* ... more config here ... */
  module: {
    rules: [
      {
        test: /\.pc$/,
        loader: "paperclip-loader",
        include: [path.resolve(__dirname, "src")],
        exclude: [/node_modules/],
        options: {
          config: require("./pcconfig.json")
        }
      }
    ]
  }
};

```

#### Generating Typed Definition Files

If you're using TypeScript, then you'll probably want additional type safety around Paperclip files. To do that, you'll need to CLI tools: `yarn add paperclip-cli --dev`. You'll also need to install a compiler -- for now the only option you have is React, so add that: `yarn add paperclip-react-compiler --dev`. After that, you can generate typed definition files like so:

```
./node_modules/.bin/paperclip --compiler=paperclip-react-compiler --definition --write
```


> ⚠️ This command assumes that you have your `pcconfig.json` file set up. If not, refer to the docs above.

> ❓For more information about using the CLI tool, you can check out the [package](../../packages/paperclip-cli). 

> ✨ I also recommend that you include `*.pc.d.ts` in your `.gitignore` file so to keep the typed definition files out of GIT. 

To make this command a bit easier to use, you can add it to your `package.json` file:

After all that you can start writing Paperclip templates! 

TODO - build kitchen sink example

```html
<style>
  span {
    color: pink;
    font-family: Helvetica;
  }
</style>

<part id="TodoItem">

<!-- this gets exported as the default part -->
<part id="TodoList">
  <input type="">
</part>

<preview>
  <default message="World!">
</preview>
```

After that, create a corresponding `hello-world.jsx` file, and type in:

```javascript
import React from "react";
import HelloWorldView from "./hello-world.pc";
export default function HelloWorld() {
  return <HelloWorldView message="World" />
}
```

> For simplicity, I typically create a JSX file for each PC file. The PC file contains most of the UI code, and the JSX file contains the logic. 

Then in your application _entry_ point, type in:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import HelloWorld from "./hello-world.pc";
const mount = document.createElement("div");
document.body.appendChild(mount);
ReactDOM.render(<HelloWorld />, mount);
```

That's it! 


#### Writing Paperclip Templates
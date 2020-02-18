CLI tool for compiling paperclip templates.

**Installation: `npm i paperclip-cli --save-dev`**

#### Usage

```
Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --compiler  Language compiler target
  --write     Write compiled file
  --config    Config file
  --watch
```

#### Setup

The easiest way to get setup is to first define a `pcconfig.json` file:

```javascript
{
  "compilerOptions": {

    // Code compiler to use
    "name": "paperclip-react-compiler",

    // Parts of template to omit from compilation
    "omitParts": ["preview"]
  },

  //
  "filesGlob": "**/*.pc"
}
```

From there, open terminal and `cd` to the directory of the `pcconfig.json`, then run:

```bash
paperclip
```

☝️ This should generate code for you in the `stdout`. To _write_ code to disc, just run:

```bash
paperclip --write
```

☝️ This will write JS files in the same directories as the PC files.

The `paperclip-react-compiler` module has the ability to generate `*.d.ts` files if you're using TypeScript. To use that output you can simply run:

```bash
paperclip --definition --write --watch
```

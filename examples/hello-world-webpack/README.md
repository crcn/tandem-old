Simple webpack demonstration that uses the [Tandem JSX Loader](/tandemcode/webpack-tandem-jsx-loader). 

#### Installation:

Assuming that you already have [NodeJS](https://nodejs.org/en/), and Tandem (closed for beta testing) installed, go
ahead and run: 

```
npm install
```

Next, open Tandem, select "Open existing project" from the welcome window, and point to the `out/index.html` file generated
in this directory. If you prefer using the command line, you can run `tandem out/index.html` (assuming that you've installed the Tandem shell scripts).

Now that you have Tandem running, any file changes made to `src/index.ts` will automatically be reflected in the visual editor. Also note that you can
cmd+click any visual element in Tandem to show where the element is generated in the source code.

TODOS:

- scss loader
<p align="center">
  <img src="assets/logo.svg" width="170px">
  <h1 align="center">Tandem (Preview)</h1>
</p>

<br />

> This repository is _temporarily_ private until bugs the UX have been worked out.

<br />

Tandem is a visual editor for building web components. It can cover _most_ of your HTML & CSS development, and is designed to be compatible with most web-based languages, and frameworks. It currently works with React.

## Features

Here are just a few highlights of what Tandem can do:

#### Create HTML & CSS visually

Tandem covers most of your web UI creation, so you can say goodbye to writing HTML & CSS by hand for the most part (except for more complex cases).

#### Compiles to code

Compile UI files to your language or framework of choice. You can even compile to _multiple_ targets if you want to. Want to target PHP (coming soon) _and_ React code? You can do that.

#### Immediate Feedback

No need to wait around for your code to compile. Tandem provides immediate feedback of your HTML & CSS, so you can cut down the amount of time it takes to build your web app.

More tooling & optimizations are in the pipeline to make Tandem feel more like pen & paper.

#### Safety First

UI files use CSS but without the "cascading" part of it, so you don't have to worry about styles overridding each other. If your using a strongly typed language like TypeScript, Tandem provides utilities around generating typed definition files for design files.

#### Organizes like code

Transparent, and unopinionated about how you work or organize your application.

#### Translate designs faster

Tandem makes it easier to translate design files from Sketch & Figma with [CLI tooling](./packages/paperclip-design-converter). You'll soon be able to even use your original design files as the source of truth for basic styles like colors & fonts.

## Resources

Ready to get started? Here are a few resources to help you out:

- [User Guide](./docs/user-guide)
- [Terminology & Concepts](./docs/concepts.md)
- [Goals & Non-goals](./docs/goals.md)
- [Design process](./docs/design-process.md)
- [Examples](https://github.com/tandemcode/examples)
- [Document format](./docs/document-format.md)
- Contributing
  - [Development](./docs/contributing/development.md)

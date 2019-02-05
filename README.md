<p align="center">
  <img src="assets/logo.svg" width="170px">
  <h1 align="center">Tandem (Preview)</h1>
</p>

> Tandem is still new, so expect bugs. If you'd like to contribute, feel free to reach out to hello@tandemcode.com.

Tandem is a UI builder for web applications. It currently works with React, other languages & frameworks will be supported in the future. The primary goal for Tandem is to provide a faster, easier, safer, and more scalable alternative to handwritten HTML & CSS code.

![Split view](./assets/screenshots/v10.1.7.png)

### Installation

Tandem works in Windows & MacOS. There are a few ways you can install it:

a. Download the stand alone version: https://github.com/tandemcode/tandem/releases

b. Install the command line tools:

```bash
npm install tandem-cli --save-dev
cd path/to/app

# Create a new project
./node_modules/.bin/tandem init

# Open project
./node_modules/.bin/tandem open
```

The command line tools can manage multiple versions of Tandem, which is helpful for multiple projects that use different UI file (`*pc`) versions.

More info can be found in the [installation docs](./docs/installation.md)

### Highlights

- Designed to work with existing code (currently only React).
- Not a code replacement. Tandem only allows you to create simple HTML & CSS.
- Unopinionated, so you can adapt Tandem to fit your needs.
- UI files can be split out into multiple files, and organized however you want.
- Handwritten HTML & CSS can be mixed with Tandem UIs (this is helpful if you need to integrate complex code).
- Few abstractions. Tandem gives you transparent tooling that's based on web standards.

### Resources

- [Installation](./docs/installation.md)
- [Releases](https://github.com/tandemcode/tandem/releases)
- [Tutorial videos](https://www.youtube.com/playlist?list=PLCNS_PVbhoSXOrjiJQP7ZjZJ4YHULnB2y)
- [Terminology & Concepts](./docs/concepts.md)
- [Goals & Non-goals](./docs/goals.md)
- [Examples](./examples)
- [Development](./docs/contributing/development.md)
- Language integrations
  - [React](./packages/paperclip-react-loader)

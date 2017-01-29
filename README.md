<!--[![Build Status](https://travis-ci.com/crcn/tandem.svg?token=36W5GEcyRPyiCuMVDHBJ&branch=master)](https://travis-ci.com/crcn/tandem) -->

> **If you find this software useful, please consider [becoming a backer](https://www.patreon.com/crcn) to help fund for the development of features, documentation, videos, tutorials, examples, and bug fixes.** 

Tandem is a code-first & extensible visual editor for web development that is intended to work with all programming languages and frameworks (JavaScript, ReactJS, AngularJS, PHP, Ruby, Sass, CSS, HTML, and others). You can use Tandem with your existing codebase to visually create features without risk, or lock-in. 

Tandem integrates with your existing text editor by synchronizing code changes. Tandem automatically reloads a live preview of your app when you write code. When you make visual edits, Tandem sends code back to your text editor in the languages you're using (Sass, TypeScript, JSX, HTML, and CSS are currently supported). If you don't like the code that Tandem writes, you can easily change it.

![syncing](https://cloud.githubusercontent.com/assets/757408/21443430/c412ff9a-c86a-11e6-9e36-71df05a94ea0.gif)

As part of a litmus test, **Tandem was used to build itself**. Here's a screenshot of Tandem running *in* Tandem:

![screenshot 2016-12-22 15 48 03](https://cloud.githubusercontent.com/assets/757408/22388273/ce17a5e0-e4ad-11e6-9327-7d7ba3dc95bf.png)

### Links

- [Patreon page](https://www.patreon.com/crcn)
- [Videos](youtube-channel-here)
  - [Getting started](TODO)
  - [Using Tandem with React](TODO)
- [Development](./docs/development) - Docs for anyone that wants to extend Tandem.
- [Example projects](https://github.com/tandemcode/examples) - example projects that integrate well with Tandem.

### Goals and Motivation

The following principles were (and are) used in creating of Tandem. 

- Provide tooling that enables you to most of your application development visually, and without needing to write code.
- Transparent tooling that doesn't hide or abstract how Tandem represents your application code.
- Speed up development process with a more intuitive approach to building applications.
- Increase understanding of CSS & HTML with built-in documentation, suggestions, and tools (like intellisense).
- Speed up development cycles by including design, prototyping, and development into one application.
- Reduce barrier for non-coders who want to create applications.
- Provide CSS tooling for animations, 3D, and other features that are hard to code by hand.
- Include all cross-browser testing, development, and debugging into one application.

### Installation

You can play with the most recent OSX builds [here](https://www.dropbox.com/sh/k9eqwmksv0655ss/AABQyfP5xWf4nbynRm0-OxKJa?dl=0). **Please note that the current application is a *preview* of what's to come. Expect bugs, and missing features**. Aso be sure
to install the [Atom](https://atom.io/packages/atom-tandem-extension), or [VSCode](https://marketplace.visualstudio.com/items?itemName=tandemcode.tandem-vscode-extension) extensions for the best experience.

### Who's this application intended for?

- Professional web developers 
- Teams that want to reduce the barrier for contributing to the development of web applications
  - Collaboration (see features below) functionality enables developers to invite designers, and other teammates to co-develop web applications.
  - Tandem is extensible, meaning that teams can add features that fit their application needs (kind of like a CMS), and team workflow.
  - Tandem will be integratable,  with other systems such as Jenkins (for visual QA testing), Optimizely (for a/b testing), and Launch darkly (for feature flagging).
- Individuals who are starting to learn how to code.
- Educators
- Companies that want to integrate Tandem into their own product. 
- Tandem's core is modular enough to be usable in other visual editing contexts.

### Features

- Writes code in HTML, CSS, Sass, TypeScript, and JSX.
- Integrates with Atom, and Visual Studio Code.
- Visual tools for media queries, filters, gradients, fonts, css flexbox, measuring, dragging items, responsive testing, and more.
- Multiple live previews allows you to see how code changes affect your application in different states, pages, and sizes.
- Hot swapping HTML & CSS ensures that your visual editing is fluid, and never interrupted.
- Interact with previews like a normal web browser. 
- Interactions (clicks, keyboard inputs) synchronize with other previews in different device sizes, and browser rendering engines.


### Roadmap

Below are a few highlighted features planned for Tandem. Cast your vote with  👍 or 👎 for features in [issues tab](tandemcode/tandem/issues?q=is%3Aopen+is%3Aissue+label%3AFeature).

- **More native rendering engines** (Firefox, Safari, iOS, Android) will enable you to do all of you visual testing directly within Tandem. You will also be able to interact with these previews visually, and launch multiple browsers in parallel to design & debug HTML & CSS as you're coding.
Collaborative editing will enable you to share your workspace with designers, and other team members who can work with you to create pixel perfect applications.
- **More developer tools & documentations** to help make it easier for developers to create their own Tandem extensions to fit their own, or team workflow.
- **Community extensions** page that enables people to customize Tandem.
- **Test builder** would enable you to visually create Selenium tests directly within Tandem.
- **Intellisense-like suggestions for HTML & CSS** would help you pick the right HTML & CSS features for your application.
- **Animations tools** with an iMovie-like interface for intuitively creating motion in your application.
- **3D tooling**
- **Dependency graph strategies** for Webpack, SystemJS, and Rollup, would speed up preview hot swapping, and unlock live reloads as you're writing code in your text editor.
- **Visual tooling specific to frameworks** such as VueJS, ReactJS, AngularJS, MotionJS, and Javascript, and non-JavaScript libraries.

### Future

Eventually, I hope to build Tandem into a platform that enables developers to do most (or even all) of their UI development visually (as I think it should be). There isn't an ecosystem
yet to support this, but there is a possibility to have a hibridization of web frameworks that are designed to be coded visually by editors such as Tandem and that can also be written by hand. 
To support this idea, I plan to continue developing Tandem in Tandem until the entire application UI is re-built with components that are created in the application itself. 

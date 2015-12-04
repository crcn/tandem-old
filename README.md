
A visual editor for creating modular & interactive components.

<!-- ### Motivation

Translating visual designs to code is a long & hard process.
 -->

### Goals & Possible Features

- Allow non-developers to make *pixel perfect* designs.
- Reduce human work time from design to code.
- Reduce visual errors across browsers.
- Compile visual docs to any framework including React, Ember, Angular, and more.
- Compile visual docs to different rendering engines (SVG, canvas, HTML, WebGL)
- More obvious barrier between the View (visual information) & Controller
- ability to publish components to NPM from editor
- Social network for sharing visual components with other people - [dribbble](http://dribbble.com/)-esque.
  - Ability to fork & PR designs



### Code Example

For the initial version, this application is *intended* to be used with *simple* visual components throughout the application codebase. Each component should live in their own file for re-usability. Visual interface files will be requirable in javascript files like so:

```javascript
var Button = require('./button.ibf'); //

document.body.appendChild(Button.create().element);
```

the `button.ibf` file in this case would be compiled straight to vanilla JavaScript. You'll also be able to register *custom* compilers for frameworks such as React, Ember, and Angular. Registering a React ibf compiler for instance might yield the following code:

```javascript
var React = require('React');
var Button = require('./button.ibf');
React.render(<Button />, document.body);
```

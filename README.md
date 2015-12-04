
A visual editor for creating modular & interactive components.

<!--### Motivation-->

<!--

- designs that do not work
- translating designs -> code is tough


-->

### Goals & Possible Features

- Non-opinionated. Components will be interoperable with your existing codebase.
- Simple & limited interface that enables people to create visual elements that can be wired up with actual code.
- Allow non-developers to make *pixel perfect* designs.
- Reduce human work time from design to code.
- Reduce visual errors across browsers.
- Compile visual docs to any framework including React, Ember, Angular, and more.
- Compile visual docs to different rendering engines (SVG, canvas, HTML, WebGL)
- More obvious barrier between the View (visual information) & Controller
- ability to publish components to NPM from editor
- Social network for sharing visual components with other people - [dribbble](http://dribbble.com/)-esque.
  - Ability to fork & PR designs
- interoperability between rendering engines. E.g: svg + HTML depending on type of shaped being compiled.


### Pros

- Can be eased into existing application
- Reduces the amount of code you have to write
- Same level of modularity as visual code. 
- Can be organized with code
- Reduces time from design -> development
- Easily update visual docs
- Enable non-devs to create interactive UIs
- optimizations happen at compile time
- Less code = less cruft over time. 

### Cons

- Unable to programatically tweak visual code. Must be done in editor.
  - no HTML access
  - no CSS access


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

### File structure example

Here's an idea of how you could organize component files created with this visual editor.

```
components/
  common/
    styles.ibf 
    base-button-test.js
    base-button.js
    base-button.ibf
    alert-test.js
    alert.js
    alert.ibf
  auth/
    signup.js
    signup.ibf
    signup-test.ibf
```

The `*-test.js` are unit tests. The `*.js` are the controller files - they import their corresponding `*.ibf` files.


A visual editor for creating interactive components.

### Why?

Typically, UI components are created within a visual design program such as Sketch, or Photoshop. After that the application may be prototyped, then finally developed. This whole process could be simplified if there was *one* editor - something that allows you to visual edit a UI component & compile it straight to JavaScript.

### Intent

For the initial version, this application is *intended* to be used with *simple* visual elements throughout the application codebase. Each component should live in their own file (though can be included into other visual files) so that they can be used as needed in your front-end application. Visual interface files will requirable in javascript files like so:

```javascript
var Button = require('./button.ibf'); //

document.body.appendChild(Button.create().element);
```

Note that you'll be able to register custom `ibf` compilers that translates your visual documents into JavaScript that is compatible with frameworks such as React, Ember, and Angular. Registering a React ibf compiler for instance would yield the following code:

```javascript
var React = require('React');
var Button = require('./button.ibf');
React.render(<Button />, document.body);
```

> Note that Tandem was intented to be a visual editor that runs any kind of application out of the box (assuming that source maps was turned on). This big audatious hairy goal has since been scaled back to something that's a bit more feasible (with the amount of time I have) for a version 1 of the application. 

Tandem is a visual designer for creating web components. The editor comes with many of the visual tools you might find in something like Sketch such as artboards, measurement tools, along with additional tooling for responsive design, CSS tooling, and the likes. 

[DEMO]

Web components built in Tandem are written in a simple to read & write format, called Paperclip. Paperclip web components are intented to be light weight, and compileable to many target frameworks (React for starters).

## Planned Features

## Technical details

Below are some of the technical details, ideas, whys, and motivations about some of the grittier things around Tandem.

## Paperclip

Paperclip is a design language that's optimized for visual editing. Think of it like a `.xib` file format for the web, but human readable, and writable by hand. 

#### Motiviation

Paperclip is an open file format that allows for somewhat expressive behavior to be shared across multiple components. Certain behavior can be defined in Paperclip templates such as repeated elements, conditionals, and dynamic text. Here's an example:

```html

<!-- ID should come with a prefix -- something web component friendly  that wouldn't conflict with native elements -->
<component id="x-people">
  [[ property people ]]

  <!-- styles are scoped to the component, just like web components -->
  <style> 
    :host {
      border: 1px solid var(--border-color);
    }

    li:nth-child(2n) {
      background: var(--background-alt);
    }
  </style>

  <template>
    <ul>
      <li [[repeat people as person]]>

        Hello [[echo person.name]]

        <!-- basic expressions are okay -->
        <span [[if person.age > 10]]>
          You are ten years old.
        </span>

        <!-- comments are also allowed -->
        <span [[if person.age > 12]]>
          You are twelve years old.
        </span>
      </li>
    </ul>
  </template>
</component>
```

The format above is similar to other template languages such as Handlebars, and Mustache, but the syntax is carefully designed to ensure that _every part_ of Paperclip can be written visually. Though Paperclip files _can_ be written by hand, that's not what Paperclip is designed for. Paperclip's file format provides yet another UI to help developers inspect how a web component is written so that they can integrate Paperclip files into their main application. 

> Also note that Paperclip's limited expressiveness is also a means to it _light_ (Only HTML, CSS, and built-in expressions are allowed), since overly complex Paperclip files that use import statements _could_ amount to very heavy web components that would result in a very _slow_, and possibly unusable visual editing experience (especially with many artboards that share the same components).

> Paperclip's limited expressiveness is also intended for people less code-savvy. Certain types such as functions, and objects must be computed _outside_ of a Paperclip template file in a higher order component that contains complex behavior. 

> Simplicity also offers some neat benefits around performance. Since Paperclip is declarative and bindings are identified at compile time, the compiled output of Paperclip can be optimized to the _bare minimum_ amount of operations required to update a dynamic UI. This is similar to how [Glimmer](#TODO-LINK) works.

#### Targeting multiple platforms

Paperclip is designed to be compiled to _other_ frameworks. Version 1 of Paperclip will come with a React target. Future versions of Paperclip with likely have targets for other things like `Vue`, `Angular`, `PHP`, `Ruby`, among other languages and frameworks.

Code-wise, all you need to do to integrate Paperclip into your web application is to import it like a normal module. Assuming that you have a paperclip file named `people-list.pc` that looks like this this:

```html
[[
  type Person {
    name: string
  }
]]

<component id="people-list">
  [[ property people ]]
  [[ property onRemovePersonClicked ]]
  <template>
    <ul>
      <li [[repeat people as person]]>
        [[echo person.name]]
        <a href="#" [[on click onRemovePersonClicked(person) ]]>
          x
        </a>
      </li>
    </ul>
  </template>
</coponent>
```

You can integrate the above button in a corresponding `button.tsx` React component that might look something like this:

```
import { components } from "./button.pc";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

const enhancePeopleList = compose(
  withState("people", "setPeople", [{ name: "Drake" }, { name: "50c" }])),
  withHandlers({
    onRemovePersonClicked: ({ people, setPeople }) => (personToRemove) => {
      setPeople(people.filter((person) => person !== personToRemove));
    } 
  })
);

// Note that components exported are as-is to avoid confusion. 
export const PeopleList = enhancePeopleList(components["people-list"]);
```

### Paperclip syntax

Paperclip currently implements a limited set of operations, more planned in the future. The format is inspired by web components, and will continue to support features that are relatively close to web standards (so long as they do not conflict with the editing experience). 

##### `[[echo]]` block

Prints the statement following `echo`. Example:

```html
<li style=[[echo style]]>
  [[echo text]]
</li>
```

Note the `style` binding above doesn't have wrapping quotes, which provides different behavior. For example:

```html
<li class="[[echo class]]">
</li>
```

Defines an _attribute_ on the element, which can only be a `string`, whereas ommitting the quotes defines a _property_ on the target element, which can be any type. If we want to define a class to a property for example, we'll have to do this:

```html
<li className=[[echo className]]>
</li>
```

Since `className` is a property of html elements, wherease `class` is not (it's an attribute). This distinction comes in handy depending on
the element you're dealing with. 

##### `[[property]]` block

`[[property]]` blocks define properties that expected in a component. Example:

```html
<component id="x-button">
  [[property text]]
  <template>
    [[echo text]]
  </template>
</component>
```

Properties are _required_ for a number of reasons:

1. They notify the outside world about what information the component expects (eventually properties will have strong types will be _very_ useful for maintainability).
2. They flag what parts of the component are changing (this happens at compile time which makes the engine über fast for certain compile targets).

##### `[[repeat]]` block

`[[repeat]]` blocks `repeat` the element that they're attached to. Example:
```
<component>
  [[property people]]
  <template>
    <ul>
      <li [[repeat people as person]]>
        [[echo person]]
      </li>
    </ul>
  </component>
</component>
```

Note that `[[property]]` must be defined.

#### <style /> elements

Styles are scoped to the components they're defined in (this is similar to the web component spec -- and you can read more about some of the patterns around it on MDN). This means that they only cascade to the immediate elements that are defined within the component's template. For example:

```html
<component id="x-button">
  <style>
    :host {
      color: red;
    }
  </style>
  <template>
    <a href="#">click me!</a>
  </template>
</component>
```

The style above only applies to _that_ component.  If you want to import styles that are shared across multiple components, then you can "pierce" component styles by importing them directly within the style block:

```html
<component id="x-button">
  <style>
    @import "./global.css";
    :host {
      color: red;
    }
  </style>
  <template>
    <a href="#">click me!</a>
  </template>
</component>
```

Additionally, you can define global variables that _can_ be used in components like so:

```html
<style>
  :root {
    --font-color: red;
  }
</style>
<component id="x-button">
  <style>
    :host {
      color: var(--font-color);
    }
  </style>
  <template>
    <a href="#">click me!</a>
  </template>
</component>
```

### Paperclip Roadmap 💫

Some planned features for Paperclip. Everything about Paperclip is being designed now so that these ideas will be possible.

#### Strong types

Future versions of Paperclip will likely contain strong types that will integrate with the visual editor. Ideally, the visual editor would emit "compile errors" that would be displayed to the user when changes are made to a UI that breaks other parts of the application.

Paperclip types will also be compilable to other type systems such as TypeScript, and Flow.  The basic syntax for this may look like:

```html
[[ type Person {
  name: string
}]]

<component id="people-list">
  [[property person: Person[] ]]
</component>
```

In terms of _upgrading_ to typed paperclip components from non-typed, the visual editor, or CLI terminal may emit warnings about untyped properties in a paperclip file, so that designers, or enginers can add the appropriate types.

#### More compile targers

Paperclip currently compiles to Vanilla JS, and React. In the future, Paperclip will eventually target other frameworks. Vue, and Angular are on the short-list of frameworks to create tooling for next. Backend languages on the other hand will likely take more time to design since events will need to be accounted for (`onClick` events for instance would need to somehow hit an API). 

#### More features that integrate with visual editor

Paperclip will eventually have features that are specific for visual editing, but are stripped out at compile time. 

##### `[[note]]` block

`Notes` are attachable to any element in the visual editor, where each note contains comments & discussions about each element they're attached to. Threads will also be a part of notes will allow collaborators -- other people on your team -- to leave comments (similar to google docs). Notes will _only_ be addable in the designer, and their contents stored in an API backend. Here's a basic example of what a note block will look like in a paperclip file:

```html
<component id="people-list">
  <template>  
    <span>

      <!-- this note applies to the span above -->
      [[note AUTOMATICALLY_GENERATED_ID]]

    </span>
  </template>
</component>
```

> Note that information that should convey details to a developer reading this file should be left as a regular HTML comment. `Notes` are comments for visual information. 

#### `[[fixture]]` block

TODO

#### GIT conflict support

GIT conflicts will be supported in Paperclip, and will allow designers & developers to visually resolve conflicting changes, directly within the visual editor. Assuming that multiple artboards are visible, users will be able to toggle between different versions of a component and observe how their changes affect other UIs. 

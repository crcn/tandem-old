> Note that Tandem was intented to be a visual editor that runs any kind of application out of the box. This big audatious hairy goal has since been scaled back to something that's a bit more feasible (with the amount of time I have) for a version 1 of the application. 

Tandem is a visual designer for creating web components. The editor comes with many of the visual tools you might find in something like Sketch such as artboards, measurement tools, along with additional tooling for responsive design, CSS tooling, and the likes. 

![screenshot 2016-12-22 15 48 03](https://cloud.githubusercontent.com/assets/757408/22388273/ce17a5e0-e4ad-11e6-9327-7d7ba3dc95bf.png)

By default, web components built in Tandem are written in a simple to read & write format, called Paperclip. Paperclip web components are intented to be light weight, and compileable to many target frameworks (React for starters).

### Tandem Goals

- Visual editing of _most_ web components (like 90% of code) like buttons & lists.
- Visual tooling will be a 1-1 map of HTML & CSS. This means that people will need knowledge of HTML & CSS in order to use Tandem.
- To lower the barrier for web development. Designers, and non-coders should be able to design web components without too much knowledge of coding. 
- To provide tools that educates the user of web features (hints, tooltips, warnings, tools that augment). 
- To reduce the amount of tooling required to build a web application. Tandem will give users the option to build their _entire_ web application with a click of a button. 
- To integrate with languages that are 100% editable in Tandem. Paperclip will be supported for starters, but other languages such as Vue, and Angular may be supported in the future.
- To provide visual aid around web features with tooltips & suggestions on web design. 
- To reduce vendor lock-in. You shouldn't be stuck using Tandem if you don't want to use it anymore.

### Tandem Non-goals

- To support languages that are not designed for visual editing. SASS, LESS, and JSX, and other frameworks are optimized for good developer experience, but do a poor job producing code that is visually editable (things like `1 + 1`, and other computed properties are hard to change visually). 
- To suport very sophisticated web components. Tandem will be designed to support web components with _simple_ behavior. Complicated components will need to be written by hand in a language such as JSX that's more expressive (which is probably the best option anways). Developer tooling will also be provided so that engineers can inject behavior into a web component created in Tandem (either as a higher order function, or view controller). 

## Planned features

Below are some planned MVP, and future features for Tandem. 

#### (v1) Artboards

Artboards are similar to Sketch, and provide you aerial view of all of your web components. Artboard changes also affect one another, so a CSS color change for example may affect another artboard that shares the same CSS property. For example:

![ezgif-1-e0c05e0cbf](https://user-images.githubusercontent.com/757408/32658161-a855af7e-c610-11e7-9129-769a112e0031.gif)

> Artboards in Tandem are _actually_ individual browser VMs that are _almost_ to spec with web APIs, which means that they can run fairly complex applications.

#### (v1) Stage tools

The stage, as in, the artboard that you edit directly. The stage will contain tools similar to what you'd find in sketch, like moving elements around:

![ezgif-4-47f92ab768](https://user-images.githubusercontent.com/757408/32700619-6b6da732-c7bf-11e7-82de-b15f4d3101e4.gif)

Other features include:

- pixel grid (when zoomed in)
- text editing
- multi selection

#### (v1) Components pane

The components pane will display native elements (`div`, `span`, `h1`), along with custom components from your file system. Items in the components pane will be draggable to any element or component on stage (where the artboards are).

#### Text editor (VSCode) integration

Tandem will be installable as an extension of your visual editor -- currently for VSCode. 

#### (v1) CSS editor

The CSS editor provides you with a 1-1 map of the visual styles of your application. The inspector also comes with a set of other helper utilities such as a color picker, box shadow editor, filter editor, and other tools to help style components. Here's the current design of the css editor:

<img width="278" alt="screenshot 2017-11-12 15 17 05" src="https://user-images.githubusercontent.com/757408/32700419-ddb57ef8-c7bc-11e7-8603-989eff2904fe.png">

> The CSS editor is similar to Chrome's web inspector, except that the css editor actually writes to the paperclip file.

#### (v1) Webpack React loader

The webpack react loader allows you to compile paperclip files to react components, and import them in your application.

#### (v2) More text editor integrations

Atom will be support, along with Sublime, and possibly other text editors.

#### (v2) Stage tools

The next bunch of stage tools will offer more visual helpers & guides to help with pixel perfect designs. They will include:

- Measurement tools
- Snap-to-place tools (when dragging elements)


#### (v2) Build button

Eventually, Tandem will come with a build button for projects that will work out of the box, along with a command line option for bundling apps for deployment (`tandem build`, or something like that). This feature is planned to make it easier for less technical people to make UI changes, and preview their UIs in a production application. The build step will likely use `webpack` in the background, but may be configured to support other bundlers as well. 

## Technical details

Below are some of the technical details, ideas, whys, and motivations about some of the grittier things around Tandem.

## Paperclip

Paperclip is a design language that is optimized for visual editing. Think of it like a `.xib` file format for the web, but human readable, and writable by hand.

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

The format above is similar to other template languages such as Handlebars, and Mustache, but the syntax is carefully designed to ensure that _every part_ of Paperclip can be written visually. Though Paperclip files _can_ be written by hand, that's not what the format is designed for. Paperclip's file format provides yet another UI to help developers inspect how a web component is written so that they can integrate Paperclip files into their main application. 

> Also note that Paperclip's limited expressiveness is to ensure that paperclip files are _lightweight_ (Only HTML, CSS, and built-in expressions are allowed), since overly complex Paperclip files that import lots of code _could_ amount to very heavy web components that would result in a very _slow_, and possibly unusable visual editing experience (especially with many artboards that share the same components).

> Paperclip's limited expressiveness is also intended for people less code-savvy. Certain types such as functions, and objects must be computed _outside_ of a Paperclip template file in a higher order component that contains complex behavior. 

> Simplicity also offers some neat benefits around performance. Since Paperclip is declarative and bindings are identified at compile time, the compiled output of Paperclip can be optimized to the _bare minimum_ amount of operations required to update a dynamic UI. This is similar to how [Glimmer](#TODO-LINK) works.

#### Paperclip Goals

- To provide a syntax that is close to web standards. 
- Provide a syntax that can be compiled to other languages, and frameworks. 
- Provide a syntax that's designed for visual editing, but human readable.
- Type safety to ensure breaking changes to UI can be traced to other web components.
- Provide syntaxes that augment the user experience of Tandem.

#### Paperclip Non-goals

- Support complicated behavior that cannot be backtraced. 
- Support for multiple languages. It's just HTML, CSS, and Paperclip-specific syntax. 
- Support for inline scripts. This behavior must be injected into the web component. 

#### Targeting multiple platforms

Paperclip is designed to be compiled to _other_ frameworks. Version 1 of Paperclip will come with a React target. Future versions of Paperclip with likely have targets for other things like `Vue`, `Angular`, `PHP`, `Ruby`, among other languages and frameworks.

Code-wise, all you need to do to integrate Paperclip into your web application is to import it like a normal module. Assuming that you have a paperclip file named `people-list.pc` that looks like this:

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
        <a id="remove-person-button" href="#" [[emit click]]>
          x
        </a>
      </li>
    </ul>
  </template>
</component>
```

Components that use behavior take a `controller` parameter which should 

```typescript
import { hydrateComponents } from "./button.pc";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

// Note that components exported are as-is to avoid confusion. 
export const { "people-list": PeopleList } = hydrateComponents({
  "people-list": compose(
    withState("people", "setPeople", [{ name: "Drake" }, { name: "50c" }])),
    withHandlers({
      handleEvent: ({ people, setPeople }) => ({ triggerEvent, context }) => {
        if (triggerEvent.target.id === "remove-person-button" && triggerEvent.type === "click") {
          setPeople(people.filter((person) => person !== context.person));
        }
      } 
    })
  )
});
```

`hydrateComponents` takes a set of higher order functions that wrap around all of the exported web components emitted by the paperclip file. This API is to ensure that behavior may be injected into _nested_ components. 

For the sake of simplicity, and this is my own preference, I think it's a good idea have a single paperclip file that exports _all_ web components of the application, and then have a single component _enhancement_ file that binds paperclip components, and their heavy logic (controllers, or higher order components) together. Here's a psuedocode example:

```typescript
import { hydrateComponents } from "./all-components.pc";
import { compose, pure, withHandlers } from "recompose";

export const enhancedComponents = hydrateComponents({
  "people-list": compose(/* HOF code */),

  // reflect people-list-item -- not enhanced
  "people-list-item": BaseComponent => BaseComponent,
  
  "app": compose(/* HOF code */)
});
```

You can take a look at Tandem's source code to see how this kind of code organization looks. 

<!-- TODO - look into storing state to a global place -->

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

```html
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

#### [[emit click]] block

Attaches an event listener to an element. Events that are dispatched by the element also contains the context of the element.  For example:

```html
<component id="x-clicker">
  [[property count]]

  <template>
    <a id="some-button" href="#" [[emit click]]>
      current count: [[echo count]]
    </a>
  </template>
</component>
```

The `a` button in the above component emits a plain javascript object of `{ type: "EVENT", payload: { triggerEvent: sourceMouseEvent, context: { count: 0 }}}`, which should be handled by a higher order component that defines a `handleEvent` property. If a `handleEvent` is _not_ present, then event will bubble up until it reaches one. `handleEvents` that _are_ defined must call a higher order `handleEvent` function in order for bubbling to occur.  


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

In terms of _upgrading_ to from non-typed paperclip components, the visual editor will contain functionality that emits warnings (assuming that types are turned on) for templates that don't have them. Designers or engineers can simply add them manually when this feature comes out.

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

#### `[[i8n]]` block

The i18n, or internationalization block  will be used for translations. Translations will be visible directly within the visual editor. 

#### GIT conflict support

GIT conflicts will be supported in Paperclip, and will allow designers & developers to visually resolve conflicting changes, directly within the visual editor. Assuming that multiple artboards are visible, users will be able to toggle between different versions of a component and observe how their changes affect other UIs. 

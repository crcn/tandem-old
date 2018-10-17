TODO:

- CH 1. Welcome

  - Welcome

    - target audience
    - What is Tandem (visual web development)
    - Why Tandem (easier to write html & css, better QA)
    - integrating Tandem (intended to be used with existing frameworks)

  - high-level Guide (don't need to go into detail, just brief descriptions)

    - layers
    - file panel
    - style
    - properties
    - global variables

- Ch 2. Building a simple todo app (take framer design, or suck one in)

  - components
  - slots
  - instances
  - shadow dom

- Ch 3.1. Connecting react code

- Ch 3.2. Generating static site

- Ch 4.1 Migrating existing websites

## Read me first!

This doc is aimed to take you step-by-step through developing your _first_ application with Tandem. Example code and videos are also provided with each phase to help you along the way.

There are many nuances, patterns, and terminology used in the app, so I wouldn't recomend skipping through any section. Cliff notes are available for each section for anyone in a rush. I also added some personal thoughts, workflows, and philosophies into the user guide here that may seem obvious to experienced developers, or people may disagree with, but a minor intent in spelling some of the higher level ideas is to show how Tandem _aims_ to be a wholesome tool.

## What is Tandem and why should I use it?

Writing HTML & CSS is a massive time sink, and the whole process of writing _visual_ code by hand feels unnatural and cumbersome. In a large front-end project, I'll probably spend about 80% of my time writing HTML & CSS, waiting for builds, cross-browser testing, and going back to the drawing board because hardly anything I create the first time is correct. I've _never_ shipped great HTML & CSS code. There's always been UI issues whether they break in certain browsers, or don't match their design spec. Though, deadlines get in the way, and there usually aren't enough resources or mental energy to cover every visual bug. And so I think that in almost every case, products are stuck in limbo where the user experience just feels "okay".

> Personally I find the _speed_ of writing code to be one of the most important attributes of building a product, far above writing tests, or type safety. Hardly anything that I write is "correct", and if I get to write code _faster_, then I can more quickly let products evolve in the real world, and hone them down to their essense.

Tandem was developed to be a faster & more intuitive tool around creating web components. It's intended to be simple, and only provides you with visual tooling for authoring web applications _where it makes sense_. That goes for the _visual_ creation of web apps - mainly HTML & CSS. Tandem is designed to handle most HTML & CSS cases, so you'll rarely be bogged down by writing visual code by hand (there are some complex cases that Tandem can't handle, and Tandem doesn't aim to cover every case since that would add _unnecessary_ complexity to the user experience. Sometimes code is the best medium). Tandem also provides a nice buffer between your _actual_ code since there isn't much logic involved, and that means you're able to build your UIs in Tandem _first_, then wire them up with code later on. In other words:

1. You don't need to worry or even think about what language or framework you're picking before you start using Tandem.
2. You can compile Tandem UIs to multiple language and framework targets.
3. Your Tandem UIs are more resilient to underlying to code changes.

Basically, Tandem is aimed to be a _better_, _safer_, and _faster_ way around building web components that allows you to focus on the more complicated parts of your app: code & product.

> Why should you trust that Tandem works? Well, you probably shouldn't _completely_. Like any tool, Tandem isn't able to solve every visual development problem you have (Tandem for example hasn't been tested outside of web apps, and websites [game development, ]), nor will Tandem be compatible with _every_ framework, or language. I think it's prudent to look at how this app may be compatible with your product & team, and to involve safety hatches that enable you to migrate away from Tandem if it isn't a good fit. A lot of these safety hatches are baked in (decoupling UI from your code, and migration tools in the roadmap), but it'd be disengenous for me to request that you "just trust" the app when _I myself_ have a hard to believing in perfect solutions. Every technical consideration needs a plan B. I can tell you though that Tandem is _actively_ used in building products (including itself), so a lot of its features & patterns are being _discovered_ over time instead of speculated.

#### TL;DR

Tandem allows you to visually create web components, and integrates with your existing codebase. Features for building HTML & CSS are actively being discovered based on real world usage (via product development, and that Tandem is used to build itself).

## Building your first app

In this section we'll build a simple todo app.

### Prerequisites

You'll need to have basic knowledge of HTML & CSS in order to get started, and a little coding experience doesn't hurt either if you're looking to add behavior to your UIs. Don't worry about needing to know how to code _before_ using Tandem though.

Assuming that you have some HTML & CSS chops, you can go ahead and download the current _preview_ version of Tandem here: https://www.dropbox.com/s/bwvotfx13u8rsvw/latest.zip?dl=0.

We'll be using [NodeJS](https://nodejs.org/) and [yarn](TODO) in this tutorial, so be sure to have those installed too.

## Starting a project

Open Tandem & click "create a project". Tandem will prompt you to pick a directory where you want your project to live. If you have a projects folder directory, navigate over to that and create a new sub directory called `todos` (that's what we're going to work on). Select that new directory and click `Open`.

![create new project](assets/create-new-project.gif)

With the selected directory, Tandem will create a new group of files which make up the structure of a basic project. They are:

#### app.tdproject

The `*.tdproject` file contains your Tandem project configuration. You can checkout more information about it [here](./app-config.md). Though, the default settings will be enough for our todos app.

#### src/

The `src` directory contains all of your source files including your component files (`*.pc`), and JavaScript files. Anything that gets built basically.

#### src/main.pc

The `main.pc` is your main component file (`pc` stands for paperclip). You're welcome to organize components into _multiple_ `*.pc` files in your `src/` directory if you want. More on that later.

### Understanding the editor at a high level

We'll jump into explaining the UI real quick. I won't go into too much detail here since more UI explainations will come later on when we start creating. Go ahead and select the main `Application` frame you see in the canvas.

![select app](assets/select-app.gif)

Here's a basic map of the editor:

![basic explaination](assets/basic-ui-explaination.png)

#### Project files

Starting in the lower left section, the `Files` pane contains _all_ of your project files including your JavaScript, component files, images, and other assets.

#### Layers

The `Layers` pane contains all open component files `*.pc` and gives you a view of your component structure. If you're familiar with Chrome's or Firefox's HTML inspector feature, Layers is kind of like that.

The primary function of the layers pane is to allow you to give you a structured view of your application, and to allow you to re-organize your HTML via dragging & dropping. You can also rename layers to be more specific, and they _should_ be because layer names are how custom code "injects" behavior into your UIs. More on that later.

#### Tools

Tools provide you with a way to insert new `elements`, `text`, and `component instances` into your canvas. Click _any_ tool to and you should see crosshairs. Selecting anywhere on the canvas will insert a item.

You also have hotkey options for all tools:

- `R` - insert a new element
- `T` - insert new text
- `C` - insert a component instance

> Don't worry about needing to know what a "component" or "component instance" is now.

### Creating HTML & CSS

Video here: https://www.youtube.com/watch?v=d7kcIEM1yRs&feature=youtu.be

We'll start off creating the app's HTML & CSS. We won't spend too much time making the app look pretty because I want to get around to showing the basics. Later on I'll show you how to import existing design files from Sketch and Figma to automatically create some of the UI for you. For now though, we'll keep things simple. 🙂

Here's what we're going to build:

![Simple todos app](./assets/todos.png)

> Source code: [./assets/todos-app-step-1.zip](./assets/todos-app-step-1.zip)

To kick things off, click the main frame & head over to the **properties tab**, then change the preset to `Apple Macbook Air`.

![Simple todos app](./assets/change-frame-preset.gif)

Next, select the square button in the toolbar (you should see crosshairs after doing so), then click in the main application frame. This will insert a new `div` element.

![Inserting elements](./assets/selecting-element-tool.gif)

> You can also press the `R` key on your keyboard to change the canvas tool to `Element`

Next in the **styles tab**, change the settings so that the element is centered & has a restricted width. Here's some custom CSS you can copy & paste in the `Custom CSS` section at the bottom:

```
box-sizing:border-box;
display:block;
width:700px;
height:600px;
margin-left:auto;
margin-right:auto;
margin-top:100px;
```

After that, select the text tool (you can also use the `T` key) and click the center element to insert text. While the text is selected, head over to the **properties tab** and change the text value to "Todos".

![Inserting text](./assets/inserting-text.gif)

Again, change the CSS to match the todos screenshot at the beginning of this section. Here's some CSS for that:

```
display:inline-block;
text-align:center;
width:100%;
font-size:32px;
font-family:Helvetica;
margin-bottom:12px;
color:rgba(115, 115, 115, 1);
```

Insert another element into the centered container, then head over to the **properties tab** and change the type to `input`.

![Change element type](./assets/change-element-type.gif)

And those are the basics! As you're playing around, you'll _probably_ want to move elements, and you can do that by dragging layers.

![Dragging layers](./assets/dragging-layers.gif)

I'll leave the rest up to you to finish the Todos app, or you can just download the pre-built HTML & CSS for this section [here](./assets/todos-app-step-1.zip).

### Creating components & re-using styles

Video: https://www.youtube.com/watch?v=0N51wft5dWI&feature=youtu.be

At this point you should have completed the HTML & CSS for the todos app. Now we're going to make our UI a bit more dynamic.

We'll start by creating a todo item [component](../concepts.md#component). Right click _any_ todo item you see and select "Convert to Component".

![Convert to component](./assets/convert-to-component.gif)

You should see a new frame added which is the _component_. The element that was replaced in the todo list is now the [component instance](../concepts.md#component-instance). If you change the component, the component instance will change too. Go ahead and try changing the text color of the component to see how that works.

![Component /instance relationship](./assets/component-instance-relationship.gif)

Now we're going to change all of the _other_ todo items to be instances of the new todo item component. Click each individual todo element, head over to the properties tab, and change the _type_ to the todo item component name.

![Changing element types](./assets/change-element-types.gif)

Now, _double click_ each todo item label to edit them. Change them to whatever you want.

![Changing element types](./assets/change-shadow-text.gif)

> By double clicking component instances, you're entering their [shadow](../concepts.md#shadow-nodes).

The last todo item shouldn't display a bottom border, so we're going to remove the border by creating a new [style variant](../concepts.md#style-variants). Here are the steps:

1. Select the list item component.
2. Under the **styles tab**, click the `+` button next to the Styles label at the top. A prompt will appear to provide a name. Type "last" and click "ok".
3. Scroll down to the borders section & make the bottom border color transparent.
4. Select the _last_ component instance in the todo app.
5. In the variants section under the styles tab, toggle the "last" variant.

![Creating a variant](./assets/creating-a-variant.gif)

The final thing we'll do is elevate our typography to a [style mixin](../concepts.md#style-mixin) so that we have a single place where we can change our text styles.

Right click the Todos header and select "Move Text Styles to Mixin".

![Creating text mixin](./assets/create-text-mixin.gif)

Assuming the new style mixin is selected, remove the `text-align`, and `font-size` properties. After that, re-select the Todos header and add those properties back in.

![Fixing text mixin](./assets/fixing-text-mixin.gif)

Finally, select the list item _component_ and then:

1. Ensure that the default variant is selected `--`, and _not_ `last`.
2. Clear the text styles.
3. Under the `Mixins`, select the `+` button.
4. Search for the text style mixin and press `Enter`.

![Adding mixin](./assets/adding-mixin.gif)

This will link the list item label to the re-usable text style. Go ahead and try changing the style mixin text color and see what happens.

![Adding mixin](./assets/changing-mixins.gif)

That's about it! There's still some work we can do here like making a button component and linking its label to the text style mixin, but that's on you. Or you can download the code [here](./assets/todos-app-step-2.zip).

Next up we're going to start integrating code.

### Integrating with Code

At this point you're ready to add code to your

#### Setting up with Webpack & React

[VIDEO]

1. Add entry.ts
2. Add Webpack
3. Preview

#### Adding controllers

[VIDEO]

1. Add app controller
2. Add item controller

## Integrations

### Importing from Sketch or Figma

- not everything translated
- Refactor stories

### Recordng websites

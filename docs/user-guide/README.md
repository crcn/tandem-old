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

### Read me first!

This doc is aimed to take you step-by-step through developing your _first_ application with Tandem. Example code and videos are also provided with each phase to help you along the way.

There are many nuances, patterns, and terminology used in the app, so I wouldn't recomend skipping through any section. Cliff-notes (TL;DR's) are available for each section for anyone in a rush. I also provide some personal notes that aren't really that important and you can skip.

### What is Tandem and why should I use it?

The current way of building web apps involves hand writing HTML & CSS, then switching to a browser (like Chrome, or Firefox) to test your code. The process is rather cumbersome, requiring lots of time writing the code (where you have to picture the output in your head), waiting for it to build, then previewing your creation only to realize that the UI you just wrote was incorrect and would require you to make tweaks and wait another 20 seconds for your app to build before you can see it again.

> Personally I find the _speed_ of writing code to be one of the most important attribute of building a product, far above writing tests, or type safety. Hardly anything that I write is 100% correct, and if I get to write code _faster_, then I can more quickly let my creations out in the real world into the chaos that will always drives them to evolve to what they need to be.

Tandem was developed to be a faster & more intuitive tool around creating web components. It's intended to be simple, and only provides you with visual tooling for authoring web applications _where it makes sense_. That goes for the _visual_ creation of web apps -- mainly HTML & CSS. Tandem is designed to handle most HTML & CSS cases, so you'll rarely be bogged down by writing visual code by hand (there are some complex cases that Tandem can't handle, and Tandem doesn't aim to cover every case since that would add _unnecessary_ complexity to the user experience. Sometimes code is the best medium). Tandem also provides a nice buffer between your _actual_ code since there's not much logic involved, and that means you're able to build your UIs in Tandem _first_, then wire them up with code later on. This means that:

1. You don't need to worry or even think about what language or framework you're picking before you start using Tandem.
2. You can compile Tandem UIs to multiple language and framework targets.
3. Your app logic is better encapsulated from your UI code.

I can spell this out on other ways, but basically Tandem is aimed **not** to be an _easier_ way to build web components, but a _better_, and _safer_ way around building web components that allows you to focus on the more complicated parts of your app: code & product.

> Why should you trust that Tandem works? Well, you probably shouldn't _completely_. Like any tool, Tandem isn't able to solve every visual development problem you have (It shouldn't be a hammer where everything looks like a nail), nor will Tandem be compatible with _every_ framework, or language. I think it's prudent to look at how this app may be compatible with your product & team, and to involve safety hatches that enable you to migrate away from Tandem if it isn't a good fit. A lot of these safety hatches are baked in (decoupling UI from your code, and migration tools in the pipeline), but it'd be disengenous for me to ask to "just trust" the app when _I myself_ have a hard to believing in perfect solutions. I can tell you though that Tandem is _actively_ being used in building products (including itself), so a lot of its features & patterns are being _discovered_ instead of speculated.

#### TL;DR

Tandem allows you to visually create web components, and integrates with your existing codebase. Features for building HTML & CSS are actively being discovered based on real world usage (via product development, and that Tandem was used to build itself).

## Building your first app

In this section we'll build a simple app and go over the core features of Tandem.

### Downloading Tandem

You'll need to have basic knowledge of HTML & CSS to get started, and a little coding experience doesn't hurt either if you're looking to add behavior to your UIs. Don't worry about needing to know how to code _before_ using Tandem though.

Assuming now that you have some HTML & CSS chops, you can go ahead and download the current _preview_ version of Tandem here: [LINK HERE].

Next up, move Tandem over to your Applications directory, open it up, and click "start a new project"

#### TL;DR

You need to know CSS & HTML to use Tandem. Download the app here: [LINK HERE]

### Starting a project

Open Tandem & click "create a project". Tandem will prompt you to pick a directory where you want your project to live. If you have a projects folder directory, navigate over to that and create a new sub directory called `chatroom`. Select that new directory and click `Open`.

![create new project](assets/create-new-project.gif)

With the selected directory, Tandem will create a new group of files which make up the structure of a basic project.

#### app.tdproject

The `*.tdproject` file contains your Tandem project configuration. You can checkout more information about it [here](./app-config.md).

#### src/

The `src` directory contains all of your source files including your component files (`*.pc`), and JavaScript files. Anything that gets built basically.

#### src/main.pc

The `main.pc` is your main component file (`pc` stands for paperclip). You're welcome to organize components into _multiple_ `*.pc` files in your `src/` directory if you want. More on that later.

### Understanding the editor at a high level

We'll jump into explaining the UI real quick. I won't go into too much detail here since more UI explainations will come later on when we start building things. Go ahead and select the main `Application` frame you see in the canvas.

![select app](assets/select-app.gif)

Here's a basic map of the editor:

![basic explaination](assets/basic-ui-explaination.png)

#### Project files

Starting in the lower left, the `Files` pane contains _all_ of your application's project files including your JavaScript, component files, images, configurations.

#### Layers

The `Layers` pane contains all open component files `*.pc` and gives you a view of your component structure. If you're familiar with Chrome's or Firefox's HTML inspector feature, Layers is kind of like that.

#### Tools

Tools provide you with a way to insert new `elements`, `text`, and `component instances` into your canvas.

### Creating HTML & CSS

[VIDEO]

We'll start off constructing our HTML & CSS. I _generally_ like to start with vanilla code first since it's quick and I allows me to iterate more easily. We don't have to worry about making things re-usable now since Tandem contains migration tooling to help with that. We're also not going to design our app. Tandem isn't a design tool since it deals with web constraints that prohibit you from quickly iterating over designing UIs. Tandem for example doesn't allow you to drag elements around on the canvas, and you don't have nuancy tools like SVG editing (yet!). Instead, we'll be translating a Sketch design file over to HTML & CSS.

If you don't have Sketch, you can download the code in this section [here](). After that, just jump straight to [Converting HTML & CSS to re-usable components](#Converting-HTML-CSS-to-re-usable-components)

If you _do_ have Sketch, go ahead and download the Chatroom design file here: [LINK].

TODO:

- open up sketch file
- create 1-1 map of layers
- copy CSS

### Converting HTML & CSS to re-usable components

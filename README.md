[![Build Status](https://travis-ci.com/crcn/tandem.svg?token=36W5GEcyRPyiCuMVDHBJ&branch=master)](https://travis-ci.com/crcn/tandem)

Tandem is a hackable visual editor for web applications that is similar to what you'd find in apps such as [Sketch](https://www.sketchapp.com/), and [Photoshop](http://www.adobe.com/products/photoshop.html). 

![syncing](https://cloud.githubusercontent.com/assets/757408/21443430/c412ff9a-c86a-11e6-9e36-71df05a94ea0.gif)

Tandem works with most languages & frameworks including ReactJS, AngularJS, JavaScript, TypeScript, Sass, Less, HTML, CSS, and more. Just open up any `index.html` file or url in Tandem and start writing code in your text editor. Tandem will
pickup changes in realtime & provide a preview of your application that you can manipulate visually. Changes made in Tandem are automatically sent
back to your text editor in the supported languages you're writing in (assuming that you have source maps turned on).

#### Installation

Tandem is still very alpha, but you can play around with the most recent version here: 

https://www.dropbox.com/sh/k9eqwmksv0655ss/AABQyfP5xWf4nbynRm0-OxKJa?dl=0

### Development

To get started, run `npm install && npm run build`. After that, go ahead and run `npm run code dist/browser/index.html`, which will open Tandem *in* Tandem:

![screenshot 2016-12-22 15 48 03](https://cloud.githubusercontent.com/assets/757408/22388273/ce17a5e0-e4ad-11e6-9327-7d7ba3dc95bf.png)

After you've booted up Tandem in Tandem, go ahead and run `WATCH=1 npm run build`, which will re-execute the build tasks, and re-run them whenever a `src/**` file changes. From here, you
can go ahead and open up your text editor and start hacking away.

Here's a list of other commands you can run:

```
# builds the source files in out/
npm run build;  

# builds the distributable app in dist/zip/[app].zip
npm run build:dist 

# runs the desktop application
npm run code;  

# runs tests
npm test; 
```

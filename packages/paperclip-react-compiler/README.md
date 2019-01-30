**Installation**: `npm install paperclip-react-compiler`

This module compiles Tandem UIs into React components, and typed definition files for those components. For example, say you have a `components.pc` UI file that looks like this:

![Screenshot](./assets/app-screenshot.png)

you can use the components you see here ☝️ like this (assuming that a JavaScript file is generated, or you're using the [webpack loader](../paperclip-react-loader)):

```javascript
import {Application, List, ListItem} from './path/to/components.pc';

<Application />
<List />
<ListItem />
```

You'll notice that the exported components (`List`, `ListItem`, `Application`) are based on the labels in the above screenshot. _All_ labels are converted into camel case in this compiler.

#### CLI Usage

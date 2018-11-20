Compiles Paperclip files down to vanilla HTML & CSS

TODO:

- [ ] ability to define pages via config
- [ ] Possibly connect to "build" button in UI
- [ ] variable triggers for setting state

Config example:

```javascript
module.exports = {
  mainComponent: "Website",
  pages: {
    index: {
      // variable label: value
      home: "contact",
      contact: "about"
    }
  }
};
```

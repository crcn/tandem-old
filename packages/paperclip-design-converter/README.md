CLI tool for converting design files (currently only supports sketch) to Paperclip

Example:

```bash
# convert static designs to paperclip component
paperclip-design-converter path/to/design/file.sketch > path/to/tandem/component.pc

# convert just style mixins
paperclip-design-converter path/to/design/file.sketch --only-style-mixins > path/to/tandem/mixins.pc

# convert only symbols
paperclip-design-converter path/to/design/file.sketch --only-symbols > path/to/tandem/mixins.pc

# convert style mixins & symbols
paperclip-design-converter path/to/design/file.sketch --only-symbols --only-style-mixins > path/to/tandem/mixins.pc

# convert only clobal color swatches
paperclip-design-converter path/to/design/file.sketch --only-colors > path/to/tandem/globals.pc

# only convert icons
paperclip-design-converter path/to/design/file.sketch --only-exports > path/to/tandem/icons.pc
```

#### TODOS

- convert style mixins
- convert symbols to components
- convert color swatches to global variables
- Figma support
- warning for unsupported styles

#### CLI Options

- `only-colors` - convert convert only colors
- `only-style-mixins` - convert only style mixins
- `only-symbols` - convert only symbols

####

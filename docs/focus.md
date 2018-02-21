#### Philosophies

- LDE must keep abstractions to a minimum.
- LDE must be unopinionated to increase designer Flow (less designer frustration), and reduce likelyhood of designer creating a hack, or work-around.
- LDE must have traits that are translatable (from Sketch, or to some other app).
- LDE must contain safety measures to ensure that the designer doesn't produce bugs.
	- Components shouldn't compile if they're misused (will happen when UIs are updated).
	

#### LDE data model traits

_Live_ design environments write code, so they should model code, and since _much_ of programming languages is about scalability, the data model should also adopt traits to that make it resiliant bugs -- this means that designers will need to be able to organize the DSL however they want to support the application they're building. The DSL will also need to contain features that prevent the designer from introducing bugs into production such as a static type checker that would ensure that components _only_ compile when they're being used correctly. 

XML is a good representation for the DSL over JSON for readability & expressivness. There are also a number of good side effects of picking XML -- a developer for instance would have an easier time re-organizing a component file if the data looks messy. Merge conflicts would be easier to resolve if the format reads like code. Though, it _wouldn't_ be recommended to write new features by hand since the LDE may not support certain target language features. To help prevent that, the LDE may warn the user if there are traits in a component that are not representable in a visual interface.

#### Adopted Sketch traits

Rect tool, text tool, artboard tool -- visual tooling that allows designers to quickly iterate on ideas without thinking too much of the layout engine. Users can add layout constraints _after_ their visuals look good. A sample workflow might look like:

1. Select rect tool
2. Create box on stage (absolutely positioned & dimensions set by dragger) - if in blank canvas, then automatically create a new component. 
3. Insert text tool in rect
4. Right click text node & convert position to parent padding
5. Right click text node & convert to dynamic text
6. Right click button & create component
7. Resize artboard & drop more

Everyone will have their own workflow that works, but the idea around this is in the development spirit: **provide tooling that gets out of the way of what designers want to do**. The editor shouldn't do much hand-holding at all which may increase the learning curve, it allows designers to flow without constraints.

#### Adopted IDE traits

Designers will become developers, and so an LDEs tooling should adopt traits similar to an IDE's. Error highlighting may be used to show the user where a component is being misused -- a problem that will definitely come up when refactoring components. A file navigator may be used to display assets & components in a project _as_ they're represented in the file system (going on the no-abstraction philosophy). The file navigator would allow designers to organize components however they want. Another consideration would be to have a built-in text editor for source code that would enable designers & developers to use the same environment for building UIs. However, including a text editor with full IDE capabilities would almost be unrealistic -- a _better_ option would be to introduce LDE tooling into existing IDEs. 

#### Desktop

The LDE will be a desktop app for a number of reasons:

- Better interoperability with developer tooling (bundlers, exporting to code)
- Keeps component files to the FS, and makes it possible to store files in something GIT.
- Makes extensibility possible. 
- Offline mode. 


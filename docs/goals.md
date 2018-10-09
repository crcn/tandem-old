The ideas behind Tandem are continuing to evolve based on real-world usage, so the guiding principles in this doc _may_ change in the future. For now, the ideas here guide feature development.

#### Goals

- To be interoperable with all web-based languages.
- To be interoperable with existing code.
- To be a _safer_ alternative to writing code by hand, and to integrate with existing safety measures in the codebase (integrating with typed systems, automated testing).
- Provide _better_ tooling for authoring HTML, CSS, and simple behavior.
- To be interoperable with existing design software. Sketch, After Effects, and Figma for example.
- Flexibility around how code is written around Tandem UIs.
- Escape hatches to help people migrate away from Tandem if they wany to.
- Provide tooling that can easily be used in teams.
- Develop features with scalability & maintainability in mind.

#### Non-goals

- Turring completeness. Tandem's functionality will be limited to tooling where it makes sense: basic HTML, CSS, and _simple_ behavior (slots & components). All other functionality will have to be hand coded.
- Sketch-like user experience. Tandem will only provide functionality & tooling that is compatible with how the web works.
- Runtimes or any other non-native functionality. Tandem files will always be compilable down to static HTML & CSS.
- Make web development easier. Easiness _may_ be a side effect, but features are generally considered if they provide a _better_ way of doing something.
- Cover _all_ front-end user interface development cases. Tandem will target _simple_ use cases. Complex use cases will be deferred to other software and and hand written code where it makes sense.

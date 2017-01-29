The documentation here is still very much a work in progress. I'll continue to develop this stuff out as questions come in about
how to build on top of tandem.

#### Extension Disclaimer

Tandem is *very* new, so expect APIs to change over time. All core libraries follow semantic versioning (`major.minor.patch`). **Major** updates are breaking.
**Minor** updates will be used to prepare for major changes, and contain deprecation warnings. **Patch** will contain bug fixes.

If you're developing extensions for Tandem, be sure to *always* install core libraries under the *minor* field (this would look something like `"@tandem/synthetic-browser": "1.x.x"`, or `"@tandem/sandbox": "^1.0.0"` in your `package.json` file) to ensure you receive deprecation warnings in time before major changes occur. 

#### Links

- [Getting started](./getting-started.md)
- [Architecture](./architecture.md) - Understand core libraries that power tandem. 
- [Understanding how the visual editor works](./integrating-core.md) - Understand how to integrate Tandem's core into your own visual editor.
<!--- [Extending Tandem](./creating-extensions - Learn how to create Tandem extensions.
  - [Building UI tools](./creating-extensions/ui-tools.md)
  - [Integrating with other editors](./creating-extensions/integrating-with-editors.md)
  - [Creating a custom renderer](link-to-dom-renderer-canvas-renderer)-->
- Core library documentation
  - [Synthetic Browser](../../src/@tandem/synthetic-browser) - Fake browser used to run application code
  - [Mesh](../../src/@tandem/mesh) - Used to handle messaging throughout application
  - [Sandbox](../../src/@tandem/sandbox) - Runs application code in an environment
- Videos - TODO



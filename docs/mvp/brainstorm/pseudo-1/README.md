Perhaps the best abstraction suited for Paperclip is for the template language to only
be concerned about the view layer. This basically means away any information about the template
that is specific to whatever logic controller is associated with it. For example:

```html
<li id="list-item">
  {#if editing}
  <input id="label-input" />
  {/else}
  <div id="label">{label}</div>
  {/}
</li>
```

☝🏻This is how the previous version of Tandem worked. On the code side, we could do something like this:

```typescript
import ListItem from "./list-item.pc";

export const (props: Props) => {
  const [state, setState] = useState({
    editing: false
  });
  const {editing} = state;

  const onLabelClick = (event: MouseEvent) => {
    setState({ ...state, editing: true });
  };

  const onLabelInputClick = event

  return <ListItem editing={editing} label={label} labelProps={{
    onClick: onLabelClick
  }} labelInputProps={{
    onClick: onLabelInputClick
  }}>;
};
```

☝🏻The API here is slightly clunky, but at least provides a consistent way of adding information to elements. I wonder how this works though with _nested_ components. Take a parent component for example:

```html
<import id="list-item" src="./list-item.pc">
  <ul>
    {#each items as item}
    <list-item item="{item}" />
    {/}
  </ul></import
>
```

More likely we'll want to include a listeners for things like `onRemove`, and `onChange`. So for that we'll need to require nested components to contain IDs _if_ they have logic since there's no way for Paperclip to know what additional properties the logic part of the template needs. This could be accomplished by using a simple linter that has the condition: `if nested component, and nested component has logic, then require id`. That might look something like

```html
<import id="list-item" src="./list-item.pc">
  <ul>
    {#each items as item}
    <list-item item="{item}" />
    <!--
     ^^^^^^^^^^^^^^^^^^^^^^
     This element needs an ID since it contains a logic controller.
     
    -->
    {/}
  </ul></import
>
```

So, attaching an ID to our list-item might look something like:

```html
<import id="list-item" src="./list-item.pc">
  <ul>
    {#each items as item}
    <list-item id="item-list-item" item="{item}" />
    {/}
  </ul></import
>
```

This aproach seems a bit strange since `list-item` is already named. And actually `id="list-item"` already exists on the import statement, so we could simply use that id for all instances of `list-item`. For example:

```html
<import id="list-item" src="./list-item.pc">
  <logic src="./list.tsx">
    <ul>
      {#each items as item}
      <list-item item="{item}" />
      {/}
    </ul></logic
  ></import
>
```

And for our logic file:

```typescript
import {React} from "react";
import {BaseProps} from "./list.pc";
import {Item} from "./models";

type State = {
  items: Item[]
};

// No exposed props since List has everything it needs
export type Props = {};

export const (BaseList: React.Factory<BaseProps>) => (props: Props) => {
  const [state, setState] = useState({
    items: [
      { id: 1, label: "Clean dishes" },
      { id: 2, label: "Eat" },
    ]
  });

  const onChange = (newItem) => setState({
    ...state,
    items: state.items.map(item => item.id === newItem.id ? newItem : item)
  });

  return <BaseList items={items} listItemProps={{
    onChange
  }}>
};
```

This seems like a decent pattern. If people need specificity, then they can describe their components a bit more:

```html
<import id="button" src="./button.pc" />
<button id="sign-up-button">Sign Up</button>
<button id="log-in-button">Log In</button>
```

People could even use import the same component for the same effect:

````html
```html
<import id="button" src="./button.pc" />
<import id="sign-up-button" src="./button.pc" />
<sign-up-button>Sign Up</sign-up-button>
<sign-up-button>Sign Up</sign-up-button>

<!-- all log-in-button instances receive the same props -->
<log-in-button>Log In</log-in-button>
<log-in-button>Log In</log-in-button>
<log-in-button>Log In</log-in-button>
<log-in-button>Log In</log-in-button>
````

Jumping back a bit though, the logic code above has a problem: what happens if a parent `*.pc` component of list uses it? In the template, `items` is a required props, but not in logic part of it. For example:

```html
<import id="list" src="./list.pc" /> <list items={[{ label: "Clean dishes" }, {
label: "Wash car" }]}>
```

☝🏻If we compile this as-is, there would be a no-op. Maybe that's okay though since template props are specific to UI only. I could imagine a scenario however where variants of components are used:

```html
<import id="button" src="./button.pc" />
<button dark />
<button light />
```

So I think it will be difficult to say: "treat all view props as no-op". We'll want some escape hatch to ensure that template props pass through. Here's one possible option:

```typescript
export default (BaseButton: React.Factory<BaseProps>) => (props: Props) => {
  return <BaseButton {...props} />;
};
```

I find this pattern to be terribly opaque. Is there any way to pass the props behind the scenes? That could possibly be done with hooks:

```typescript
export const useLogic = (props: Props) => {
  // return props here
};
```

Then in the compiled code:

```typescript
import {useLogic, Props} from "./button.jsx";

type TemplateProps = {
  dark: boolean,
  light: boolean
};

export default (props: Props & ViewProps) => {
  const internalProps = useLogic(props);
  const {dark, light} = props;

  // for attribute variants
  return <div {{dark, light}}>
    {internalProps}
  </div>
}
```

But what about render props, or overriding children? You can't shove react children in returned hook props. Another option might be to
lean on tye safety. For example:

```typescript
import {Props as ViewProps} from "./button.jsx";

export type Props = {} & ViewProps;

export const (View: React.Factory<Props>) => (props: Props) => {
  return <View {...props} />;
};
```

Another issue is that the shape of data consumed by the paperclip template may not reflect the data model. For example:

list.pc:

```html
{#each people as person}
<address–book-entry {person} />
{/}
```

address-book-entry.pc:

```html
{fullName}
```

The `people` collection consumed in paperclip _alone_ is `{ fullName: string }[]`, but the _model_ may look something like `{ firstName: string, lastName: string}[]`, where `fullName` is a computed prop by `address-book-entry` (probably). One solution might be to add compiler-specific flags into the template language the behave differently than the preview. Using our example above, we could introduce a special `assign to current context` flag for properties. Ruby uses a special `*` for spreading / splatting, so that could be used in our list.pc:

```html
{#each people as person}
<address–book-entry {*person} />

<!-- or -->
<address–book-entry *person="{person}" />
{/}
```

`*person` would spread props in Paperclip, so all of the props in `person` would then become props of the current context. This pattern should enable visibility into all view states of the app. And React code would maintain `props.person`. Though, it seems a bit confusing to have this kind of behavior change. Still, there needs to be _some_ way to explicitly define the view state. What if we just pull a view-specific prop off each model?

```html
{#each people as person}
<addres-book-entry {...person.view1Props} />
{/}
```

☝🏻this seems like a better options since it uses existing ideas. The `...` spread operator is a bit more clear. There's also some wiggle room to add _additional_ view properties to `person` for other cases where `person` is used. But what if we don't want this code to be compiled? We could introduce a special `omit` operator:

```html
{#each people as person}

<!-- ! for not -->
<addres-book-entry !{...person.view1Props} />

<!-- - for subtract -->
<addres-book-entry -{...person.view1Props} />
{/}
```

> If we want, we could also just do `<addres-book-entry !{...person} />`.

`!` seems a bit more clear here. We could also re-use this operator for other code we'd like to omit from compilation (like `!{<div />}`). This operator is also nice since it's used for macros in ther languages. Now for the React code, we could do something like this:

```javascript
export default (List) => (props) => {
  return <List addressBookEntryProps={(filledProps, data) => {
    returm <AddressBookEntry {...filledProps} person={data.person} />
  }}>
};
```

☝🏻The `data` parameter here could be the javascript context of the template, so we'd see `person`, in there. Suppose there's a nested #each block:

```html
{#each ayes as a} {#each bees as b}
<addres-book-entry />
{/} {/}
```

The React code might look something like:

```javascript
export default (List) => (props) => {
  return <List addressBookEntryProps={(filledProps, {a, b}) => ({...filledProps, a, b})}>
};
```

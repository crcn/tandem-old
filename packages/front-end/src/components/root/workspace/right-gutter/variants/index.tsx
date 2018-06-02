// import "./index.scss";
// import * as React from "react";
// import * as cx from "classnames";
// import { compose, pure, withHandlers, withState } from "recompose";
// import { Dispatch } from "redux";
// import { RootState } from "../../../../../state";
// import { PaneComponent } from "../../../../pane";
// import { FocusComponent } from "../../../../focus";
// import {
//   getSyntheticVisibleNodeById,
//   getSyntheticSourceNode,
//   PCSourceTagNames,
//   getComponentVariants,
// } from "paperclip";
// import {
//   newVariantNameEntered,
//   componentVariantNameDefaultToggleClick,
//   componentVariantRemoved,
//   componentComponentVariantNameChanged,
//   componentComponentVariantNameClicked
// } from "../../../../..";
// const {
//   Variants: BaseVariants,
//   VariantItem: BaseVariantsItem
// } = require("./index.pc");

// type VariantItemOuterProps = {
//   name: string;
//   useAsDefault: boolean;
//   selected: boolean;
//   onClick: () => any;
//   onChange: (name: string, value: boolean) => any;
//   onNameChange: (name: string, newName: string) => any;
//   onRemove: (name: string) => any;
// };

// type VariantItemInnerProps = {
//   editingName: boolean;
//   onCheckboxClick: any;
//   onRemoveClick: any;
//   onLabelDoubleClick: any;
//   onNameInputKeyDown: any;
//   onNameInputBlur: any;
// } & VariantItemOuterProps;

// const VariantItem = compose<VariantItemInnerProps, VariantItemOuterProps>(
//   pure,
//   withState("editingName", "setEditingName", false),
//   withHandlers({
//     onCheckboxClick: ({ onChange, name, useAsDefault }) => event => {
//       onChange(name, !useAsDefault);
//       event.stopPropagation();
//     },
//     onRemoveClick: ({ onRemove, name }) => event => {
//       onRemove(name);
//       event.stopPropagation();
//     },
//     onLabelDoubleClick: ({ setEditingName }) => () => {
//       setEditingName(true);
//     },
//     onNameInputKeyDown: ({ name, setEditingName, onNameChange }) => (
//       event: React.KeyboardEvent<any>
//     ) => {
//       if (event.key === "Enter") {
//         onNameChange(name, String((event.target as any).value).trim());
//         setEditingName(false);
//       }
//     },
//     onNameInputBlur: ({ setEditingName }) => () => {
//       setEditingName(false);
//     },
//     onClick: ({ onClick, name }) => event => {
//       onClick(name);
//     }
//   })
// )(
//   ({
//     name,
//     selected,
//     useAsDefault,
//     onCheckboxClick,
//     onClick,
//     editingName,
//     onRemoveClick,
//     onLabelDoubleClick,
//     onNameInputBlur,
//     onNameInputKeyDown
//   }) => {
//     const label = editingName ? (
//       <FocusComponent>
//         <input
//           type="text"
//           defaultValue={name}
//           onKeyDown={onNameInputKeyDown}
//           onBlur={onNameInputBlur}
//         />
//       </FocusComponent>
//     ) : (
//       <span className="state-name" onDoubleClick={onLabelDoubleClick}>
//         {name}
//         <span className="options">
//           <span onClick={onRemoveClick}>&times;</span>
//         </span>
//       </span>
//     );
//     return (
//       <BaseVariantsItem
//         onClick={onClick}
//         className={cx("state-item", { selected })}
//         checkboxContainerChildren={
//           <input
//             type="checkbox"
//             onClick={onCheckboxClick}
//             checked={useAsDefault}
//           />
//         }
//         labelContainerChildren={label}
//       />
//     );
//   }
// );

// type VariantsPaneOuterProps = {
//   root: RootState;
//   dispatch: Dispatch<any>;
// };

// type VariantPaneInnerProps = {
//   inputNewVariantMode: boolean;
//   onVariantToggle: (name: string, value: boolean) => any;
//   onAddVariantClick: any;
//   onVariantNameChange: any;
//   onNewVariantNameKeyDown: any;
//   onNewVariantNameBlur: any;
//   onRemoveVariantClick: any;
//   onVariantNameClick: any;
// } & VariantsPaneOuterProps;

// export const VariantsComponent = compose<
//   VariantPaneInnerProps,
//   VariantsPaneOuterProps
// >(
//   pure,
//   withState("inputNewStateMode", "setInputNewStateMode", false),
//   withHandlers({
//     onVariantToggle: ({ dispatch }) => (name: string, value: boolean) => {
//       dispatch(componentVariantNameDefaultToggleClick(name, value));
//     },
//     onAddVariantClick: ({ dispatch, setInputNewVariantMode }) => (
//       event: React.MouseEvent<any>
//     ) => {
//       setInputNewVariantMode(true);
//     },
//     onNewVariantNameKeyDown: ({ dispatch, setInputNewVariantMode }) => (
//       event: React.KeyboardEvent<any>
//     ) => {
//       if (event.key === "Enter") {
//         const newVariantName = String((event.target as any).value || "").trim();
//         if (newVariantName) {
//           dispatch(newVariantNameEntered(newVariantName));
//         }
//         setInputNewVariantMode(false);
//       }
//     },
//     onNewVariantNameBlur: ({ setInputNewVariantMode }) => () => {
//       setInputNewVariantMode(false);
//     },
//     onRemoveVariantClick: ({ dispatch }) => (name: string) => {
//       dispatch(componentVariantRemoved(name));
//     },
//     onVariantNameChange: ({ dispatch }) => (
//       oldName: string,
//       newName: string
//     ) => {
//       dispatch(componentComponentVariantNameChanged(oldName, newName));
//     },
//     onVariantNameClick: ({ dispatch }) => (name: string) => {
//       dispatch(componentComponentVariantNameClicked(name));
//     }
//   })
// )(
//   ({
//     root,
//     onVariantToggle,
//     onAddVariantClick,
//     onVariantNameClick,
//     inputNewVariantMode,
//     onNewVariantNameKeyDown,
//     onNewVariantNameBlur,
//     onRemoveVariantClick,
//     onVariantNameChange
//   }) => {
//     const selectedNodeId = root.selectedNodeIds[0];

//     if (!selectedNodeId) {
//       return null;
//     }

//     const document = getSyntheticVisibleNodeDocument(selectedNodeId, root.browser);
//     const documentSourceNode = getSyntheticSourceNode(
//       document.root.id,
//       root.browser
//     ) as PCComponentNode;

//     if (documentSourceNode.name !== PCSourceTagNames.COMPONENT) {
//       return null;
//     }

//     const info = documentSourceNode;

//     const itemsContainerChildren = getComponentVariants(info).map(
//       ({
//         attributes: {
//           [PCSourceNamespaces.CORE]: { name, isDefault }
//         }
//       }) => {
//         return (
//           <VariantItem
//             selected={name === root.selectedComponentVariantName}
//             onClick={onVariantNameClick}
//             key={name}
//             name={name}
//             useAsDefault={isDefault}
//             onChange={onVariantToggle}
//             onRemove={onRemoveVariantClick}
//             onNameChange={onVariantNameChange}
//           />
//         );
//       }
//     );

//     if (inputNewVariantMode) {
//       itemsContainerChildren.push(
//         <BaseVariantsItem
//           checkboxContainerChildren={<span />}
//           labelContainerChildren={
//             <FocusComponent>
//               <input
//                 type="text"
//                 onKeyDown={onNewVariantNameKeyDown}
//                 onBlur={onNewVariantNameBlur}
//               />
//             </FocusComponent>
//           }
//         />
//       );
//     }

//     const header = (
//       <span>
//         Variants
//         <div className="controls">
//           <span className="add-state-button" onClick={onAddVariantClick}>
//             +
//           </span>
//         </div>
//       </span>
//     );

//     return (
//       <PaneComponent className="m-states-pane" header={header}>
//         <BaseVariants itemsContainerChildren={itemsContainerChildren} />
//       </PaneComponent>
//     );
//   }
// );

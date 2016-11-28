import * as React from "react";
import { FocusComponent, TextEditorComponent } from "@tandem/editor/browser/components/common";
import { ITokenizer, inject, InjectorProvider, Injector, BaseApplicationComponent } from "@tandem/common";

export interface IKeyValueItem {
  name: string;
  readonly?: boolean;
  value: any;
  overridden?: boolean;
}


export interface IKeyValueInputComponentProps {
  item: IKeyValueItem;
  children?: any;
  setKeyValue: (name: string, value: any, oldName?: string) => any;
  onValueEnter: (item) =>  any;
  className?: string;
  renderName?: (props: IKeyValueNameComponentProps) => any;
  valueTokenizer?: ITokenizer;
  style?: any;
}


export interface IKeyValueNameComponentProps extends IKeyValueInputComponentProps {
  children: any;
}
// TODO - add some color for the CSS rules
export class KeyValueInputComponent extends BaseApplicationComponent<IKeyValueInputComponentProps, { editName: boolean, currentName: string, currentValue: string }> {

  state = {
    editName: false,
    currentValue: undefined,
    currentName: undefined
  };

  editName = () => {
    this.setState({ editName: true, currentName: undefined, currentValue: undefined })
  }

  onNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/13/.test(String(event.keyCode))) return;
    this.saveName(event);
  }

  get item() {
    return this.props.item;
  }

  saveName = (event: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    
    const newName = event.currentTarget.value;
    if (!this.item.name) {

      // delete the row
      if (!newName) {
        this.props.setKeyValue(undefined, undefined);
      }
      
      return this.state.currentName = newName;
    }

    this.state.currentName = undefined;
    const oldName = this.item.name;

    // unset
    if (newName === "") {
      return this.props.setKeyValue(undefined, undefined, oldName);
    }

    if (oldName !== newName) {
      this.props.setKeyValue(newName, this.item.value, oldName);
    }
  }

  onNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.saveName(event);
    this.setState({ editName: false, currentName: this.state.currentName, currentValue: undefined });
  };


  onValueChange = (event: React.KeyboardEvent<any>) => {
    this.props.setKeyValue(this.currentItemName, this.state.currentValue = event.currentTarget.value);
  }

  get currentItemName() {
    return this.item.name || this.state.currentName;
  }

  onValueFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ currentValue: this.item && this.item.value, currentName: this.state.currentName, editName: this.state.editName });
  }

  onValueBlur = (event: React.FocusEvent<any>) => {

    // unset
    if (this.state.currentValue === "") {
      this.props.setKeyValue(this.currentItemName, undefined);
    }

    this.setState({ currentValue: undefined, currentName: undefined, editName: this.state.editName });
  }

  onValueKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) this.props.onValueEnter(this.props.item);
  }

  render() {
    let { name, value, readonly, overridden } = this.item;
    let { className, style, valueTokenizer, renderName } = this.props;
    if (!name) name = this.state.currentName;

    if (!renderName) renderName = (props) => props.children;
    return <div style={style} className={["row font-regular", className].join(" ")}>
      <div className="col-5 no-wrap dim" title={name} onDoubleClick={!readonly && this.editName}>
        {renderName(Object.assign({}, this.props, {
          children: (!name && !this.state.currentName)  || this.state.editName ? <FocusComponent select={true}><input type="text" onBlur={this.onNameBlur} defaultValue={name} onKeyDown={this.onNameKeyDown} /></FocusComponent> : name
        }))}
      </div>
      
      <input
        className="col-7"
        type="text"
        {...(this.state.currentValue != undefined ? {} : { value: value })}
        style={{textDecoration: overridden ? "line-through" : undefined }}
        onKeyDown={this.onValueKeyDown}
        onChange={this.onValueChange}
        onFocus={this.onValueFocus}
        onBlur={this.onValueBlur}
        />
    </div>
  }
}

export interface IKeyInputComponentProps {
  items: IKeyValueItem[];
  valueTokenizer?: ITokenizer;
  renderName?: (props: IKeyValueNameComponentProps) => any;
  setKeyValue: (key: string, value: string, oldKey?: string) => any;
  renderItemComponent?: (props: IKeyValueInputComponentProps) => any;
}

// TODO - add some color for the CSS rules
export class HashInputComponent extends React.Component<IKeyInputComponentProps, { showNewInput: boolean }> {
  
  state = {
    showNewInput: false
  };

  onValueEnter = (item) => {

    // TODO - possibly insert new prop here - this.setKeyValue("", "", index)
    if (this.props.items.indexOf(item) === this.props.items.length - 1) {
      this.setState({ showNewInput: true });
    }
  }

  render() {
    let { items, renderItemComponent, renderName, setKeyValue, valueTokenizer } = this.props;

    const renderInput = (item: IKeyValueItem, index, setKeyValue) => {

      const props = {
        item: item,
        renderName: renderName,
        valueTokenizer: valueTokenizer,
        setKeyValue: setKeyValue,
        onValueEnter: this.onValueEnter
      };

      return <span key={index}>
        { renderItemComponent ? renderItemComponent(props) : <KeyValueInputComponent {...props} /> }
      </span>;
    }

    const children = [];

    children.push(...items.map((item, index) => renderInput(item, index, setKeyValue)));
    if (this.state.showNewInput) {
      children.push(renderInput({ name: undefined, value: undefined }, items.length, (name: string, value: any, oldName?: any) => {
        
        if (name == null) return this.setState({ showNewInput: false });
        // do not want to set state here since this particular input will get updated
        // with the new entry
        this.state.showNewInput = false;
        setKeyValue(name, value, oldName);
      }));
    }



    return <div className="table">
      {
        children
      }

    </div>
  }
}
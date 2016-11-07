import * as React from "react";
import { FocusComponent } from "@tandem/editor/browser/components/common";

export interface IKeyValueItem {
  name: string;
  readonly?: boolean;
  value: any;
}

// TODO - add some color for the CSS rules
export class KeyValueInputComponent extends React.Component<{ item: IKeyValueItem, setKeyValue: (name: string, value: any, oldName?: string) => any, onValueEnter: (item) =>  any}, { editName: boolean, currentValue: string }> {

  private _currentValue: any;

  constructor() {
    super();
    this.state = {
      editName: false,
      currentValue: undefined
    };
  }

  editName = () => {
    this.setState({ editName: true, currentValue: undefined })
  }

  onNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/13/.test(String(event.keyCode))) return;
    this.saveName(event);
  }

  get item() {
    return this.props.item;
  }

  saveName = (event: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    const oldName = this.item.name;
    const newName = event.currentTarget.value;

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
    this.setState({ editName: false, currentValue: undefined });
  };

  onValueChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const oldName = this.item.name;
    this.props.setKeyValue(this.item.name, this.state.currentValue = event.currentTarget.value);
  }

  onValueFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ currentValue: "", editName: this.state.editName });
    event.currentTarget.select();
  }

  onValueBlur = () => {
    this.setState({ currentValue: undefined, editName: this.state.editName });
  }

  onValueKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) this.props.onValueEnter(this.props.item);
  }

  render() {
    const { name, value, readonly } = this.item;
    return <div className="row">
      <div className="col-xs-5 no-wrap td-cell-key" title={name} onDoubleClick={!readonly && this.editName}>
        { !name || this.state.editName ? <FocusComponent select={true}><input type="text" onBlur={this.onNameBlur} defaultValue={name} onKeyDown={this.onNameKeyDown} /></FocusComponent> : name }
      </div>
      <div className="col-xs-7">
        <input type="text" {...(this.state.currentValue != null ? {} : { value: value })}  disabled={readonly} onKeyDown={this.onValueKeyDown} onChange={this.onValueChange} onFocus={this.onValueFocus} onBlur={this.onValueBlur}></input>
      </div>
    </div>
  }
}

export interface IKeyInputComponentProps {
  items: IKeyValueItem[];
  setKeyValue: (key: string, value: string, oldKey?: string) => any;
}

// TODO - add some color for the CSS rules
export class HashInputComponent extends React.Component<IKeyInputComponentProps, any> {

  onValueEnter = (item) => {

    // TODO - possibly insert new prop here - this.setKeyValue("", "", index)
    if (this.props.items.indexOf(item) === this.props.items.length - 1) {
      this.props.setKeyValue("", "");
    }
  }

  render() {
    const { items } = this.props;
    return <div className="container td-cells">
      {
        // index important here since the name can change
        items.map((item, index) => {
          return <KeyValueInputComponent item={item} key={index} setKeyValue={this.props.setKeyValue} onValueEnter={this.onValueEnter} />;
        })
      }
    </div>
  }
}
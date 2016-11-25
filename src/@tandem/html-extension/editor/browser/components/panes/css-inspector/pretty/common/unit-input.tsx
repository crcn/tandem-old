import * as React from "react";
import { BaseCSSInputComponent } from "./base";
import { NumberSliderInput } from "@tandem/editor/browser/components/common";

export class CSSUnitInputComponent extends BaseCSSInputComponent {
  renderInput(value: any, onChange: (newValue) => any) {
    return <span>
      <input type="text" value={value} onChange={(event) => this.onChange(event.currentTarget.value) } />
    </span>
  }
}
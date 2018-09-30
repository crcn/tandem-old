import { PCVariable } from "paperclip";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";

export const mapVariablesToCSSVarDropdownOptions = (
  variables: PCVariable[]
): DropdownMenuOption[] =>
  variables.map(variable => ({
    value: `--${variable.id}`,
    label: variable.label,
    special: true
  }));

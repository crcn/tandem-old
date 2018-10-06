import { PCVariable } from "paperclip";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";
import { ColorSwatchGroup } from "../../../../../../inputs/color/color-swatch-controller";
import { memoize } from "tandem-common";

export const mapVariablesToCSSVarDropdownOptions = (
  variables: PCVariable[]
): DropdownMenuOption[] =>
  variables.map(variable => ({
    value: `--${variable.id}`,
    label: variable.label,
    special: true
  }));

export const getPrettyPaneColorSwatchOptionGroups = memoize(
  (
    documentColors: string[],
    globalVariables: PCVariable[]
  ): ColorSwatchGroup[] => {
    return [
      {
        label: "Global Variables",
        options: globalVariables.map(variable => ({
          color: variable.value,
          value: `--${variable.id}`
        }))
      },
      {
        label: "Document Colors",
        options: documentColors.map(color => ({
          color,
          value: color
        }))
      }
    ];
  }
);

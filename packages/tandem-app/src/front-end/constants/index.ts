import { AvalaibleComponent } from "../state";

export const NATIVE_COMPONENTS: AvalaibleComponent[] = [
  "div",
  "span",
].map((tagName) => ({
  $id: tagName,
  label: tagName,
  category: "native"
}));
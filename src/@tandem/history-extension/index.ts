import { HistorySliderComponent } from "./components/footer/slider";
import { FooterComponentFactoryDependency } from "@tandem/editor/dependencies";

export const historyExtensionDependencies = [
  new FooterComponentFactoryDependency("history", HistorySliderComponent)
]
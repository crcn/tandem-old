import { BaseCommand, injectProvider } from "@tandem/common";
import { GetProjectStartOptionsRequest } from "tandem-studio/common";
import { ProjectStarterFactoryProvider } from "tandem-studio/worker/providers";

export class GetProjectStarterOptionsCommand extends BaseCommand {
  @injectProvider(ProjectStarterFactoryProvider.getId("**"))
  private _providers: ProjectStarterFactoryProvider[];

  execute() {
    return this._providers.map(provider => provider.option); 
  }
}
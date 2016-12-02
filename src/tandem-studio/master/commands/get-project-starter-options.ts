import { BaseCommand, injectProvider } from "@tandem/common";
import { ProjectStarterFactoryProvider } from "tandem-studio/master/providers";
import { GetProjectStartOptionsRequest, IStarterOption } from "tandem-studio/common";

export class GetProjectStarterOptionsCommand extends BaseCommand {
  @injectProvider(ProjectStarterFactoryProvider.getId("**"))
  private _providers: ProjectStarterFactoryProvider[];

  execute() {
    return this._providers.map(provider => provider.option); 
  }
}
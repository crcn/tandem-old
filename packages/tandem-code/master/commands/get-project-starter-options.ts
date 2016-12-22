import { BaseCommand, injectProvider } from "@tandem/common";
import { ProjectStarterFactoryProvider } from "tandem-code/master/providers";
import { GetProjectStartOptionsRequest, IStarterOption } from "tandem-code/common";

export class GetProjectStarterOptionsCommand extends BaseCommand {
  @injectProvider(ProjectStarterFactoryProvider.getId("**"))
  private _providers: ProjectStarterFactoryProvider[];

  execute() {
    return this._providers.map(provider => provider.option); 
  }
}
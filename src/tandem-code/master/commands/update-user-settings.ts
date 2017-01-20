import { BaseStudioMasterCommand } from "./base";
import { UpdateUserSettingsRequest } from "tandem-code/common";

export class UpdateUserSettingsCommand extends BaseStudioMasterCommand {
  async execute({ data }: UpdateUserSettingsRequest) {

    // TODO - needs to be other way around -- model should not be controlling save, this command should.
    await this.masterStore.userSettings.deserialize(data).save();
  }
}

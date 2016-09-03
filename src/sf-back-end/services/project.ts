import { IApplication } from "sf-common/application";
import { BaseApplicationService } from "sf-common/services";
import { inject, loggable, document, filterAction } from "sf-common/decorators";
import { ApplicationServiceDependency, Dependencies, DEPENDENCIES_NS } from "sf-common/dependencies";
import { } from "sf-common/actions";

@loggable()
export default class ProjectService extends BaseApplicationService<IApplication> {

};

export const projectServiceDependency = new ApplicationServiceDependency("projectService", ProjectService);
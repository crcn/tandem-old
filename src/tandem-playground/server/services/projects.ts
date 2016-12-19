import express = require("express");
import { DSFindRequest } from "@tandem/mesh";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { HTTPServerProvider } from "tandem-playground/server/providers";
import { IPlaygroundServerConfig } from "tandem-playground/server/config";
import { Project, PROJECT_COLLECTION_NAME, IProjectData } from "tandem-playground/common";
import { inject, CoreApplicationService, InitializeApplicationRequest } from "@tandem/common";

export class ProjectsService extends CoreApplicationService<IPlaygroundServerConfig> {
  @inject(HTTPServerProvider.ID)
  private _server: express.Express;

  [InitializeApplicationRequest.INITIALIZE]() {
    this._server.get("/projects/:_id.tandem", async (req, res, next) => {
      const data = await DSFindRequest.findOne(PROJECT_COLLECTION_NAME, { _id: req.param("_id") }, this.bus) as IProjectData;
      if (!data) return next();
      res.contentType(TDPROJECT_MIME_TYPE);
      res.send(data.content);
    });
  }
}
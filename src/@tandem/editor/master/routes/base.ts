import express = require("express");
import { 
  inject,
  Kernel, 
  KernelProvider, 
  IBrokerBus, 
  PrivateBusProvider,
  ApplicationConfigurationProvider
} from "@tandem/common";

import { IEditorMasterConfig } from "../config";

export interface IHTTPRouteHandler {
  handle(req: express.Request, res: express.Response, next?: () => any);
}

export abstract class BaseHTTPRouteHandler implements IHTTPRouteHandler {

  @inject(KernelProvider.ID)
  protected readonly kernel; 

  @inject(PrivateBusProvider.ID)
  protected readonly bus: IBrokerBus;

  @inject(ApplicationConfigurationProvider.ID)
  protected readonly config: IEditorMasterConfig;

  abstract handle(req: express.Request, res: express.Response, next?: () => any);
}
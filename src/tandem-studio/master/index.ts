import { argv } from "yargs";
import * as electron from "electron";
import * as getPort from "get-port";
import { EditorFamilyType } from "@tandem/editor/common";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { TD_FILE_EXTENSIONS } from "@tandem/tdproject-extension/constants";
import { createCoreStudioWorkerProviders } from "../worker";
import { createCommonEditorProviders, IEditorCommonConfig } from "@tandem/editor/common";
import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";

import { IStudioEditorServerConfig } from "./config";
import { 
  SpawnWorkerCommand, 
  StartProjectCommand,
  SelectDirectoryCommand,
  OpenNewWorkspaceCommand,
  CLIOpenWorkspaceCommand,
  GetProjectStarterOptionsCommand,
} from "./commands";

import { HTMLProjectStarter } from "./project/starters";
import { ProjectStarterFactoryProvider } from "./providers";

import { BrowserService } from "./services";

import { 
  StartNewProjectRequest,
  SelectDirectoryRequest,
  OpenNewWorkspaceRequest,
  GetProjectStartOptionsRequest,
} from "tandem-studio/common";

import {
   Injector,
   LogLevel,
   serialize,
   IBrokerBus,
   deserialize,
   CommandFactoryProvider,
   LoadApplicationRequest,
   ApplicationReadyMessage,
   InitializeApplicationRequest,
} from "@tandem/common";

process.env.LOG_LEVEL = process.env.LOG_LEVEL || LogLevel[String(argv.logLevel).toUpperCase()] || LogLevel.DEFAULT;

const BROWSER_BASE_PATH  = `${__dirname}/../browser`;

export const initializeMaster = async () => {

  const config: IStudioEditorServerConfig = {
    projectFileExtensions: TD_FILE_EXTENSIONS,
    family: EditorFamilyType.MASTER,
    browser: {
      assetUrl: `file://${BROWSER_BASE_PATH}/path`,
      indexUrl: `file://${BROWSER_BASE_PATH}/index.html`
    },
    cwd: process.cwd(),
    argv: argv,
    log: {
      level: Number(process.env.LOG_LEVEL)
    },
    experimental: argv.experimental ? (process.env.EXPERIMENTAL = true) : null,
    port: process.env.PORT || (process.env.PORT = await getPort()),
    hostname: process.env.HOSTNAME || (process.env.HOSTNAME = "localhost")
  };

  const injector = new Injector(
    createCommonEditorProviders(config),

    // services
    new ApplicationServiceProvider("browser", BrowserService),
    
    // commands
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, SpawnWorkerCommand),
    new CommandFactoryProvider(OpenNewWorkspaceRequest.OPEN_NEW_WORKSPACE, OpenNewWorkspaceCommand),
    new CommandFactoryProvider(SelectDirectoryRequest.SELECT_DIRECTORY_REQUEST, SelectDirectoryCommand),
    new CommandFactoryProvider(ApplicationReadyMessage.READY, CLIOpenWorkspaceCommand),
    new CommandFactoryProvider(GetProjectStartOptionsRequest.GET_PROJECT_STARTER_OPTIONS, GetProjectStarterOptionsCommand),
    new CommandFactoryProvider(StartNewProjectRequest.START_NEW_PROJECT, StartProjectCommand),

    // starters
    new ProjectStarterFactoryProvider({ 
      id: "html", 
      label: "HTML",
      image: "assets/html5-logo.png",
      enabled: true
    }, HTMLProjectStarter),

    new ProjectStarterFactoryProvider({ 
      id: "react+webpack", 
      label: "React + Webpack",
      image: "assets/react-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "angular2", 
      label: "Angular2",
      image: "assets/angular-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "ember", 
      label: "Ember",
      image: "assets/ember-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "jekyll", 
      label: "Jekyll",
      image: "assets/jekyll-logo.png",
      enabled: false
    }, function(){} as any)
  );

  const app = new ServiceApplication(injector);
  await app.initialize();
}

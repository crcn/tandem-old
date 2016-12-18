import { argv } from "yargs";
import fs = require("fs");
import path =  require("path");
import electron =  require("electron");
import getPort =  require("get-port");
import { TD_FILE_EXTENSIONS } from "@tandem/tdproject-extension/constants";
import { createTDProjectCoreProviders } from "@tandem/tdproject-extension/core";
import { createCoreStudioWorkerProviders } from "../worker";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/common";
import { createSyntheticBrowserWorkerProviders, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";
import { EditorFamilyType, createCommonEditorProviders, IEditorCommonConfig, SaveAllRequest } from "@tandem/editor/common";

import { IStudioEditorServerConfig } from "./config";
import { 
  HandlePingCommand,
  AutoUpdateCommand,
  SpawnWorkerCommand, 
  SaveAllFilesCommand,
  InitSettingsCommand,
  OpenTextFileCommand,
  StartProjectCommand,
  GetHelpOptionsCommand,
  OpenHelpOptionCommand,
  SelectDirectoryCommand,
  OpenNewWorkspaceCommand,
  CLIOpenWorkspaceCommand,
  ResolveWorkspaceURICommand,
  CreateTempWorkspaceCommand,
  InstallShellCommandsCommand,
  InitSettingsDirectoryCommand,
  GetProjectStarterOptionsCommand,
} from "./commands";

import { BrowserService } from "./services";
import { ResponsiveProjectStarter, BlankProjectStarter } from "./project/starters";
import { ProjectStarterFactoryProvider, TandemMasterStudioStoreProvider } from "./providers";

import { 
  PingRequest,
  OpenFileRequest,
  GetHelpOptionsRequest,
  OpenHelpOptionRequest,
  StartNewProjectRequest,
  SelectDirectoryRequest,
  OpenNewWorkspaceRequest,
  ResolveWorkspaceURIRequest,
  GetProjectStartOptionsRequest,
  InstallCommandLineToolsRequest,
  CreateTemporaryWorkspaceRequest,
} from "tandem-code/common";

import { TandemStudioMasterStore } from "./stores";

import {
   Kernel,
   LogLevel,
   serialize,
   IBrokerBus,
   deserialize,
   CommandFactoryProvider,
   LoadApplicationRequest,
   ApplicationReadyMessage,
   InitializeApplicationRequest,
} from "@tandem/common";

declare const __root: any;

process.env.LOG_LEVEL = process.env.LOG_LEVEL || LogLevel[String(argv.logLevel).toUpperCase()] || (argv.verbose ? LogLevel.VERBOSE : LogLevel.DEFAULT);

if (argv.executedFrom) {
  process.chdir(argv.executedFrom);
}

const ROOT_DIR           = (typeof __root !== "undefined" ? __root : __dirname + "/../");
const BROWSER_BASE_PATH  = `${ROOT_DIR}/browser`;
const ASSETS_DIR         = `${ROOT_DIR}/assets`;
const HOME               = process.env.HOME || process.env.USERPROFILE;

export const initializeMaster = async () => {

  const config: IStudioEditorServerConfig = {
    projectFileExtensions: TD_FILE_EXTENSIONS,
    family: EditorFamilyType.MASTER,
    appDirectory: ROOT_DIR,
    settingsDirectory: HOME + "/.tandem",
    cacheDirectory: HOME + "/.tandem/cache",
    tmpDirectory: HOME + "/.tandem/tmp",
    updateFeedHost: 'http://tandem-code.herokuapp.com/',
    help: {
      directory: ASSETS_DIR + "/help"
    },
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

  const kernel = new Kernel(
    createCommonEditorProviders(config),

    // services
    new ApplicationServiceProvider("browser", BrowserService),
    
    // commands
    new CommandFactoryProvider(ResolveWorkspaceURIRequest.RESOLVE_WORKSPACE_URI, ResolveWorkspaceURICommand),
    new CommandFactoryProvider(PingRequest.PING, HandlePingCommand),
    new CommandFactoryProvider(SaveAllRequest.SAVE_ALL, SaveAllFilesCommand),
    new CommandFactoryProvider(CreateTemporaryWorkspaceRequest.CREATE_TEMPORARY_WORKSPACE, CreateTempWorkspaceCommand),
    new CommandFactoryProvider(InstallCommandLineToolsRequest.INSTALL_COMMAND_LINE_TOOLS, InstallShellCommandsCommand),
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, InitSettingsDirectoryCommand),
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, InitSettingsCommand),
    new CommandFactoryProvider(GetHelpOptionsRequest.GET_HELP_OPTIONS, GetHelpOptionsCommand),
    new CommandFactoryProvider(OpenHelpOptionRequest.OPEN_HELP_OPTION, OpenHelpOptionCommand),
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, SpawnWorkerCommand),
    new CommandFactoryProvider(OpenFileRequest.OPEN_FILE, OpenTextFileCommand),
    new CommandFactoryProvider(OpenNewWorkspaceRequest.OPEN_NEW_WORKSPACE, OpenNewWorkspaceCommand),
    new CommandFactoryProvider(SelectDirectoryRequest.SELECT_DIRECTORY_REQUEST, SelectDirectoryCommand),
    new CommandFactoryProvider(ApplicationReadyMessage.READY, CLIOpenWorkspaceCommand),
    new CommandFactoryProvider(ApplicationReadyMessage.READY, AutoUpdateCommand),
    new CommandFactoryProvider(GetProjectStartOptionsRequest.GET_PROJECT_STARTER_OPTIONS, GetProjectStarterOptionsCommand),
    new CommandFactoryProvider(StartNewProjectRequest.START_NEW_PROJECT, StartProjectCommand),

    new TandemMasterStudioStoreProvider(TandemStudioMasterStore),
    createTDProjectCoreProviders(),

    new ProjectStarterFactoryProvider({ 
      id: "blank", 
      label: "Blank",
      image: "../assets/images/html5-logo.png",
      enabled: true
    }, BlankProjectStarter),

    // starters
    new ProjectStarterFactoryProvider({ 
      id: "html", 
      label: "Responsive",
      image: "../assets/images/html5-logo.png",
      enabled: true
    }, ResponsiveProjectStarter),


    new ProjectStarterFactoryProvider({ 
      id: "react+webpack", 
      label: "React + Webpack",
      image: "../assets/images/react-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "angular2", 
      label: "Angular2",
      image: "../assets/images/angular-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "ember", 
      label: "Ember",
      image: "../assets/images/ember-logo.png",
      enabled: false
    }, function(){} as any),

    new ProjectStarterFactoryProvider({ 
      id: "jekyll", 
      label: "Jekyll",
      image: "../assets/images/jekyll-logo.png",
      enabled: false
    }, function(){} as any)
  );

  const app = new ServiceApplication(kernel);
  await app.initialize();
}

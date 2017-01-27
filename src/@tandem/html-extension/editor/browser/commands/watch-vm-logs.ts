import { CallbackDispatcher } from "@tandem/mesh";
import { BaseSyntheticBrowser } from "@tandem/synthetic-browser";
import { HTMLExtensionBaseCommand } from "./base";
import { LogEvent, LogLevel, CoreEvent, Status } from "@tandem/common";


export class WatchVMLogsCommand extends HTMLExtensionBaseCommand {
  execute() {

    const onNewBrowser = (browser: BaseSyntheticBrowser) => {
      if (!browser) return;

      browser.observe(new CallbackDispatcher((event: CoreEvent) => {
        if (event.type === LogEvent.LOG) {
          this.htmlStore.vmLogs.push(event as LogEvent);
        }
      }));

      browser.statusWatcher.connect((status) => {
        if (status.type === Status.LOADING) {
          this.htmlStore.clearVMLogs();
        }
      }).trigger();


      // testing
      if (window["$synthetic"]) {
        this.htmlStore.clearVMLogs();
        this.htmlStore.vmLogs.push(new LogEvent(LogLevel.INFO, "INFO"));
        this.htmlStore.vmLogs.push(new LogEvent(LogLevel.WARNING, "WARN"));
        this.htmlStore.vmLogs.push(new LogEvent(LogLevel.ERROR, "ERROR"));
      }
    };

    this.editorStore.workspaceWatcher.connect((workspace) => {
      if (workspace) workspace.browserWatcher.connect(onNewBrowser).trigger();
    }).trigger();


  }
}
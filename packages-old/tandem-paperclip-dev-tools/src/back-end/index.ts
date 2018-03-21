import { spawn } from "child_process";
import { InitOptions } from "./state";
import { initServerRequested } from "./actions";

const RESPAWN_TIMEOUT = 1000;

export const start = (options: InitOptions, onMessage: (message) => any = () => {}) => {
  let _killed = false;
  const child = spawn(
    "node",
    [require.resolve("./server")],
    {
      stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
    }
  );

  // piping does not work in VSCode debugger, so we do this
  const logChunk = (chunk) => console.log(String(chunk).replace(/[\r\n\t]/g, ""))

  if (options.pipeStdio !== false) {
    child.stdout.addListener("data", logChunk);
    child.stderr.addListener("data", logChunk);
  }

  child.on("exit", () => {
    if (_killed) {
      return;
    }
    console.error("Child process closed -- respawning");
    setTimeout(() => {
      start(options, onMessage);
    }, RESPAWN_TIMEOUT);
  });

  process.on("beforeExit", () => {
    child.kill();
  });

  child.on("message", (action) => {
    if (action.type === "$$PING") {
      return child.send({ type: "$$PONG" });
    }
    onMessage(action);
  });
  child.send(initServerRequested(options));

  return {
    dispose() {
      _killed = true;
      child.kill();
    },
    send(message) {
      child.send(message);
    }
  };
}
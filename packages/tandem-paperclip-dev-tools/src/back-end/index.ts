import { fork } from "child_process";
import { InitOptions } from "./state";
import { initServerRequested } from "./actions";

const RESPAWN_TIMEOUT = 1000;

export const start = (options: InitOptions, onMessage: (message) => any = () => {}) => {
  const child = fork(
    require.resolve("./server"),
    [],
    {
      stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
    }
  );


  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on("exit", () => {
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
}
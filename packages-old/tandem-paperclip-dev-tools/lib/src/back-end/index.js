"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var actions_1 = require("./actions");
var RESPAWN_TIMEOUT = 1000;
exports.start = function (options, onMessage) {
    if (onMessage === void 0) { onMessage = function () { }; }
    var _killed = false;
    var child = child_process_1.spawn("node", [require.resolve("./server")], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
    // piping does not work in VSCode debugger, so we do this
    var logChunk = function (chunk) { return console.log(String(chunk).replace(/[\r\n\t]/g, "")); };
    if (options.pipeStdio !== false) {
        child.stdout.addListener("data", logChunk);
        child.stderr.addListener("data", logChunk);
    }
    child.on("exit", function () {
        if (_killed) {
            return;
        }
        console.error("Child process closed -- respawning");
        setTimeout(function () {
            exports.start(options, onMessage);
        }, RESPAWN_TIMEOUT);
    });
    process.on("beforeExit", function () {
        child.kill();
    });
    child.on("message", function (action) {
        if (action.type === "$$PING") {
            return child.send({ type: "$$PONG" });
        }
        onMessage(action);
    });
    child.send(actions_1.initServerRequested(options));
    return {
        dispose: function () {
            _killed = true;
            child.kill();
        },
        send: function (message) {
            child.send(message);
        }
    };
};
//# sourceMappingURL=index.js.map
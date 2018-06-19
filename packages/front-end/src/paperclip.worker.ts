import { createLocalPCRuntime, hookRemotePCRuntime } from "paperclip";
console.log("START");
hookRemotePCRuntime(createLocalPCRuntime(), self);
import { createLocalPCRuntime, hookRemotePCRuntime } from "paperclip";
hookRemotePCRuntime(createLocalPCRuntime(), self);
console.log("WK2");
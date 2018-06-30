import { createLocalPCRuntime, hookRemotePCRuntime } from "paperclip";
hookRemotePCRuntime(createLocalPCRuntime(), self as any);

console.log("O21");

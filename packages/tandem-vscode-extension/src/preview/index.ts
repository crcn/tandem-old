// interface vscode {
//   postMessage(message: any): void;
// }

// declare namespace vscode {
//   postMessage(message: any): void;
// }

declare var vscode: any;

const openFile = (uri: string) => {
  
};

const updateFile = (uri: string, content: string) => {
  document.body.innerHTML = content;
};

const onMessage = ({data: message}: MessageEvent) => {
  switch(message.type) {
    case "open": return openFile(message.uri);
    case "updateFile": return updateFile(message.uri, message.content);
  }
};

window.onmessage = onMessage;
vscode.postMessage({ type: "loaded" });

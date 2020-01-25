declare var vscode: any;

document.body.innerHTML = "OKOKO";

const onMessage = ({ data: event }: MessageEvent) => {
  console.log(event);
  if (event.type === "Evaluated") {
    document.body.innerHTML = JSON.stringify(event.node);
  }
};

window.onmessage = onMessage;
vscode.postMessage({ type: "loaded" });

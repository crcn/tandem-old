import * as pc from "paperclip";

let engine = new pc.Engine();

engine.parseContent("<import /> hello world!! <div></div>").then(value => {
  console.log(value);
});

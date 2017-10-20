import { 
  transpilePaperclipToStringRenderer
} from "../../paperclip";
import { expect } from "chai";

describe(__filename + "#", () => {
  xit("can transpile a text node", () => {
    const newSource = transpilePaperclipToStringRenderer(`
      <template name="test">
        <span style={{'color:' + color}}>
          {{name}}
        </span>
      </template>
    `);
  });
});
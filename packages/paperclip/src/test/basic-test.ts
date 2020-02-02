import { Engine } from "../engine";
import { expect } from "chai";
import * as http from "http";
import { EngineEventType, EvaluatedEvent } from "../events";
import { stringifyVirtualNode } from "../stringify-virt-node";

const TEST_SERVER_PORT = 8999;

describe(__filename + "#", () => {
  let server: http.Server;
  let currentGraph = {};

  before(next => {
    server = http.createServer((req, res) => {
      res.end(currentGraph[req.url]);
    });
    server.listen(TEST_SERVER_PORT);
    setTimeout(next, 500);
  });

  after(() => {
    server.close();
  });

  const waitForEvaluated = async (engine: Engine): Promise<EvaluatedEvent> => {
    return new Promise(resolve => {
      engine.onEvent(event => {
        if (event.type === EngineEventType.Evaluated) {
          resolve(event);
        }
      });
    });
  };

  [
    // basic parsing
    [
      {
        "/entry.pc": `Hello World`
      },
      {},
      `Hello World`
    ],
    [
      {
        "/entry.pc": `<span>more text</span>`
      },
      {},
      `<span data-pc-ea61779e><style></style>more text</span>`
    ],

    // styles
    [
      {
        "/entry.pc": `
          <style>
            span {
              color: red;
            }
          </style>
          <span>more text</span>
        `
      },
      {},
      `<span data-pc-ea61779e>
        <style>
          span[data-pc-ea61779e] { 
            color:red;
          }
        </style>
        more text
      </span>`
    ],

    // components
    [
      {
        "/button.pc": `
          <style>
            span {
              color: red;
            }
          </style>
          <span>more text</span>
        `,
        "/entry.pc": `
          <import id="something" src="./button.pc" />
          <button>hello world</button>
        `
      },
      {},
      `<span data-pc-ea61779e>
        <style>
          span[data-pc-ea61779e] { 
            color:red;
          }
        </style>
        more text
      </span>`
    ]
  ].forEach(([graph, context, expectedHTML]) => {
    it(`can render "${JSON.stringify(graph)}"`, async () => {
      currentGraph = graph;
      const engine = new Engine({
        httpFilePath: `http://0.0.0.0:${TEST_SERVER_PORT}/`
      });
      engine.load("entry.pc");
      const event = await waitForEvaluated(engine);
      const nodeStr = stringifyVirtualNode(event.node);
      expect(nodeStr.replace(/[\r\n\t\s]+/g, "")).to.eql(
        String(expectedHTML).replace(/[\r\n\t\s]+/g, "")
      );
    });
  });
});

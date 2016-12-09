import { SyntheticWindow } from "../window";
import { URIProtocolProvider } from "@tandem/sandbox";
import { IStreamableDispatcher, DuplexStream } from "@tandem/mesh";
import { inject, Injector, InjectorProvider, loggable, Logger } from "@tandem/common";
import { IHTTPHeaders, HTTPRequest, HTTPResponse, HTTPStatusType } from "./messages";

@loggable()
export class XHRServer implements IStreamableDispatcher<HTTPRequest> {
  
  protected readonly logger: Logger;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  constructor(window: SyntheticWindow) {
    
  }
  
  dispatch(request: HTTPRequest) {
    if (request.type !== HTTPRequest.HTTP_REQUEST) return;
    return new DuplexStream((input, output) => {

      const writer = output.getWriter();
      

      const response = new HTTPResponse(HTTPStatusType.OK, {
        contentType: "text/plain"
      });

      writer.write(response);
      
      this.logger.info(`XHR ${request.method} ${request.url}`);

      URIProtocolProvider.lookup(request.url, this._injector).read(request.url).catch((e) => {
        writer.abort(e);
      }).then((buffer) => {
        writer.write(String(buffer));
        writer.close();
      });
    });
  }
}
import * as Url from "url";

export default Object.assign({}, {
  backend: {
    hostname: window.location.hostname,
    port: Number(Url.parse(window.location.toString(), true).query.backendPort || window.location.port)
  }
}, global["config"]);
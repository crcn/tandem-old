import * as Url from "url";

export default Object.assign({}, {

  // may be a slave
  backend: typeof window != "undefined" ? {
    hostname: window.location.hostname,
    port: Number(Url.parse(window.location.toString(), true).query.backendPort || window.location.port)
  } : null
}, global["config"]);
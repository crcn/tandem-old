import * as Url from "url";

import { start } from "./tether";

start(Url.parse(window.location.toString(), true).query.channel);

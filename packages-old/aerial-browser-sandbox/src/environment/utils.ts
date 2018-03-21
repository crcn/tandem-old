
import path = require("path");
import Url = require("url");

// console.log("PAT", path.normalize("http://google.com/a/../b"), Url.resolve("http://google.com/test/index.html", "a.js"), Url.resolve("http://google.com/test", "/a.js"));

// const joinPath = (...parts: string[]) => parts.reduce((a, b) => {
//   return a + (b.charAt(0) === "/" || a.charAt(a.length - 1) === "/" ? b : "/" + b);
// });

export const getUri = (href: string, locationStr: string) => {
  if (locationStr.charAt(0) === "/") {
    return href;
  }
  return Url.resolve(locationStr, href);
  // const location = Url.parse(locationStr);
  // const origin = location.protocol + "//" + location.host;


  // const relativeDir = location.pathname && /.\w+$/.test(location.pathname) ? path.dirname(location.pathname) : location.pathname;
  // return hasURIProtocol(href) ? href : /^\/\//.test(href) ? location.protocol + href : href.charAt(0) === "/" ? joinPath(origin, href) : joinPath(origin, relativeDir, href);
};
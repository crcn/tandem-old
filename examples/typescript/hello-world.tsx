import "./hello-world.scss";
import hello from "test";
import * as sift from "sift";

const render = (a, b) => {
  return <div class="item" style="color:orange;font-size:80px;">hello {a} {b}</div>;
}

const element = document.createElement("div");
// element.innerHTML = "<div style='color:white;'>hello</div>";
document.body.appendChild(element);
renderJSX(render("a", hello()), element);

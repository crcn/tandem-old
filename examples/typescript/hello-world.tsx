import { content } from "./hello-world.scss";
import * as sift from "sift";

const renderItem = (message) => {
  return <li class="item" style="color:orange;font-size:80px;">item {message}</li>;
}

/* tandem: render() */
const renderItems = (...items) => {
  return <ul>{items.map((item) => renderItem(item))}</ul>;
}

const sifter = sift({$gt: 1 });

// console.log(sifter({ a: "c" }));

const element = document.createElement("div");
// element.innerHTML = "<div style='color:white;'>hello</div>";
document.body.appendChild(element);


renderJSX(renderItems(0, 1, 2, 3, 4), element);

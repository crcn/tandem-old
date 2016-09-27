import "./hello-world.scss";
import * as sift from "sift";

const renderItem = (message) => {
  return <li class="item" style="color:orange;font-size:80px;">item {message}</li>;
}

const renderItems = (...items) => {
  return <ul>{items.map((item) => renderItem(item))}</ul>;
}

const sifter = sift({ a: {$gte: -2 } });

// console.log(sifter({ a: "c" }));

const element = document.createElement("div");
// element.innerHTML = "<div style='color:white;'>hello</div>";
document.body.appendChild(element);

renderJSX(renderItems(0, 1, 2, 3, 4, 5), element);

import "./hello-world.scss";

const render = (a, b) => {
  return <div class="item">hello {a} {b}</div>;
}

const element = document.createElement("div");
document.body.appendChild(element);
renderJSX(render("a", "b"), element);

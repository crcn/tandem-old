import "./hello-world.scss";

const render = (message) => {
  return <div class="item">hello { message }</div>;
}

const element = document.createElement("div");
document.body.appendChild(element);
renderJSX(render("blarg"), element);
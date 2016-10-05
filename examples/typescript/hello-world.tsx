import "./hello-world.scss";

const element = document.createElement("div");
element.innerHTML = `<div class="container item">
  <div class="row">Hello World</div>
  <strong>blarg</strong>!!!
</div>`;

document.body.appendChild(element);

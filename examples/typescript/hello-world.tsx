// import "./hello-world.scss";

const render = (a, b) => {
  return <div class="item" style="color:white;font-size:20px;">hello {a} {b}</div>;
}

const element = document.createElement("div");
element.innerHTML = "<div style='color:white;'>hello</div>";
document.body.appendChild(element);
// renderJSX(render("a", "b"), element);

import "./index.scss";

const element = document.createElement("div");
element.innerHTML = `
  <div class="test">
    Hello!
    <div class="child">
      Something else
    </div>
  </div>
`;


module.exports = element;
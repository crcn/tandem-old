const element = document.createElement("div");
element.innerHTML = "hello <span>world</span>";
console.log(Array.prototype.slice.call(element.childNodes));

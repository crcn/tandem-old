import { supportedFonts } from "detect-font";

// from http://www.cssfontstack.com/

/*
scraper:

JSON.stringify(Array.prototype.map.call(document.querySelectorAll("h4 > a"), (element) => {
  return element.textContent;
}), null, 2);
*/
const POSSIBLE_FONTS = [
  "Arial",
  "Arial Black",
  "Arial Narrow",
  "Arial Rounded MT Bold",
  "Avant Garde",
  "Calibri",
  "Candara",
  "Century Gothic",
  "Franklin Gothic Medium",
  "Futura",
  "Geneva",
  "Gill Sans",
  "Helvetica",
  "Impact",
  "Lucida Grande",
  "Optima",
  "Segoe UI",
  "Tahoma",
  "Trebuchet MS",
  "Verdana",
  "Big Caslon",
  "Bodoni MT",
  "Book Antiqua",
  "Calisto MT",
  "Cambria",
  "Didot",
  "Garamond",
  "Georgia",
  "Goudy Old Style",
  "Hoefler Text",
  "Lucida Bright",
  "Palatino",
  "Perpetua",
  "Rockwell",
  "Rockwell Extra Bold",
  "Baskerville",
  "Times New Roman",
  "Consolas",
  "Courier New",
  "Lucida Console",
  "Lucida Sans Typewriter",
  "Monaco",
  "Andale Mono",
  "Copperplate",
  "Papyrus",
  "Brush Script MT"
];

const model = document.createElement("div");
model.style.fontFamily = POSSIBLE_FONTS.join(", ");
document.body.appendChild(model);

export const SUPPORTED_FONTS = supportedFonts(model).map((font) => font.replace(/["']/g, "").trim());


document.body.removeChild(model);
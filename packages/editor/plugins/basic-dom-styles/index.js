import { ApplicationPlugin } from 'editor/plugin/types';

/*

http://www.blooberry.com/indexdot/css/propindex/all.htm

transform:

left, top, width, height

typography:

appearance:

border, border-[side], border-[side]-color, border-[side]-width

display, visibility

combined props:

text alignment

*/

export default ApplicationPlugin.create({
  id: 'basicDomStyles',
  factory: {
    create: create
  }
});

function create({ app }) {

  // DOM STYLES
}

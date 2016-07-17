export default function (documentation) {
  return (proto, name) => {

    if (!proto.__documentation) {
      proto.__documentation = {};
    }

    proto.__documentation[name] = documentation;
  };
}

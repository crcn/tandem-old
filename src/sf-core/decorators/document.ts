/**
 * Adds documentation for method - used particularly for stdin util for the
 * backend
 */

export default function (documentation) {
  return (proto, name) => {

    if (!proto.__documentation) {
      proto.__documentation = {};
    }

    proto.__documentation[name] = documentation;
  };
}

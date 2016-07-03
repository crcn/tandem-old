// silence logs for unit tests. Only errors are useful here.
console.warn = console.info = console.log = function() {
    // do nothing
};

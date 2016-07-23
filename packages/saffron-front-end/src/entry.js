"use strict";
const application_1 = require('./application');
// need to fetch the window configuration
const appConfig = Object.assign({}, window['config'], {});
const app = window['app'] = new application_1.default(appConfig);
window.onload = () => {
    app.initialize();
};
//# sourceMappingURL=entry.js.map
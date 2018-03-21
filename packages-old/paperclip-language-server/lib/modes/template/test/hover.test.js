/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var htmlParser_1 = require("../parser/htmlParser");
var htmlHover_1 = require("../services/htmlHover");
var hover_test_util_1 = require("../../test-util/hover-test-util");
var tagProviders_1 = require("../tagProviders");
var html = hover_test_util_1.hoverDSL({
    docUri: 'test://test/test.html',
    langId: 'paperclip',
    doHover: function (document, position) {
        var htmlAST = htmlParser_1.parseHTMLDocument(document);
        return htmlHover_1.doHover(document, position, htmlAST, tagProviders_1.allTagProviders);
    }
});
suite('HTML Hover', function () {
    test('Single', function () {
        (_a = ["|<html></html>"], _a.raw = ["|<html></html>"], html(_a)).hasNothing();
        (_b = ["<|html></html>"], _b.raw = ["<|html></html>"], html(_b)).hasHoverAt('<html>', 1);
        (_c = ["<h|tml></html>"], _c.raw = ["<h|tml></html>"], html(_c)).hasHoverAt('<html>', 1);
        (_d = ["<htm|l></html>"], _d.raw = ["<htm|l></html>"], html(_d)).hasHoverAt('<html>', 1);
        (_e = ["<html|></html>"], _e.raw = ["<html|></html>"], html(_e)).hasHoverAt('<html>', 1);
        (_f = ["<div|></div>"], _f.raw = ["<div|></div>"], html(_f)).hasHoverAt('<div>', 1);
        (_g = ["<html>|</html>"], _g.raw = ["<html>|</html>"], html(_g)).hasNothing();
        (_h = ["<html><|/html>"], _h.raw = ["<html><|/html>"], html(_h)).hasNothing();
        (_j = ["<html></|html>"], _j.raw = ["<html></|html>"], html(_j)).hasHoverAt('</html>', 8);
        (_k = ["<html></h|tml>"], _k.raw = ["<html></h|tml>"], html(_k)).hasHoverAt('</html>', 8);
        (_l = ["<html></ht|ml>"], _l.raw = ["<html></ht|ml>"], html(_l)).hasHoverAt('</html>', 8);
        (_m = ["<html></htm|l>"], _m.raw = ["<html></htm|l>"], html(_m)).hasHoverAt('</html>', 8);
        (_o = ["<html></html|>"], _o.raw = ["<html></html|>"], html(_o)).hasHoverAt('</html>', 8);
        (_p = ["<|component></component>"], _p.raw = ["<|component></component>"], html(_p)).hasHoverAt('<component>', 1);
        (_q = ["<html></html>|"], _q.raw = ["<html></html>|"], html(_q)).hasNothing();
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    });
    test('Attribute', function () {
        (_a = ["<div a|ria-atomic=\"true\"></div>"], _a.raw = ["<div a|ria-atomic=\"true\"></div>"], html(_a)).hasHoverAt('No doc for aria-atomic', 5);
        (_b = ["<component inli|ne-template></component>"], _b.raw = ["<component inli|ne-template></component>"], html(_b)).hasHoverAt('treat inner content as its template rather than distributed content', 11);
        (_c = ["<div :v|-if=\"true\"></div>"], _c.raw = ["<div :v|-if=\"true\"></div>"], html(_c)).hasHoverAt('Conditionally renders the element based on the truthy\\-ness of the expression value\\.', 5);
        var _a, _b, _c;
    });
});
//# sourceMappingURL=hover.test.js.map
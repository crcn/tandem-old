/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var completion_test_util_1 = require("../../test-util/completion-test-util");
var htmlParser_1 = require("../parser/htmlParser");
var htmlCompletion_1 = require("../services/htmlCompletion");
var tagProviders_1 = require("../tagProviders");
var setup = {
    langId: 'paperclip',
    docUri: 'test://test/test.html',
    doComplete: function (doc, pos) {
        var htmlDoc = htmlParser_1.parseHTMLDocument(doc);
        return htmlCompletion_1.doComplete(doc, pos, htmlDoc, tagProviders_1.allTagProviders);
    }
};
var html = completion_test_util_1.testDSL(setup);
suite('HTML Completion', function () {
    test('Complete Start Tag', function () {
        (_a = ["<|"], _a.raw = ["<|"], html(_a)).has('iframe')
            .become('<iframe')
            .has('h1')
            .become('<h1')
            .has('div')
            .become('<div');
        (_b = ["< |"], _b.raw = ["< |"], html(_b)).has('iframe')
            .become('<iframe')
            .has('h1')
            .become('<h1')
            .has('div')
            .become('<div');
        (_c = ["<h|"], _c.raw = ["<h|"], html(_c)).has('html')
            .become('<html')
            .has('h1')
            .become('<h1')
            .has('header')
            .become('<header');
        (_d = ["<input|"], _d.raw = ["<input|"], html(_d)).has('input').become('<input');
        (_e = ["<inp|ut"], _e.raw = ["<inp|ut"], html(_e)).has('input').become('<input');
        (_f = ["<|inp"], _f.raw = ["<|inp"], html(_f)).has('input').become('<input');
        var _a, _b, _c, _d, _e, _f;
    });
    test('Complete Attribute', function () {
        (_a = ["<input |"], _a.raw = ["<input |"], html(_a)).has('type')
            .become('<input type="$1"')
            .has('style')
            .become('<input style="$1"')
            .hasNo('onmousemove');
        (_b = ["<input t|"], _b.raw = ["<input t|"], html(_b)).has('type')
            .become('<input type="$1"')
            .has('tabindex')
            .become('<input tabindex="$1"');
        (_c = ["<input t|ype"], _c.raw = ["<input t|ype"], html(_c)).has('type')
            .become('<input type="$1"')
            .has('tabindex')
            .become('<input tabindex="$1"');
        (_d = ["<input t|ype=\"text\""], _d.raw = ["<input t|ype=\"text\""], html(_d)).has('type')
            .become('<input type="text"')
            .has('tabindex')
            .become('<input tabindex="text"');
        (_e = ["<input type=\"text\" |"], _e.raw = ["<input type=\"text\" |"], html(_e)).has('style')
            .become('<input type="text" style="$1"')
            .has('type')
            .become('<input type="text" type="$1"')
            .has('size')
            .become('<input type="text" size="$1"');
        (_f = ["<input type=\"text\" s|"], _f.raw = ["<input type=\"text\" s|"], html(_f)).has('style')
            .become('<input type="text" style="$1"')
            .has('type')
            .become('<input type="text" type="$1"')
            .has('size')
            .become('<input type="text" size="$1"');
        (_g = ["<input di| type=\"text\""], _g.raw = ["<input di| type=\"text\""], html(_g)).has('disabled')
            .become('<input disabled type="text"')
            .has('dir')
            .become('<input dir="$1" type="text"');
        (_h = ["<input disabled | type=\"text\""], _h.raw = ["<input disabled | type=\"text\""], html(_h)).has('dir')
            .become('<input disabled dir="$1" type="text"')
            .has('style')
            .become('<input disabled style="$1" type="text"');
        (_j = ["<input :di|"], _j.raw = ["<input :di|"], html(_j)).has('dir').become('<input :dir="$1"');
        (_k = ["<input :di| type=\"text\""], _k.raw = ["<input :di| type=\"text\""], html(_k)).has('dir').become('<input :dir="$1" type="text"');
        (_l = ["<input @|"], _l.raw = ["<input @|"], html(_l)).has('mousemove').become('<input @mousemove="$1"');
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    });
    test('Complete Value', function () {
        (_a = ["<input type=|"], _a.raw = ["<input type=|"], html(_a)).has('text')
            .become('<input type="text"')
            .has('checkbox')
            .become('<input type="checkbox"');
        (_b = ["<input type=\"c|"], _b.raw = ["<input type=\"c|"], html(_b)).has('color')
            .become('<input type="color')
            .has('checkbox')
            .become('<input type="checkbox');
        (_c = ["<input type=\"|"], _c.raw = ["<input type=\"|"], html(_c)).has('color')
            .become('<input type="color')
            .has('checkbox')
            .become('<input type="checkbox');
        (_d = ["<input type= |"], _d.raw = ["<input type= |"], html(_d)).has('color')
            .become('<input type= "color"')
            .has('checkbox')
            .become('<input type= "checkbox"');
        (_e = ["<input src=\"c\" type=\"color|\" "], _e.raw = ["<input src=\"c\" type=\"color|\" "], html(_e)).has('color').become('<input src="c" type="color" ');
        (_f = ["<iframe sandbox=\"allow-forms |"], _f.raw = ["<iframe sandbox=\"allow-forms |"], html(_f)).has('allow-modals').become('<iframe sandbox="allow-forms allow-modals');
        (_g = ["<iframe sandbox=\"allow-forms allow-modals|"], _g.raw = ["<iframe sandbox=\"allow-forms allow-modals|"], html(_g)).has('allow-modals')
            .become('<iframe sandbox="allow-forms allow-modals');
        (_h = ["<iframe sandbox=\"allow-forms all|\""], _h.raw = ["<iframe sandbox=\"allow-forms all|\""], html(_h)).has('allow-modals').become('<iframe sandbox="allow-forms allow-modals"');
        (_j = ["<iframe sandbox=\"allow-forms a|llow-modals \""], _j.raw = ["<iframe sandbox=\"allow-forms a|llow-modals \""], html(_j)).has('allow-modals')
            .become('<iframe sandbox="allow-forms allow-modals "');
        (_k = ["<input src=\"c\" type=color| "], _k.raw = ["<input src=\"c\" type=color| "], html(_k)).has('color').become('<input src="c" type="color" ');
        (_l = ["<div dir=|></div>"], _l.raw = ["<div dir=|></div>"], html(_l)).has('ltr')
            .become('<div dir="ltr"></div>')
            .has('rtl')
            .become('<div dir="rtl"></div>');
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    });
    test('Complete End Tag', function () {
        (_a = ["<ul><|>"], _a.raw = ["<ul><|>"], html(_a)).has('/ul')
            .become('<ul></ul>')
            .has('li')
            .become('<ul><li>');
        (_b = ["<ul><li><|"], _b.raw = ["<ul><li><|"], html(_b)).has('/li')
            .become('<ul><li></li>')
            .has('a')
            .become('<ul><li><a');
        (_c = ["<goo></|>"], _c.raw = ["<goo></|>"], html(_c)).has('/goo').become('<goo></goo>');
        (_d = ["<foo></f|"], _d.raw = ["<foo></f|"], html(_d)).has('/foo').become('<foo></foo>');
        (_e = ["<foo></f|o"], _e.raw = ["<foo></f|o"], html(_e)).has('/foo').become('<foo></foo>');
        (_f = ["<foo></|fo"], _f.raw = ["<foo></|fo"], html(_f)).has('/foo').become('<foo></foo>');
        (_g = ["<foo></ |>"], _g.raw = ["<foo></ |>"], html(_g)).has('/foo').become('<foo></foo>');
        (_h = ["<span></ s|"], _h.raw = ["<span></ s|"], html(_h)).has('/span').become('<span></span>');
        (_j = ["<li><br></ |>"], _j.raw = ["<li><br></ |>"], html(_j)).has('/li').become('<li><br></li>');
        (_k = ["<li/|>"], _k.raw = ["<li/|>"], html(_k)).count(0);
        (_l = ["  <div/|   "], _l.raw = ["  <div/|   "], html(_l)).count(0);
        (_m = ["<li><br/|>"], _m.raw = ["<li><br/|>"], html(_m)).count(0);
        (_o = ["<li><br>a/|"], _o.raw = ["<li><br>a/|"], html(_o)).count(0);
        (_p = ["<foo><br/></ f|>"], _p.raw = ["<foo><br/></ f|>"], html(_p)).has('/foo').become('<foo><br/></foo>');
        (_q = ["<li><div/></|"], _q.raw = ["<li><div/></|"], html(_q)).has('/li').become('<li><div/></li>');
        (_r = ["<foo><bar></bar></|   "], _r.raw = ["<foo><bar></bar></|   "], html(_r)).has('/foo').become('<foo><bar></bar></foo>   ');
        (_s = ["\n    <div>\n      <form>\n        <div>\n          <label></label>\n          <|\n        </div>\n      </form></div>"], _s.raw = ["\n    <div>\n      <form>\n        <div>\n          <label></label>\n          <|\n        </div>\n      </form></div>"], html(_s)).has('span')
            .become("\n    <div>\n      <form>\n        <div>\n          <label></label>\n          <span\n        </div>\n      </form></div>")
            .has('/div').become("\n    <div>\n      <form>\n        <div>\n          <label></label>\n        </div>\n        </div>\n      </form></div>");
        (_t = ["<body><div><div></div></div></|  >"], _t.raw = ["<body><div><div></div></div></|  >"], html(_t)).has('/body').become('<body><div><div></div></div></body  >');
        (_u = ["\n    <body>\n      <div>\n        </|"], _u.raw = ["\n    <body>\n      <div>\n        </|"], html(_u)).has('/div').become("\n    <body>\n      <div>\n      </div>");
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    });
    test('Vue complete', function () {
        (_a = ["<transition type=|></transition>"], _a.raw = ["<transition type=|></transition>"], html(_a)).has('transition')
            .become('<transition type="transition"></transition>')
            .has('animation')
            .become('<transition type="animation"></transition>');
        var _a;
    });
    test('Case sensitivity', function () {
        (_a = ["<LI></|"], _a.raw = ["<LI></|"], html(_a)).has('/LI')
            .become('<LI></LI>')
            .hasNo('/li');
        (_b = ["<lI></|"], _b.raw = ["<lI></|"], html(_b)).has('/lI').become('<lI></lI>');
        (_c = ["<iNpUt |"], _c.raw = ["<iNpUt |"], html(_c)).has('type').become('<iNpUt type="$1"');
        (_d = ["<INPUT TYPE=|"], _d.raw = ["<INPUT TYPE=|"], html(_d)).has('color').become('<INPUT TYPE="color"');
        var _a, _b, _c, _d;
    });
    test('Handlebar Completion', function () {
        (_a = ["<script id=\"entry-template\" type=\"text/x-handlebars-template\"> <| </script>"], _a.raw = ["<script id=\"entry-template\" type=\"text/x-handlebars-template\"> <| </script>"], html(_a)).has('div')
            .become('<script id="entry-template" type="text/x-handlebars-template"> <div </script>');
        var _a;
    });
    test('Complete aria', function () {
        function expectAria(asserter) {
            asserter
                .has('aria-activedescendant')
                .has('aria-atomic')
                .has('aria-autocomplete')
                .has('aria-busy')
                .has('aria-checked')
                .has('aria-colcount')
                .has('aria-colindex')
                .has('aria-colspan')
                .has('aria-controls')
                .has('aria-current')
                .has('aria-describedat')
                .has('aria-describedby')
                .has('aria-disabled')
                .has('aria-dropeffect')
                .has('aria-errormessage')
                .has('aria-expanded')
                .has('aria-flowto')
                .has('aria-grabbed')
                .has('aria-haspopup')
                .has('aria-hidden')
                .has('aria-invalid')
                .has('aria-kbdshortcuts')
                .has('aria-label')
                .has('aria-labelledby')
                .has('aria-level')
                .has('aria-live')
                .has('aria-modal')
                .has('aria-multiline')
                .has('aria-multiselectable')
                .has('aria-orientation')
                .has('aria-owns')
                .has('aria-placeholder')
                .has('aria-posinset')
                .has('aria-pressed')
                .has('aria-readonly')
                .has('aria-relevant')
                .has('aria-required')
                .has('aria-roledescription')
                .has('aria-rowcount')
                .has('aria-rowindex')
                .has('aria-rowspan')
                .has('aria-selected')
                .has('aria-setsize')
                .has('aria-sort')
                .has('aria-valuemax')
                .has('aria-valuemin')
                .has('aria-valuenow')
                .has('aria-valuetext');
        }
        expectAria((_a = ["<div |> </div >"], _a.raw = ["<div |> </div >"], html(_a)));
        expectAria((_b = ["<span  |> </span >"], _b.raw = ["<span  |> </span >"], html(_b)));
        expectAria((_c = ["<input  |> </input >"], _c.raw = ["<input  |> </input >"], html(_c)));
        var _a, _b, _c;
    });
    test('Settings', function () {
        function configured(settings) {
            return completion_test_util_1.testDSL({
                langId: 'paperclip',
                docUri: 'test://test/test.html',
                doComplete: function (doc, pos) {
                    var htmlDoc = htmlParser_1.parseHTMLDocument(doc);
                    var enabledTagProviders = tagProviders_1.getEnabledTagProviders(settings);
                    return htmlCompletion_1.doComplete(doc, pos, htmlDoc, enabledTagProviders);
                }
            });
        }
        var noHTML = configured({ html5: false, element: true, router: false });
        (_a = ["<|"], _a.raw = ["<|"], noHTML(_a)).has('el-input')
            .withDoc('Input data using mouse or keyboard.')
            .hasNo('div');
        (_b = ["<el-input |"], _b.raw = ["<el-input |"], noHTML(_b)).has('placeholder')
            .hasNo('text-color')
            .has('on-icon-click')
            .withDoc('hook function when clicking on the input icon')
            .has('auto-complete')
            .become('<el-input auto-complete="$1"');
        (_c = ["<el-cascader expand-trigger=|"], _c.raw = ["<el-cascader expand-trigger=|"], noHTML(_c)).has('click').has('hover');
        (_d = ["<el-tooltip |"], _d.raw = ["<el-tooltip |"], noHTML(_d)).has('content').withDoc('display content, can be overridden by slot#content');
        (_e = ["<el-popover |"], _e.raw = ["<el-popover |"], noHTML(_e)).has('content').withDoc('popover content, can be replaced with a default slot');
        var vueHTML = configured({ html5: true, element: false, router: false });
        (_f = ["<|"], _f.raw = ["<|"], vueHTML(_f)).has('div')
            .hasNo('el-row')
            .has('component');
        (_g = ["<input  |> </input >"], _g.raw = ["<input  |> </input >"], vueHTML(_g)).has('v-if').has('type');
        (_h = ["<li |"], _h.raw = ["<li |"], vueHTML(_h)).has('v-else')
            .become('<li v-else')
            .has('v-pre')
            .become('<li v-pre')
            .has('v-cloak')
            .become('<li v-cloak')
            .has('v-once')
            .become('<li v-once');
        var _a, _b, _c, _d, _e, _f, _g, _h;
    });
});
//# sourceMappingURL=completion.test.js.map
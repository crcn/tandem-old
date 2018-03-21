/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var htmlParser_1 = require("../parser/htmlParser");
var htmlSymbolsProvider_1 = require("../services/htmlSymbolsProvider");
suite('HTML Symbols', function () {
    var TEST_URI = 'test://test/test.html';
    var assertSymbols = function (symbols, expected) {
        assert.deepEqual(symbols, expected);
    };
    var testSymbolsFor = function (value, expected) {
        var document = vscode_languageserver_types_1.TextDocument.create(TEST_URI, 'html', 0, value);
        var htmlDoc = htmlParser_1.parseHTMLDocument(document);
        var symbols = htmlSymbolsProvider_1.findDocumentSymbols(document, htmlDoc);
        assertSymbols(symbols, expected);
    };
    test('Simple', function () {
        testSymbolsFor('<div></div>', [
            {
                containerName: '',
                name: 'div',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 0, 0, 11))
            }
        ]);
        testSymbolsFor('<div><input checked id="test" class="checkbox"></div>', [
            {
                containerName: '',
                name: 'div',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 0, 0, 53))
            },
            {
                containerName: 'div',
                name: 'input#test.checkbox',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 5, 0, 47))
            }
        ]);
    });
    test('Id and classes', function () {
        var content = '<html id=\'root\'><body id="Foo" class="bar"><div class="a b"></div></body></html>';
        var expected = [
            {
                name: 'html#root',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: '',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 0, 0, 80))
            },
            {
                name: 'body#Foo.bar',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: 'html#root',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 16, 0, 73))
            },
            {
                name: 'div.a.b',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: 'body#Foo.bar',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 43, 0, 66))
            }
        ];
        testSymbolsFor(content, expected);
    });
    test('Self closing', function () {
        var content = '<html><br id="Foo"><br id=Bar></html>';
        var expected = [
            {
                name: 'html',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: '',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 0, 0, 37))
            },
            {
                name: 'br#Foo',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: 'html',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 6, 0, 19))
            },
            {
                name: 'br#Bar',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: 'html',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 19, 0, 30))
            }
        ];
        testSymbolsFor(content, expected);
    });
    test('No attrib', function () {
        var content = '<html><body><div></div></body></html>';
        var expected = [
            {
                name: 'html',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: '',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 0, 0, 37))
            },
            {
                name: 'body',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: 'html',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 6, 0, 30))
            },
            {
                name: 'div',
                kind: vscode_languageserver_types_1.SymbolKind.Field,
                containerName: 'body',
                location: vscode_languageserver_types_1.Location.create(TEST_URI, vscode_languageserver_types_1.Range.create(0, 12, 0, 23))
            }
        ];
        testSymbolsFor(content, expected);
    });
});
//# sourceMappingURL=symbols.test.js.map
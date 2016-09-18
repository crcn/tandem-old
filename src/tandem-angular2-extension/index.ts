import { Component } from "@angular/core";
import { __compiler_private__ as _ng, I18NHtmlParser, BoundTextAst, OfflineCompiler, CompileDirectiveMetadata, CompileTypeMetadata } from "@angular/compiler";


const htmlParser = new I18NHtmlParser(new _ng.HtmlParser());
const expParser = new _ng.Parser(new _ng.Lexer());
const elementSchemaRegistry = new _ng.DomElementSchemaRegistry();


const tmplParser = new _ng.TemplateParser(expParser, elementSchemaRegistry, htmlParser, console, []);


const metadata = new CompileDirectiveMetadata();
metadata.viewProviders = [];
metadata.type = new CompileTypeMetadata();
const ast = tmplParser.parse(metadata, "hello {{name || last}}<span>test</span>", [], [], [], "");

console.log(ast);

export const angular2ExtensionDependency = [

];
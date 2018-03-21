"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var vscode_uri_1 = require("vscode-uri");
function findComponents(service, fileFsPath) {
    var program = service.getProgram();
    var sourceFile = program.getSourceFile(fileFsPath);
    var exportStmt = sourceFile.statements.filter(function (st) { return st.kind === ts.SyntaxKind.ExportAssignment; });
    if (exportStmt.length === 0) {
        return [];
    }
    var exportExpr = exportStmt[0].expression;
    var comp = getComponentFromExport(exportExpr);
    if (!comp) {
        return [];
    }
    var checker = program.getTypeChecker();
    var compType = checker.getTypeAtLocation(comp);
    var childComps = getPropertyTypeOfType(compType, 'components', checker);
    if (!childComps) {
        return [];
    }
    return checker.getPropertiesOfType(childComps).map(function (s) { return getCompInfo(s, checker); });
}
exports.findComponents = findComponents;
function getComponentFromExport(exportExpr) {
    switch (exportExpr.kind) {
        case ts.SyntaxKind.CallExpression:
            // Vue.extend or synthetic __pcEditorBridge
            return exportExpr.arguments[0];
        case ts.SyntaxKind.ObjectLiteralExpression:
            return exportExpr;
    }
    return undefined;
}
// Vue.extend will return a type without `props`. We need to find the object literal
function findDefinitionLiteralSymbol(symbol, checker) {
    var node = symbol.valueDeclaration;
    if (!node) {
        return undefined;
    }
    if (node.kind === ts.SyntaxKind.PropertyAssignment) {
        // {comp: importedComponent}
        symbol = checker.getSymbolAtLocation(node.initializer) || symbol;
    }
    else if (node.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
        // {comp}
        symbol = checker.getShorthandAssignmentValueSymbol(node) || symbol;
    }
    if (symbol.flags & ts.SymbolFlags.Alias) {
        // resolve import Comp from './comp.vue'
        symbol = checker.getAliasedSymbol(symbol);
    }
    return symbol;
}
function getCompInfo(symbol, checker) {
    var info = {
        name: hyphenate(symbol.name)
    };
    var literalSymbol = findDefinitionLiteralSymbol(symbol, checker);
    if (!literalSymbol) {
        return info;
    }
    var declaration = literalSymbol.valueDeclaration;
    if (!declaration) {
        return info;
    }
    info.definition = [
        {
            uri: vscode_uri_1.default.file(declaration.getSourceFile().fileName).toString(),
            range: vscode_languageserver_types_1.Range.create(0, 0, 0, 0)
        }
    ];
    var node = declaration;
    if (declaration.kind === ts.SyntaxKind.ExportAssignment) {
        var expr = declaration.expression;
        node = getComponentFromExport(expr) || declaration;
    }
    var compType = checker.getTypeAtLocation(node);
    var arrayProps = getArrayProps(compType, checker);
    if (arrayProps) {
        info.props = arrayProps;
        return info;
    }
    var props = getPropertyTypeOfType(compType, 'props', checker);
    if (!props) {
        return info;
    }
    info.props = checker.getPropertiesOfType(props).map(function (s) {
        return {
            name: hyphenate(s.name),
            doc: getPropTypeDeclaration(s, checker)
        };
    });
    return info;
}
function getPropTypeDeclaration(prop, checker) {
    if (!prop.valueDeclaration) {
        return '';
    }
    var declaration = prop.valueDeclaration.getChildAt(2);
    if (!declaration) {
        return '';
    }
    if (declaration.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        var text_1 = [];
        declaration.forEachChild(function (n) {
            text_1.push(n.getText());
        });
        return text_1.join('\n');
    }
    return declaration.getText();
}
function getArrayProps(compType, checker) {
    var propSymbol = checker.getPropertyOfType(compType, 'props');
    if (!propSymbol || !propSymbol.valueDeclaration) {
        return undefined;
    }
    var propDef = propSymbol.valueDeclaration.getChildAt(2);
    if (!propDef || propDef.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return undefined;
    }
    var propArray = propDef;
    return propArray.elements
        .filter(function (e) { return e.kind === ts.SyntaxKind.StringLiteral; })
        .map(function (e) { return ({ name: hyphenate(e.text) }); });
}
function getPropertyTypeOfType(tpe, property, checker) {
    var propSymbol = checker.getPropertyOfType(tpe, property);
    return getSymbolType(propSymbol, checker);
}
function getSymbolType(symbol, checker) {
    if (!symbol || !symbol.valueDeclaration) {
        return undefined;
    }
    return checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
}
var hyphenateRE = /\B([A-Z])/g;
function hyphenate(word) {
    return word.replace(hyphenateRE, '-$1').toLowerCase();
}
//# sourceMappingURL=findComponents.js.map
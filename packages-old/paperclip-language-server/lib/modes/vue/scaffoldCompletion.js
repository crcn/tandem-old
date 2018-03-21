"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
function doScaffoldComplete() {
    var topLevelCompletions = [
        {
            label: 'scaffold',
            documentation: 'Scaffold <template>, <script> and <style>',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<template>\n  ${0}\n</template>\n\n<script>\nexport default {\n\n}\n</script>\n\n<style>\n\n</style>\n"
        },
        {
            label: 'template with html',
            documentation: 'Scaffold <template> with html',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<template>\n  ${0}\n</template>\n"
        },
        {
            label: 'template with pug',
            documentation: 'Scaffold <template> with pug',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<template lang=\"pug\">\n  ${0}\n</template>\n"
        },
        {
            label: 'script with JavaScript',
            documentation: 'Scaffold <script> with JavaScript',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<script>\nexport default {\n  ${0}\n}\n</script>\n"
        },
        {
            label: 'script with TypeScript',
            documentation: 'Scaffold <script> with TypeScript',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<script lang=\"ts\">\nexport default {\n  ${0}\n}\n</script>\n"
        },
        {
            label: 'style with CSS',
            documentation: 'Scaffold <style> with CSS',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style>\n${0}\n</style>\n"
        },
        {
            label: 'style with CSS (scoped)',
            documentation: 'Scaffold <style> with CSS (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style scoped>\n${0}\n</style>\n"
        },
        {
            label: 'style with scss',
            documentation: 'Scaffold <style> with scss',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"scss\">\n${0}\n</style>\n"
        },
        {
            label: 'style with scss (scoped)',
            documentation: 'Scaffold <style> with scss (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"scss\" scoped>\n${0}\n</style>\n"
        },
        {
            label: 'style with less',
            documentation: 'Scaffold <style> with less',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"less\">\n${0}\n</style>\n"
        },
        {
            label: 'style with less (scoped)',
            documentation: 'Scaffold <style> with less (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"less\" scoped>\n${0}\n</style>\n"
        },
        {
            label: 'style with sass',
            documentation: 'Scaffold <style> with sass',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"sass\">\n${0}\n</style>\n"
        },
        {
            label: 'style with sass (scoped)',
            documentation: 'Scaffold <style> with sass (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"sass\" scoped>\n${0}\n</style>\n"
        },
        {
            label: 'style with postcss',
            documentation: 'Scaffold <style> with postcss',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"postcss\">\n${0}\n</style>\n"
        },
        {
            label: 'style with postcss (scoped)',
            documentation: 'Scaffold <style> with postcss (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"postcss\" scoped>\n${0}\n</style>\n"
        },
        {
            label: 'style with stylus',
            documentation: 'Scaffold <style> with stylus',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"stylus\">\n${0}\n</style>\n"
        },
        {
            label: 'style with stylus (scoped)',
            documentation: 'Scaffold <style> with stylus (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: "<style lang=\"stylus\" scoped>\n${0}\n</style>\n"
        }
    ];
    return {
        isIncomplete: false,
        items: topLevelCompletions
    };
}
exports.doScaffoldComplete = doScaffoldComplete;
//# sourceMappingURL=scaffoldCompletion.js.map
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Sasa Jovanovic. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const sassConvertService_1 = require("./sassConvertService");
const sassFormatterEditProvider_1 = require("./sassFormatterEditProvider");
// const sassSelector: DocumentSelector = ["scss", "sass", "css"];
const sassSelector = [
    { scheme: "file", language: "scss" },
    { scheme: "file", language: "sass" },
    { scheme: "file", language: "css" }
];
/** Extension Activate */
function activate(context) {
    const outputChannel = vscode_1.window.createOutputChannel("Sass Formatter");
    const sassConvert = new sassConvertService_1.SassConvertService(outputChannel);
    const sassFormatEditProvider = new sassFormatterEditProvider_1.SassFormatterEditProvider(outputChannel, sassConvert);
    const disposables = [
        vscode_1.languages.registerDocumentFormattingEditProvider(sassSelector, sassFormatEditProvider),
        vscode_1.languages.registerDocumentRangeFormattingEditProvider(sassSelector, sassFormatEditProvider),
        outputChannel
    ];
    vscode_1.workspace.onDidChangeConfiguration(sassConvert.setSassConvertCommand);
    context.subscriptions.push(...disposables);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
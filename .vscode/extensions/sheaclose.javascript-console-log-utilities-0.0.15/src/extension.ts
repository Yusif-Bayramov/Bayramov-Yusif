import * as vscode from 'vscode';
import * as _ from 'lodash';
import { Selection, TextEditor, TextEditorEdit } from 'vscode';
import { Config } from './types';
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.insertLogStatement', () =>
      executeInsertLogStatement('log')
    ),
    vscode.commands.registerCommand('extension.insertInfoStatement', () =>
      executeInsertLogStatement('info')
    ),
    vscode.commands.registerCommand('extension.insertWarnStatement', () =>
      executeInsertLogStatement('warn')
    ),
    vscode.commands.registerCommand('extension.insertErrorStatement', () =>
      executeInsertLogStatement('error')
    ),
    vscode.commands.registerCommand(
      'extension.deleteAllLogStatements',
      executeDeleteAllLogStatements
    )
  );
}

export function deactivate() {}

/* Helper Functions */
function cursorPlacement() {
  // release the selection caused by inserting
  vscode.commands.executeCommand('cursorMove', {
    to: 'right',
    by: 'line',
    value: 1
  });
  // position the cursor inside the parenthesis
  vscode.commands.executeCommand('cursorMove', {
    to: 'left',
    by: 'line',
    value: 1
  });
}

function getAllLogStatements(document: any, documentText: any) {
  const logStatements = [];
  const logRegex = /console.(log|debug|info|warn|error|assert|dir|dirxml|trace|group|groupEnd|time|timeEnd|profile|profileEnd|count)\((.*)\);?/g;
  let match;
  while ((match = logRegex.exec(documentText))) {
    const matchRange = new vscode.Range(
      document.positionAt(match.index),
      document.positionAt(match.index + match[0].length)
    );
    if (!matchRange.isEmpty) {
      logStatements.push(matchRange);
    }
  }
  return logStatements;
}

function deleteFoundLogStatements(workspaceEdit: any, docUri: any, logs: any) {
  logs.forEach((log: any) => {
    workspaceEdit.delete(docUri, log);
  });

  vscode.workspace.applyEdit(workspaceEdit).then(() => {
    logs.length > 1
      ? vscode.window.showInformationMessage(`${logs.length} console.logs deleted`)
      : vscode.window.showInformationMessage(`${logs.length} console.log deleted`);
  });
}

function insertText(selection: Selection, val: string, resolve: any = Promise.resolve) {
  const activeTextEditor = _.get(vscode, 'window.activeTextEditor');
  if (!activeTextEditor) {
    vscode.window.showErrorMessage("Can't insert log because no document is open");
    return;
  }
  const range = new vscode.Range(selection.start, selection.end);
  return activeTextEditor
    .edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(range, val);
    })
    .then(() => resolve());
}

function executeInsertLogStatement(logType: string) {
  console.log('logType: ', logType);
  const activeTextEditor = _.get(vscode, 'window.activeTextEditor');
  if (!activeTextEditor) {
    return;
  }
  const selections = activeTextEditor.selections;
  const text = activeTextEditor.selections.map((sel: Selection) =>
    activeTextEditor.document.getText(sel)
  );
  invokeInsertBasedOnSelectionAndDestination(
    getPositionAndDestinationConfig(text, logType),
    activeTextEditor,
    logType
  );
}

function executeDeleteAllLogStatements() {
  const activeTextEditor = _.get(vscode, 'window.activeTextEditor');
  if (!activeTextEditor) {
    return;
  }

  const document = activeTextEditor.document;
  const documentText = activeTextEditor.document.getText();

  const workspaceEdit = new vscode.WorkspaceEdit();

  const logStatements = getAllLogStatements(document, documentText);

  deleteFoundLogStatements(workspaceEdit, document.uri, logStatements);
}

function getPositionAndDestinationConfig(text: string[], logType: string): Config {
  const textSelections = text.filter((c: string) => !!c);
  const hasAtLeastOneSelection = !!textSelections.length;
  const hasDestinationForLog = !text.slice().pop() && hasAtLeastOneSelection;
  const areEmptyInserts = !hasAtLeastOneSelection;
  const emptyInsertTemplate = `console.${logType}(${''})`;
  return {
    hasAtLeastOneSelection,
    hasDestinationForLog,
    areEmptyInserts,
    emptyInsertTemplate,
    text
  };
}

function invokeInsertBasedOnSelectionAndDestination(
  config: Config,
  activeTextEditor: TextEditor,
  logType: string
) {
  const {
    text,
    hasAtLeastOneSelection,
    hasDestinationForLog,
    areEmptyInserts,
    emptyInsertTemplate
  } = config;
  // Determine selection type, and destination type.
  // ex1: single || multi selection, no destination;
  if (hasAtLeastOneSelection && !hasDestinationForLog) {
    vscode.commands
      .executeCommand('editor.action.insertLineAfter')
      .then(() => {
        text.reduce((acc: Promise<any>, _text: string, index: number) => {
          return acc.then(res => {
            return new Promise(resolve => {
              const logToInsert = `console.${logType}('${_text}: ', ${_text})`;
              insertText(activeTextEditor.selections[index], logToInsert, resolve);
            });
          });
        }, Promise.resolve());
      })
      .then(() => cursorPlacement());
    return;
  }
  // ex2: single || multi selection, w/ destination;
  if (hasAtLeastOneSelection && hasDestinationForLog) {
    const textToInsert = text.reduce((acc: string, cur: string) => {
      return `${acc ? acc + (cur ? ',' : '') : ''} ${cur}`;
    }, '');
    let placeholder =
      textToInsert.split(',').length > 1
        ? `{${textToInsert}}`
        : `"${textToInsert.trim()}: ", ${textToInsert}`;
    const logToInsert = `console.${logType}(${placeholder})`;
    new Promise(resolve => {
      insertText(
        activeTextEditor.selections[activeTextEditor.selections.length - 1],
        logToInsert,
        resolve
      );
    }).then(() => cursorPlacement());
    return;
  }
  // ex3: single || multi empty insert;
  if (areEmptyInserts && text.length > 0) {
    activeTextEditor.selections
      .reduce((acc: Promise<any>, cur: Selection, index: number) => {
        return acc.then(
          res => new Promise(resolve => insertText(cur, emptyInsertTemplate, resolve))
        );
      }, Promise.resolve())
      .then(() => cursorPlacement());
    return;
  }
  cursorPlacement();
}

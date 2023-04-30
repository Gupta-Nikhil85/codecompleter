// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
require ('dotenv').config();
import * as vscode from 'vscode';
import { getCommentedCode } from './services/openai.service';
import { LOGGER } from './common/logger';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (LOGGER.info) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	LOGGER.info('Congratulations, your extension "codecompleter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('codecompleter.commentCode', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		//getting the document text
			const textEditorContext = vscode.window.activeTextEditor;
			if (textEditorContext !== undefined){
				const code = textEditorContext.document.getText();
				const codingLanguage = textEditorContext.document.languageId;
				if(Boolean(code)){
					vscode.window.showInformationMessage('Generating Comments For Your Code.!');
					getCommentedCode(code)
					.then((res) => {
						if(res.success){
							LOGGER.info(res);
							res.data.forEach(async (element: any) => {
								LOGGER.info(element);
								const rightDoc = await vscode.workspace.openTextDocument({content:element.text, language:codingLanguage});
								vscode.window.showTextDocument(rightDoc, 2, false);
							});
						}
						else {
							vscode.window.showErrorMessage(res.message);
						}
					}
					).catch((err) => {
						vscode.window.showErrorMessage(err);
						LOGGER.info(err);
					});
				}
				else{
					vscode.window.showErrorMessage('Please add some code to the file.');
				}
			}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

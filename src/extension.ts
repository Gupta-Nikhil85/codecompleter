// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getCommentedCode } from './services/openai.service';
import { LOGGER } from './common/logger';
import AuthSettings from './services/storage.service';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (LOGGER.info) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	LOGGER.info('Congratulations, your extension "codecompleter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	
	// This code registers a command to update the OpenAI API key.
	let updateApiKey = vscode.commands.registerCommand('codeCompleter.updateApiKey', async () => {
		// It prompts the user to enter the API key.
		const inputBox = await vscode.window.showInputBox({
			placeHolder: "Enter OpenAi Api Key",
			prompt:"Enter your OpenAi Api key."
		});
		// If the user does not enter a valid API key, an error message is displayed.
		if(inputBox === "" ||  inputBox === undefined){
			vscode.window.showErrorMessage("Please provide a valid OpenAI Api key to use extension.");
			LOGGER.info(inputBox);
		}
		// Otherwise, stores it in the AuthSettings instance and success message is displayed.
		else{
			AuthSettings.init(context);
			const settings = AuthSettings.instance;
			await settings.storeAuthData('OPENAI_API_KEY', inputBox);
			vscode.window.showInformationMessage("Successfully updated the api key.");
		}
	});

	
	let disposable = vscode.commands.registerCommand('codecompleter.commentCode', () => {
		//getting the document text
			const textEditorContext = vscode.window.activeTextEditor;
			if (textEditorContext !== undefined){
				const code = textEditorContext.document.getText();
				const codingLanguage = textEditorContext.document.languageId;
				if(Boolean(code)){
					vscode.window.showInformationMessage('Generating Comments For Your Code.!');
					getCommentedCode(code,context)
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
	context.subscriptions.push(updateApiKey);
}

// This method is called when your extension is deactivated
export function deactivate() {}

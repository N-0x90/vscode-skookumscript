import * as vscode from 'vscode';
import { SkRepl } from './skRepl';
      
export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('sk');
    let connectTypeConfig = config.get('connectType') as string;
    let hostConfig = config.get('serverHost') as string;
    let portConfig = config.get('serverPort') as string;
    let connectType = connectTypeConfig ? connectTypeConfig.toString() : '';
    let host = hostConfig ? hostConfig.toString() : '';
    let port = portConfig ? parseInt(portConfig.toString()) : 0;
      
    let skRepl = new SkRepl();
    skRepl.start(connectType, host, port);
      
    let outputChannel = vscode.window.createOutputChannel('SkookumScript');
      
    skRepl.on('onInfoMessage', (msg : string) => {
        vscode.window.showInformationMessage('SK: ' + msg);
    });
    
    skRepl.on('onReplMessage', (data : string) => {
        outputChannel.append('SK(REPL)> ');
        let lines = data.toString().split('\n');
        // let counter = 0;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            outputChannel.appendLine(line);
            // counter++;
        }
    });
      
    const getCode = () => {
        let textEditor = vscode.window.activeTextEditor;
        if (!textEditor) {
            return "";
        }
        let selection = textEditor.selection;
        let text = textEditor.document.getText(selection);
        if (textEditor.selection.start.line ===
                textEditor.selection.end.line &&
            textEditor.selection.start.character ===
                        textEditor.selection.end.character) {
            text =
         textEditor.document.lineAt(textEditor.selection.start.line).text;
        }
        return text;
    };
      
    let disposable =
         vscode.commands.registerCommand('extension.sk.repl', () => {
        let code = getCode();
        if (code === '') {
            return;
        }
        skRepl.sendToServer('repl', code);
    });
    context.subscriptions.push(disposable);
}

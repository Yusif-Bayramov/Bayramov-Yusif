# javascript-console-log-utilities

This is an extension of the vscode-js-console-utils by [@whtouche](https://twitter.com/whtouche)
For the original extension go to the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=whtouche.vscode-js-console-utils)

# Installing

This extension is available for free in the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sheaclose.javascript-console-log-utilities)

# Usage

To insert a console method chose any of the following commands (Note: The actions below are available in all log types ):

### console.log:

Windows: Shift + Win + L  
Mac: Shift + Cmd + L

### console.info:

Windows: Shift + Win + Alt + L  
Mac: Shift + Cmd + Alt + L

### console.warn:

Windows: ctrl + Shift + Win + L  
Mac: ctrl + Shift + Cmd + L

### console.error:

Windows: ctrl + Alt + Win + L  
Mac: ctrl + Alt + Cmd + L

## With selection:

![](https://javascript-console-log-utilities.s3.amazonaws.com/basic-log.gif)

- Highlight a variable (or really any text)
- execute insert log command of your choice.
- The output (on a new line) will be: console.log('variable: ', variable);

## With multiple selections:

![](https://javascript-console-log-utilities.s3.amazonaws.com/multiple-logs.gif)

- Highlight multiple variables
- execute insert log command of your choice.
- The output (below each selection) will be: console.log('variable: ', variable);

## With selection and secondary cursor:

![](https://javascript-console-log-utilities.s3.amazonaws.com/Secondary-location-log.gif)

- Highlight variable and a destination (via ctrl + click)
- execute insert log command of your choice.
- The output will be placed at the secondary location.

## With multi-selection and secondary cursor:

![](https://javascript-console-log-utilities.s3.amazonaws.com/multi-with-dest.gif)

- Highlight variables and a destination (via ctrl + click)
- execute insert log command of your choice.
- The output will be placed at the secondary location with the variables contained within an object.

## Without selection:

![](https://javascript-console-log-utilities.s3.amazonaws.com/empty-console-log.gif)

- Without highlighting any values select one or many locations to insert a console.log.
- execute insert log command of your choice.
- The output (on the same line) will be: console.log();

## To remove console.logs:

![](https://javascript-console-log-utilities.s3.amazonaws.com/Delete-all-logs.gif)

- Press Cmd+Shift+D
- This will delete all console.log statements in the current document

# License

[MIT License](https://github.com/whtouche/vscode-js-console-utils/blob/master/LICENSE)

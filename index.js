#!/usr/bin/env node
import { Command } from "commander";
import clipboardy from "clipboardy";
import keypress from "keypress";
import chalk from "chalk";
import clear from "console-clear";

const codeMatches = [];
const modes = {
  wttg1: /[1-8] - [a-z0-9]{4}/gi,
  wttg2: /[1-8] - [a-z0-9]{12}/gi,
};

const program = new Command();

program.version("1.0.0");

program
  .command("listen")
  .description("Listen to clipboard and perform action on certain condition")
  .option(
    "-c, --condition <condition>",
    `Specify the condition to trigger the action (Default: WTTG2)
    0: WTTG1
    1: WTTG2`
  )
  .action(async (options) => {
    console.log(chalk.whiteBright.bold("Listening to the clipboard..."));
    keypress(process.stdin);
    let condition;
    switch (parseInt(options.condition) || 1) {
      case 0:
        condition = modes.wttg1;
        break;
      case 1:
        condition = modes.wttg2;
        break;

      default:
        break;
    }
    let oldClipboardContent = "";

    setInterval(async () => {
      const clipboardContent = await clipboardy.read();
      if (clipboardContent != oldClipboardContent) {
        clear();
        // 8 - c417B177a356
        // 1 - prjejgrtlof4 , 2 - max3h2l023wr , 3 - xhayow1o1zys , 4 - zdi3ej8b7ui9 , 5 - 4qq2jew46ju6 , 6 - 51inim4copdv , 7 - 13pg86pgwmto , 8 - 2m1m3fyjr2ud
        // 13pg86pgwmto2m1m3fyjr2ud4qq2jew46ju651inim4copdvmax3h2l023wrprjejgrtlof4xhayow1o1zyszdi3ej8b7ui9
        const matches = [
          ...clipboardContent.matchAll(/[1-8] - [a-z0-9]{12}/gi),
        ];
        // console.log(matches);
        // matches.length > 0 ? console.log("Found a match!") : null;
        // TODO: Borrar array al encontrar una key con el mismo indice?
        // TODO: CTRL + num cambia el valor de wiki a ese numero. Probablemente useless ya que los keybinds no son globales
        matches.forEach((element) => {
          if (!codeMatches.includes(element[0])) {
            codeMatches.forEach((e, index) => {
              if (e[0] == element[0][0]) {
                codeMatches.splice(index, 1);
              }
            });
            codeMatches.push(element[0]);
          }
        });
        console.log(chalk.redBright.bold("----------------------"));
        console.log(chalk.green.bold(" These are your keys:"));
        console.log(chalk.redBright.bold("----------------------"));
        if (codeMatches.length > 0) {
          codeMatches.sort().forEach((e) => {
            console.log(
              chalk.cyan.underline(`Key ${e[0]} : ${e.substring(4)}`)
            );
          });
        } else {
          console.log(chalk.red.bold("No Keys"));
        }
      }

      if (codeMatches.length === 8) {
        const compiledKey = codeMatches
          .map((e) => e.substring(4))
          .sort()
          .join("");
        await clipboardy.write(compiledKey);
        console.log(
          `You've collected all your keys. Here is your compiled key: ${compiledKey}`
        );
        process.stdin.pause();
        process.exit();
      }
      oldClipboardContent = clipboardContent;
    }, 1000);

    process.stdin.on("keypress", (ch, key) => {
      if (key && key.name === "r" && codeMatches.length > 0) {
        console.log(chalk.whiteBright.bold("Clearing keys..."));
        codeMatches.splice(0, codeMatches.length);
        clipboardy.writeSync("");
      }

      if (key && key.ctrl && key.name === "c") {
        console.log(chalk.whiteBright.bold("Closing program..."));
        process.stdin.pause();
        process.exit();
      }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
  });

program.parse(process.argv);

#!/usr/bin/env node
import { Command } from "commander";
import clipboardy from "clipboardy";
import keypress from "keypress";
import chalk from "chalk";
import clear from "console-clear";
import sound from "sound-play";
import path from "path";

import { GlobalKeyboardListener } from "node-global-key-listener";
const v = new GlobalKeyboardListener();

const codeMatches = [];
const modes = {
  wttg1: /[1-8] - [a-z0-9]{4}/gi,
  wttg2: /[1-8] - [a-z0-9]{12}/gi,
};
const currentWiki = 1;

v.addListener(function (e, down) {
  if (
    e.state == "DOWN" &&
    e.name == "R" &&
    (down["LEFT CTRL"] || down["RIGHT CTRL"])
  ) {
    console.log(chalk.bgRedBright.whiteBright("Reseting keys..."));
    codeMatches.splice(0, codeMatches.length);
    clipboardy.writeSync("");
  }

  if (
    e.state == "DOWN" &&
    (e.name == "1" || e.name == "2" || e.name == "3") &&
    (down["LEFT CTRL"] || down["RIGHT CTRL"])
  ) {
    currentWiki = parseInt(e.name);
  }
});

const program = new Command();

program.version("1.1.1");

program
  .description("Listen to clipboard and perform action on certain condition")
  .option(
    "-w1, --wttg1",
    "Specify if you want to use the pattern for Welcome to the Game 1"
  )
  .action(async (opts) => {
    console.log(opts.wttg1);
    console.log(chalk.whiteBright.bold("Listening to the clipboard..."));
    keypress(process.stdin);
    let condition;
    if (opts.wttg1) {
      condition = modes.wttg1;
    } else {
      condition = modes.wttg2;
    }
    let oldClipboardContent = "";

    setInterval(async () => {
      const clipboardContent = await clipboardy.read();
      if (clipboardContent != oldClipboardContent) {
        clear();
        // 8 - c417B177a356
        // 1 - prjejgrtlof4 , 2 - max3h2l023wr , 3 - xhayow1o1zys , 4 - zdi3ej8b7ui9 , 5 - 4qq2jew46ju6 , 6 - 51inim4copdv , 7 - 13pg86pgwmto , 8 - 2m1m3fyjr2ud
        // 13pg86pgwmto2m1m3fyjr2ud4qq2jew46ju651inim4copdvmax3h2l023wrprjejgrtlof4xhayow1o1zyszdi3ej8b7ui9
        const matches = [...clipboardContent.matchAll(condition)];
        // matches.length > 0 ? console.log("Found a match!") : null;
        // TODO: Refactorizar el codigo, principalmente mover el intervalo a un nuevo archivo
        // TODO: Agregar a los patrones espacios antes y despues de la key?
        // TODO: CTRL + num cambia el valor de wiki a ese numero.
        // TODO: Migrar a TypeScript
        matches.forEach((element) => {
          const scriptDir = path.dirname(new URL(import.meta.url).pathname);
          sound.play(path.join(scriptDir, "/CatMeow2.mp3").substring(1));
          if (!codeMatches.includes(element[0])) {
            codeMatches.forEach((e, index) => {
              if (e[0] == element[0][0]) {
                codeMatches.splice(index, 1);
              }
            });
            clipboardy.writeSync(element[0].substring(4));
            codeMatches.push(element[0]);
          }
        });
        console.log(
          chalk.redBright.bold("CURRENT WIKI: " + currentWiki + "\n") +
            chalk.redBright.bold("----------------------\n") +
            chalk.green.bold(" These are your keys:\n") +
            chalk.redBright.bold("----------------------")
        );
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
          .sort()
          .map((e) => e.substring(4))
          .join("");
        await clipboardy.write(compiledKey);
        console.log(
          `\n${chalk.greenBright(
            "You've collected all your keys. Here is your compiled key:"
          )} \n${chalk.bgWhite.black.bold(compiledKey)}`
        );
        process.stdin.pause();
        process.exit();
      }
      oldClipboardContent = clipboardContent;
    }, 1000);

    process.stdin.on("keypress", (ch, key) => {
      if (key && key.name === "r" && codeMatches.length > 0) {
        console.log(chalk.whiteBright.bold("Clearing keys..."));
        currentWiki = 1;
        codeMatches.splice(0, codeMatches.length);
        clipboardy.writeSync("");
      }

      if (key && key.ctrl && key.name === "c") {
        console.log(chalk.whiteBright.bold("Closing program..."));
        process.stdin.pause();
        process.exit();
      }
    });

    // process.stdin.setRawMode(true);
    // process.stdin.resume();
  });

program.parse(process.argv);

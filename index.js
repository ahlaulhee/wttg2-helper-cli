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

// TODO: Avisar de wiki en clipboard
// TODO: Refactorizar el codigo, principalmente mover el intervalo a un .js
// TODO: Agregar a los patrones espacios antes y despues de la key para mas certeza?
// TODO: Migrar a TypeScript

// http://47e3ca7af4507b0388effe60c38a452a.ann

// 8 - c417B177a356
// 1 - prjejgrtlof4 , 2 - max3h2l023wr , 3 - xhayow1o1zys , 4 - zdi3ej8b7ui9 , 5 - 4qq2jew46ju6 , 6 - 51inim4copdv , 7 - 13pg86pgwmto , 8 - 2m1m3fyjr2ud
// 13pg86pgwmto2m1m3fyjr2ud4qq2jew46ju651inim4copdvmax3h2l023wrprjejgrtlof4xhayow1o1zyszdi3ej8b7ui9

const hexColorTable = [
  { hex: "#e06c75", refName: "brightRed" },
  { hex: "#61afef", refName: "brightBlue" },
  { hex: "#e5c07b", refName: "brightYellow" },
  { hex: "#7560d3", refName: "brightPurple" },
  { hex: "#56b6c2", refName: "brightCyan" },
  { hex: "#98c379", refName: "brightGreen" },
  { hex: "#d19a66", refName: "brightOrange" },
  { hex: "#d4d4d4", reName: "white" },
];
const codeMatches = [];
const modes = {
  wttg1: /[1-8] - [a-z0-9]{4}/gi,
  wttg2: /[1-8] - [a-z0-9]{12}/gi,
};
let currentWiki = 1;
const wikiPattern = /http:\/\/[a-z0-9]{32}\.ann/gi;

v.addListener(function (e, down) {
  if (
    e.state == "DOWN" &&
    e.name == "R" &&
    (down["LEFT CTRL"] || down["RIGHT CTRL"])
  ) {
    console.log(
      chalk.bgHex(hexColorTable[0].hex).hex(hexColorTable[7].hex)(
        "Reseting keys..."
      )
    );
    currentWiki = 1;
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

program.version("1.2.2");

program
  .description("WTTG2 Helper CLI")
  .option(
    "-w1, --wttg1",
    "Specify if you want to use the pattern for Welcome to the Game 1"
  )
  .action(async (opts) => {
    console.log(
      chalk.hex(hexColorTable[7].hex).bold("Listening to the clipboard...")
    );
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
        const keyMatches = [...clipboardContent.matchAll(condition)];
        const wikiMatches = [...clipboardContent.matchAll(wikiPattern)];
        const scriptDir = path.dirname(new URL(import.meta.url).pathname);

        if (wikiMatches[0] != clipboardContent) {
          wikiMatches.forEach((element) => {
            sound.play(path.join(scriptDir, "/duck.mp3").substring(1));
            clipboardy.writeSync(element[0]);
          });
        }

        keyMatches.forEach((element) => {
          codeMatches.map((e) => (e.newKey = false));
          sound.play(path.join(scriptDir, "/CatMeow2.mp3").substring(1));
          if (
            codeMatches.find((c) => (c.key == element[0]) === undefined)
              ? false
              : true
          ) {
            codeMatches.forEach((e, index) => {
              if (e.key[0] == element[0][0]) {
                codeMatches.splice(index, 1);
              }
            });
            clipboardy.writeSync(element[0].substring(4));
            codeMatches.push({
              key: element[0],
              wiki: currentWiki,
              newKey: true,
            });
          }
        });
        console.log(
          // chalk.redBright.bold("CURRENT WIKI: " + currentWiki + "\n") +
          chalk.hex(hexColorTable[0].hex).bold("----------------------\n") +
            chalk.hex(hexColorTable[5].hex).bold(" These are your keys:\n") +
            chalk.hex(hexColorTable[0].hex).bold("----------------------")
        );
        if (codeMatches.length > 0) {
          codeMatches
            .sort((a, b) => parseInt(a.key[0]) - parseInt(b.key[0]))
            .forEach((e) => {
              console.log(
                chalk
                  .hex(hexColorTable[e.wiki].hex)
                  .bold(
                    `${e.newKey ? ">" : ""} Key ${e.key[0]} : ${e.key.substring(
                      4
                    )} - ${e.wiki} ${e.newKey ? "<" : ""}`
                  )
              );
            });
        } else {
          console.log(chalk.hex(hexColorTable[0].hex).bold("No Keys"));
        }
      }

      if (codeMatches.length === 8) {
        const compiledKey = codeMatches
          .sort((a, b) => parseInt(a.key[0]) - parseInt(b.key[0]))
          .map((e) => e.key.substring(4))
          .join("");
        await clipboardy.write(compiledKey);
        console.log(
          `\n${chalk.hex(hexColorTable[5].hex)(
            "You've collected all your keys. Here is your compiled key:"
          )} \n${chalk.bgHex(hexColorTable[7].hex).black.bold(compiledKey)}`
        );
        process.stdin.pause();
        process.exit();
      }
      oldClipboardContent = clipboardContent;
    }, 500);

    process.stdin.on("keypress", (ch, key) => {
      if (key && key.ctrl && key.name === "c") {
        console.log(chalk.hex(hexColorTable[7].hex).bold("Closing program..."));
        process.stdin.pause();
        process.exit();
      }
    });
  });

program.parse(process.argv);

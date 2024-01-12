#!/usr/bin/env node
// NPM Libraries
import { Command } from "commander";
import clipboardListener from "clipboard-event";
import clipboardy from "clipboardy";
import readline from "readline";
import clear from "console-clear";
import sound from "sound-play";
import path from "path";

import { GlobalKeyboardListener } from "node-global-key-listener";
const keyboardListener = new GlobalKeyboardListener();
keyboardListener.addListener(handleKeyPress);

// Own variables
import {
  hexColorTable,
  wttg1KeyPattern,
  wttg2KeyPattern,
  wikiPattern,
} from "./config.js";
import { Key, Wiki } from "./type.js";
import { compileKeys, log } from "./helpers.js";

let currentWiki: number = 1;
let keysFound: Key[] = [];
let wikisFound: Wiki[] = [];

const program = new Command();
program.version("2.1.0");
program
  .description(
    "WTTG2 Helper CLI allows to keep track of your keys and 2nd wiki, it also helps you find these with ease."
  )
  .option(
    "-w1, --wttg1",
    "Track keys on WTTG1, which has a different key format compared to WTTG2"
  )
  .action(runProgram);

program.parse(process.argv);

async function runProgram(opts: { wttg1: boolean }): Promise<void> {
  clear();
  const keyPattern: RegExp = opts.wttg1 ? wttg1KeyPattern : wttg2KeyPattern;
  startInterval(keyPattern);
  setTimeout(() => {
    clipboardy.write((Math.random() + 1).toString(36).substring(2));
  }, 100);
}

function handleKeyPress(e: any, down: any): void {
  if (e.state == "DOWN" && e.name == "R" && down["LEFT CTRL"]) {
    log("Reseting keys...", hexColorTable[7].hex, hexColorTable[0].hex);
    currentWiki = 1;
    keysFound = [];
    wikisFound = [];
    clipboardy.writeSync("");
  }

  if (
    e.state == "DOWN" &&
    ["1", "2", "3"].includes(e.name) &&
    down["LEFT CTRL"]
  ) {
    currentWiki = parseInt(e.name);
  }
}

function startInterval(condition: RegExp): void {
  clipboardListener.startListening();
  let previousClipboardText: string = "";
  clipboardListener.on("change", async () => {
    const currentClipboardText = await clipboardy.read();
    if (currentClipboardText != previousClipboardText) {
      clear();
      const keyMatches: RegExpMatchArray[] = [
        ...currentClipboardText.matchAll(condition),
      ];
      const wikiMatches: RegExpMatchArray[] = [
        ...currentClipboardText.matchAll(wikiPattern),
      ];
      const soundsDir = path
        .join(path.dirname(new URL(import.meta.url).pathname), "..", "/sounds")
        .substring(1);

      if (
        wikiMatches.length > 0 &&
        wikiMatches[0][0] != currentClipboardText &&
        wikisFound.findIndex((w) => w.wiki === wikiMatches[0][0]) === -1
      ) {
        wikisFound.map((w) => (w.isNew = false));
        sound.play(path.join(soundsDir, "/duck.mp3"));
        clipboardy.write(wikiMatches[0][0]);
        wikisFound.push({ wiki: wikiMatches[0][0], isNew: true });
      }
      if (keyMatches.length > 0) {
        keysFound.map((k) => (k.isNew = false));
        sound.play(path.join(soundsDir, "/cat.mp3"));
      }

      keyMatches.forEach((keyFound: RegExpMatchArray) => {
        const existingKeyIndex = keysFound.findIndex(
          (k) => k.key === keyFound[0]
        );
        existingKeyIndex !== -1 ? keysFound.splice(existingKeyIndex, 1) : null;
        clipboardy.writeSync(keyFound[0].substring(4));
        keysFound.push({
          key: keyFound[0],
          wiki: currentWiki,
          isNew: true,
        });
      });

      log("-".repeat(47), hexColorTable[0].hex);
      log(
        `${" ".repeat(13)}These are your keys:${" ".repeat(13)}`,
        hexColorTable[5].hex
      );
      log("-".repeat(47), hexColorTable[0].hex);

      keysFound.length > 0
        ? keysFound
            .sort((a, b) => a.key.localeCompare(b.key))
            .forEach((k) =>
              log(
                `${k.isNew ? ">" : ""} Key ${k.key[0]} : ${k.key.substring(
                  4
                )} - W:${k.wiki} ${k.isNew ? "<" : ""}`,
                hexColorTable[k.wiki].hex
              )
            )
        : log("No Keys", hexColorTable[0].hex);

      log("-".repeat(47), hexColorTable[0].hex);

      wikisFound.length > 0
        ? wikisFound.forEach((w) =>
            log(
              `${w.isNew ? ">" : ""} ${w.wiki} ${w.isNew ? "<" : ""}`,
              hexColorTable[6].hex
            )
          )
        : log("No Wikis", hexColorTable[0].hex);

      log("-".repeat(47), hexColorTable[0].hex);
    }

    if (keysFound.length === 8) {
      const compiledKey = compileKeys(keysFound);
      await clipboardy.write(compiledKey);
      log(
        `You've collected all your keys. Here is your compiled key: \n${compiledKey}`,
        hexColorTable[0].hex,
        hexColorTable[5].hex
      );
      process.stdin.pause();
      process.exit();
    }
    previousClipboardText = currentClipboardText;
  });
}

readline.emitKeypressEvents(process.stdin);

process.stdin.on("keypress", (_str, key) => {
  if (key && key.ctrl && key.name === "c") {
    log("Closing program...", hexColorTable[7].hex);
    process.stdin.pause();
    process.exit();
  }
});

// http://47e3ca7af4507b0388effe60c38a452a.ann
// 1 - prjejgrtlof4 , 2 - max3h2l023wr , 3 - xhayow1o1zys , 4 - zdi3ej8b7ui9 , 5 - 4qq2jew46ju6 , 6 - 51inim4copdv , 7 - 13pg86pgwmto , 8 - 2m1m3fyjr2ud
// prjejgrtlof4max3h2l023wrxhayow1o1zyszdi3ej8b7ui94qq2jew46ju651inim4copdv13pg86pgwmto2m1m3fyjr2ud

// TODO: Add keybinds to copy keys and wikis?

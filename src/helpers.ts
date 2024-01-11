import chalk from "chalk";
import { Key } from "./type.js";

export function log(input: string, fg: string, bg?: string): void {
  bg
    ? console.log(chalk.bgHex(bg).hex(fg).bold(input))
    : console.log(chalk.hex(fg).bold(input));
}

export function compileKeys(keys: Key[]): string {
  return keys
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((e) => e.key.substring(4))
    .join("");
}

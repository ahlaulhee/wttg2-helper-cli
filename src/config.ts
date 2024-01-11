export const hexColorTable: { hex: string; refName: string }[] = [
  { hex: "#e06c75", refName: "brightRed" },
  { hex: "#61afef", refName: "brightBlue" },
  { hex: "#e5c07b", refName: "brightYellow" },
  { hex: "#7560d3", refName: "brightPurple" },
  { hex: "#56b6c2", refName: "brightCyan" },
  { hex: "#98c379", refName: "brightGreen" },
  { hex: "#d19a66", refName: "brightOrange" },
  { hex: "#d4d4d4", refName: "white" },
];
export const wttg1KeyPattern: RegExp = /[1-8] - [a-z0-9]{4}/gi;
export const wttg2KeyPattern: RegExp = /[1-8] - [a-z0-9]{12}/gi;
export const wikiPattern: RegExp = /http:\/\/[a-z0-9]{32}\.ann/gi;

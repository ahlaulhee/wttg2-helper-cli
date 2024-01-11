# WTTG2 Helper CLI

This tool listens to your clipboard, detects and stores the keys and saves the compiled key to your clipboard after you find all 8.

## Screenshots

![App Screenshot](https://i.imgur.com/JPJJ1Vt.png)

## Installation

```bash
    cd wttg2-helper-cli
    pnpm i
    pnpm link-cli
```

## Usage

Inside a terminal type:

```bash
    wttg2-helper
```

The only flag currently is -w1 or --wttg1, allowing you to switch to the key pattern used in Welcome to the Game 1.
While the CLI is running, press CTRL + R to reset all keys (beware: this will delete what you currently have in your clipboard) and Ctrl + 'C' to exit the program.
Also, pressing CTRL + 1 | 2 | 3 changes the wiki in which you are right now. You can omit this feature if you don't care.

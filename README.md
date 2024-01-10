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
    clipboardlistener listen
```

The only flag currently is -c or --condition, allowing you to switch between WTTG1 and WTTG2 key patterns.
While the CLI is running, press 'R' to reset all keys and Ctrl + 'C' to exit the program.

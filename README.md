# Livecodes playground

<img src="https://livecodes.io/docs/img/livecodes-logo.svg" style="width:200px; margin: 0 auto;">

[Livecodes](https://livecodes.io/docs/overview) playground plugin for [Obsidian.md](https://obsidian.md)

Read about [why Livecodes](https://livecodes.io/docs/why), it's [features](https://livecodes.io/docs/features/) and [how to self-host](https://livecodes.io/docs/features/self-hosting)

> [!IMPORTANT]
> The Livecodes codebase can be self-hosted but is not 100% off-line. Internet connection is required.

## Installation

### Community plugins

1. ~~Community Plugins > Browse~~ Plugin is currenlty awaiting approval.
2. Search for "livecodes"

### via BRAT (Beta Reviewer's Auto-update Tool)

1. Ensure [BRAT](https://github.com/TfTHacker/obsidian42-brat) is installed
2. Trigger the command `Obsidian42 - BRAT: Add a beta plugin for testing`
3. Enter this repository, `gapmiss/livecodes-playground`
4. Enable _Livecodes_ plugin in community plugin list

### Manually

1. download the latest [release archive](https://github.com/gapmiss/livecodes-playground/releases/)
2. uncompress the downloaded archive
3. move the `livecodes-playground` folder to `/path/to/vault/.obsidian/plugins/`
4. Settings > Community plugins > reload **Installed plugins**
5. enable plugin

or:

1. download `main.js`, `manifest.json` & `styles.css`
2. create a new folder `/path/to/vault/.obsidian/plugins/livecodes-playground`
3. move all 3 files to `/path/to/vault/.obsidian/plugins/livecodes-playground`
4. Settings > Community plugins > reload **Installed plugins**
5. enable plugin

## Issues and bug reports

Please submit issues, bug reports, feature requests, etc. to [gapmiss/livecodes-playground/issues](https://github.com/gapmiss/livecodes-playground/issues)

## Development

1. `cd /path/to/vault/.obsidian/plugins`
2. `git clone https://github.com/gapmiss/livecodes-playground.git`
3. `cd livecodes-playground`
4. `npm install`
5. `npm run dev`
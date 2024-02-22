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

## Usage

### commands

- Open Livecodes playground
- Open Livecodes starter
- New Livecodes playground

### obsidian:// URL protocols

- `playgroundPath` - e.g. obsidian://playground?vault=VAULTNAME&playgroundPath=path/to/playground.json
- `gistURL` - e.g. obsidian://playground?vault=VAULTNAME&gistUrl=https%3A%2F%2Fgist.githubusercontent.com … playground.json

## 🚧 ROADMAP

- [ ] style settings support
- [ ] gist MD codeblock script `language`
- [ ] test vault
- [ ] create Livecodes snippet for including in blog post, etc.

## Tips

- [ ] cursor position and Obsidian.md commands when inside the playground iframe
- [ ] which button SDK updates effect undo/redo history stack?
- [ ] tips to not accidentally close playground via keyboard or close button

## Issues and bug reports

Please submit issues, bug reports, feature requests, etc. to [gapmiss/livecodes-playground/issues](https://github.com/gapmiss/livecodes-playground/issues)

## Development

1. `cd /path/to/vault/.obsidian/plugins`
2. `git clone https://github.com/gapmiss/livecodes-playground.git`
3. `cd livecodes-playground`
4. `npm install`
5. `npm run dev`

## Livecodes

Livecodes is licensed under the [MIT License](https://github.com/live-codes/livecodes/blob/develop/LICENSE).

> MIT License
> 
> Copyright (c) 2021-PRESENT Hatem Hosny
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
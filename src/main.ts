import { Plugin, PluginManifest, DataAdapter, TFile, Notice, normalizePath, TFolder, requestUrl } from "obsidian";
import { PlaygroundView, VIEW_TYPE_PLAYGROUND } from "./views/playground";
import { LivecodesSettingsTab } from './settings';
import { PlaygroundSelectModal } from "./modals/playground-select-modal";
import { StarterSelectModal } from "./modals/starter-select-modal";
import { openPromptModal } from "./modals/prompt-modal";
import { blankPlayground } from "./utils";
import { Parameters } from "./types";
// @ts-ignore
import { config } from 'livecodes';

interface LivecodesSettings {
  playgroundFolder: string;
  notesFolder: string;
  autoWatch: boolean;
  appUrl: string;
  shortUrl: boolean;
  fontFamily: string;
  fontSize: any;
  editor: any;
  lineNumbers: boolean;
  darkTheme: boolean;
  useTabs: boolean;
  tabSize: any;
  closeBrackets: boolean;
  semicolons: boolean;
  singleQuote: boolean;
  trailingComma: boolean;
  wordWrap: boolean;
  autoUpdate: boolean;
  editorTheme: any;
  monacoDarkTheme: any;
  monacoLightTheme: any;
  codemirrorDarkTheme: any;
  codemirrorLightTheme: any;
  codejarDarkTheme: any;
  codejarLightTheme: any;
  delay: number;
  jsonTemplate: TFile | undefined;
  dataHeight: any;
  githubApiToken: string;
  githubGistPublic: boolean;
}

const DEFAULT_SETTINGS: LivecodesSettings = {
  playgroundFolder: "playgrounds",
  notesFolder: "playgrounds/notes",
  autoWatch: true,
  appUrl: "https://v21.livecodes.io/",
  shortUrl: false,
  fontFamily: "Default",
  fontSize: "12",
  editor: "monaco",
  lineNumbers: true,
  darkTheme: true,
  useTabs: false,
  tabSize: "2",
  closeBrackets: true,
  semicolons: true,
  singleQuote: false,
  trailingComma: true,
  wordWrap: false,
  autoUpdate: true,
  editorTheme: ["vs@light", "vs-dark@dark"],
  monacoDarkTheme: "",
  monacoLightTheme: "",
  codemirrorDarkTheme: "",
  codemirrorLightTheme: "",
  codejarDarkTheme: "",
  codejarLightTheme: "",
  delay: 1500,
  jsonTemplate: undefined,
  dataHeight: "600",
  githubApiToken: "",
  githubGistPublic: false
};

export default class LivecodesPlugin extends Plugin {
  settings!: LivecodesSettings;
  manifest: PluginManifest;
  plugin: LivecodesPlugin;
  public adapter: DataAdapter = this.app.vault.adapter;
  state: string = 'initial';
  params: any;
  fontFamily: any;
  fontSize: any;
  editor: any;
  lineNumbers: boolean;
  darkTheme: boolean;
  useTabs: boolean;
  tabSize: any;
  closeBrackets: boolean;
  semicolons: boolean;
  singleQuote: boolean;
  trailingComma: boolean;
  wordWrap: boolean;
  autoUpdate: boolean;
  editorTheme: any;
  monacoDarkTheme: any;
  monacoLightTheme: any;
  codemirrorDarkTheme: any;
  codemirrorLightTheme: any;
  codejarDarkTheme: any;
  codejarLightTheme: any;
  delay: number = 1500;
  d: any = new Date();
  jsonTemplate: TFile | undefined;
  dataHeight: string | undefined;
  logDebug: boolean = true;

  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_PLAYGROUND,
      (leaf) => new PlaygroundView(this.app, leaf, this.settings.jsonTemplate, this.settings),
    );

    this.addRibbonIcon("file-code-2", "Open Livecodes playground", async () => {
      new PlaygroundSelectModal(this).open();
    });

    this.addRibbonIcon("code", "New Livecodes playground", async () => {
      await this.newLivecodesPlayground(false, null);
    });

    this.addCommand({
      id: "open-playground-select-modal",
      name: "Open Livecodes playground",
      callback: async () => {
        new PlaygroundSelectModal(this).open();
      },
    });

    this.addCommand({
      id: "open-starter-select-modal",
      name: "Open Livecodes starter",
      callback: async () => {
        new StarterSelectModal(this).open();
      },
    });

    this.addCommand({
      id: "new-project-in-livecodes",
      name: "New Livecodes playground",
      callback: async () => {
        await this.newLivecodesPlayground(false, null);
      }
    });

    /**
     * Test for malicious URI ?
     * i.e. obsidian://playground?vault=Playground&playgroundPath=some-malicious-URI
     */
    this.registerObsidianProtocolHandler("playground", async (e) => {
      const parameters = e as unknown as Parameters;
      if (parameters.playgroundPath) {
        try {
          const f = this.app.vault.getAbstractFileByPath(parameters.playgroundPath!);
          if (f instanceof TFile) {
            this.settings.jsonTemplate = f;
            await this.saveSettings();
            await this.activateView();
          }
        } catch (error) {
          new Notice("❌ " + error + " Click this message to dismiss.", 0);
        }
      }
      else if (parameters.gistUrl) {
        new Notice("Requesting gist from Github…", 5000);
        try {
          let requestResults = await requestUrl(parameters.gistUrl);
          await this.newLivecodesPlaygroundFromGist(JSON.stringify(requestResults.json));
        } catch (error) {
          new Notice("❌ " + error + " Click this message to dismiss.", 0);
        }
      }
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        const f = this.app.vault.getAbstractFileByPath(file.path);
        if (f instanceof TFile) {
          if (f.extension.toLowerCase() === "json" && f.path.contains(this.settings.playgroundFolder)) {
            menu.addItem((item) => {
              item
                .setTitle("Open playground")
                .setIcon("code")
                .onClick(async () => {
                  this.settings.jsonTemplate = f;
                  await this.saveSettings();
                  await this.activateView();
                });
            });
            menu.addItem((item) => {
              item
                .setTitle("Copy markdown link to playground")
                .setIcon("link")
                .onClick(async () => {
                  let playgroundPath = normalizePath(f.path);
                  await this.copyStringToClipboard("["+f.name+"](obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&playgroundPath="+encodeURIComponent(playgroundPath)+")");
                });
            });
            menu.addItem((item) => {
              item
                .setTitle("Copy Obsidian URL to playground")
                .setIcon("link")
                .onClick(async () => {
                  let playgroundPath = normalizePath(f.path);
                  await this.copyStringToClipboard("obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&playgroundPath="+encodeURIComponent(playgroundPath));
                });
            });
          }
        }
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", async (menu, file) => {

        const f = this.app.vault.getAbstractFileByPath(file.path);

        if (f instanceof TFolder && f.children.length > 1 && f.children.length <= 3) {
          const ALLOWED_EXTS = ["html","css","js","ts","json"];
          let showMenu = false;
          f.children.forEach((f) => {
            let fileExt = f.name.split('.').pop();
            if (ALLOWED_EXTS.includes(fileExt as string)) {
              showMenu = true;
              return;
            }
          });

          if (showMenu) {
            menu.addItem( (item) => {
              item
                .setTitle("Open in Livecodes playground")
                .setIcon("file-code-2")
                .onClick(async () => {
                  await this.newLivecodesPlayground(true, f);
                });
            });
          }
        }
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", async (menu, file) => {

        const f = this.app.vault.getAbstractFileByPath(file.path);

        if (f instanceof TFile) {
          const ALLOWED_EXTS = ["html","css","js","ts"];
          let showMenu = false;
          let fileExt = f.name.split('.').pop();
          if (ALLOWED_EXTS.includes(fileExt as string)) {
            showMenu = true;
          }

          if (showMenu) {
            menu.addItem( (item) => {
              item
                .setTitle("Open in Livecodes playground")
                .setIcon("file-code-2")
                .onClick(async () => {
                  await this.newLivecodesPlayground(true, f);
                });
            });
          }
        }
      })
    );

    this.addSettingTab(new LivecodesSettingsTab(this.app, this));

    this.state = "loaded";
    console.log("<"+this.manifest.name+">", "v"+this.manifest.version, this.state );
  }

  onunload() {
    this.state = "unloaded";
    this.app.workspace.getLeavesOfType(VIEW_TYPE_PLAYGROUND).forEach((leaf) => {
      if (leaf.view instanceof PlaygroundView) {
        leaf.detach();
      }
    });
    console.log("<"+this.manifest.name+">", "v"+this.manifest.version, this.state );
  }

  async activateView() {
    new Notice("Loading playground…", 5000);

    await this.app.workspace.getLeaf(true).setViewState({
      type: VIEW_TYPE_PLAYGROUND,
      active: true,
    });

    const leaf = this.app.workspace.getMostRecentLeaf();

    if (leaf?.view instanceof PlaygroundView) {
      this.app.workspace.revealLeaf(leaf);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  public async saveSettings() {
    await this.saveData(this.settings);
    // new Notice("Settings saved");
  }

  async newLivecodesPlayground(fromMenu:boolean = false, file:TFile|TFolder|null) {
    await openPromptModal(this.app, "Livecodes playground", "Save as:", "", "e.g. New Project", false)
      .then(async (fName:string) => {

        if (fName?.length === 0) {
          return;
        }

        let newPlayground = blankPlayground;

        if (fromMenu && file !== null && (file instanceof TFile || file instanceof TFolder)) {
          let foundMarkup: boolean = false;
          let foundStyle: boolean = false;
          let foundScript: boolean = false;
          let foundTypeScript: boolean = false;
          if (file instanceof TFile) {
            let fileExt = file.name.split('.').pop();
            foundMarkup = fileExt === 'html';
            foundStyle = fileExt === 'css';
            foundScript = fileExt === 'js';
            foundTypeScript = fileExt === 'ts';
          } else if (file instanceof TFolder) {
            foundMarkup = await this.adapter.exists(file.path+"/index.html");
            foundStyle = await this.adapter.exists(file.path+"/style.css");
            foundScript = await this.adapter.exists(file.path+"/script.js");
            foundTypeScript = await this.adapter.exists(file.path+"/script.ts");
          }

          if (foundMarkup) {
            let c = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/index.html") : this.app.vault.getAbstractFileByPath(file.path);
            let t = await this.app.vault.read(c as TFile)
            newPlayground.markup.content = t;
          }
          if (foundStyle) {
            let c = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/style.css") : this.app.vault.getAbstractFileByPath(file.path);
            let t = await this.app.vault.read(c as TFile)
            newPlayground.style.content = t;
          }
          if (foundScript) {
            let c = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/script.js") : this.app.vault.getAbstractFileByPath(file.path);
            let t = await this.app.vault.read(c as TFile)
            newPlayground.script.content = t;
          }
          if (foundTypeScript) {
            let c = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/script.ts") : this.app.vault.getAbstractFileByPath(file.path);
            let t = await this.app.vault.read(c as TFile)
            newPlayground.script.content = t;
            newPlayground.script.language = "typescript";
          }
        }
        else {
          newPlayground.markup.content = '';
          newPlayground.style.content = '';
          newPlayground.script.content = '';
          newPlayground.script.content = '';
          newPlayground.script.language = '';
          newPlayground.activeEditor = '';
          newPlayground.stylesheets = [];
          newPlayground.cssPreset = '';
          newPlayground.scripts = [];
        }

        newPlayground.title = fName;
        newPlayground.appUrl = this.settings.appUrl;
        newPlayground.fontFamily = this.settings.fontFamily;
        newPlayground.fontSize = this.settings.fontSize;
        newPlayground.editor = this.settings.editor;
        newPlayground.editorTheme = this.settings.editorTheme;
        newPlayground.lineNumbers = this.settings.lineNumbers;
        newPlayground.theme = this.settings.darkTheme ? "dark" : "light";
        newPlayground.useTabs = this.settings.useTabs;
        newPlayground.tabSize = this.settings.tabSize;
        newPlayground.closeBrackets = this.settings.closeBrackets;
        newPlayground.semicolons = this.settings.semicolons;
        newPlayground.singleQuote = this.settings.singleQuote;
        newPlayground.trailingComma = this.settings.trailingComma;
        newPlayground.wordWrap = this.settings.wordWrap;
        newPlayground.autoupdate = this.settings.autoUpdate;
        newPlayground.delay = this.settings.delay;

        let prettyCfg: string | undefined = JSON.stringify(newPlayground, null, 2);
        try {
          await this.app.vault
            .create(
              this.settings.playgroundFolder+'/'+fName + ".json",
              await this.createText(
                prettyCfg
              )
            ).then(async (f:TFile) => {
                this.settings.jsonTemplate = f;
                await this.saveSettings();
                await this.activateView();
              }
            );
          new Notice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json");
          // const allProperties = Object.getOwnPropertyNames(newPlayground);
          // console.log('allProperties');
          // console.log(allProperties);
          // allProperties.forEach(property => {
          // 	delete newPlayground[property];
          // });
        } catch (error) {
          new Notice("❌ " + error + " Click this message to dismiss.", 0);
        }
      });
  };

  async newLivecodesPlaygroundFromGist(tpl: string) {
    let newTemplate: Partial<config> = JSON.parse(tpl) as Partial<config>;
    // console.log(newTemplate);
    // console.log(newTemplate.title);

    // return Promise.resolve;
    await openPromptModal(this.app, "Livecodes playground", "Save as:", newTemplate.title, "e.g. New Project", false)
      .then(async (fName:string) => {

        if (fName?.length === 0) {
          return;
        }

        let newPlayground = newTemplate;



        let prettyCfg: string | undefined = JSON.stringify(newPlayground, null, 2);
        try {
          await this.app.vault
            .create(
              this.settings.playgroundFolder+'/'+fName + ".json",
              await this.createText(
                prettyCfg
              )
            ).then(async (f:TFile) => {
                this.settings.jsonTemplate = f;
                await this.saveSettings();
                await this.activateView();
              }
            );
          new Notice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json");
        } catch (error) {
          new Notice("❌ " + error + " Click this message to dismiss.", 0);
        }
      });
  };

  /**
   * https://github.com/eoureo/obsidian-runjs/blob/master/src/main.ts#L1394
   */
  async reload() {
    this.state = "start reloading";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );

    this.app.workspace.getLeavesOfType(VIEW_TYPE_PLAYGROUND).forEach((leaf) => {
      if (leaf.view instanceof PlaygroundView) {
        leaf.detach();
      }
    });

    let manifest_id = this.manifest.id;
    // @ts-ignore
    if (this.app.plugins.enabledPlugins.has(manifest_id)) {
      this.state = "disable";
      // @ts-ignore
      await this.app.plugins.disablePlugin(manifest_id);

      window.setTimeout(async () => {
        // @ts-ignore
        this.app.plugins.enablePlugin(manifest_id);

        for (let i = 0; i < 100; i++) {
          // @ts-ignore
          let state = this.app.plugins.plugins[manifest_id]?.state;
          if (state == "loaded") {
            window.setTimeout(() => {
              // @ts-ignore
              this.app.setting.openTabById(manifest_id);
            }, 100);
            break;
          }
          await sleep(500);
        }
      }, 100);
    }
  }

  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async copyStringToClipboard(text:string, topic:string|undefined=undefined) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        new Notice((topic !== undefined ? topic + " " : "") + "copied to clipboard", 2500);
      })
      .catch(function (error) {
        console.error('Failed to copy to clipboard: ', error)
      })
  }

  createText = async (
      fileContent: string|undefined
    ): Promise<string> => {
      return fileContent?.trim() as string;
  }

}
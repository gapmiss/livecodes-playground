import { Plugin, PluginManifest, DataAdapter, TFile, Notice, normalizePath, TFolder, requestUrl } from "obsidian";
import { PlaygroundView, VIEW_TYPE_PLAYGROUND } from "./views/playground";
import { LivecodesSettingsTab } from './settings';
import { PlaygroundSelectModal } from "./modals/PlaygroundSelect";
import { StarterSelectModal } from "./modals/StarterSelect";
import { LanguageSelectModal } from "./modals/LanguageSelect";
import { saveAsModal } from "./modals/SaveAs";
import { blankPlayground } from "./livecodes";
import { Parameters } from "../@types/global";
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
  enableAI: boolean;
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
  appUrl: "https://v24.livecodes.io/",
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
  enableAI: false,
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
  enableAI: boolean;
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

    this.addRibbonIcon("file-code-2", "Open livecodes playground", async () => {
      new PlaygroundSelectModal(this).open();
    });

    this.addRibbonIcon("code", "New livecodes playground", async () => {
      await this.newLivecodesPlayground(false, null);
    });

    this.addCommand({
      id: "open-playground-select-modal",
      name: "Open playground",
      callback: async () => {
        new PlaygroundSelectModal(this).open();
      },
    });

    this.addCommand({
      id: "open-starter-select-modal",
      name: "Open starter playground",
      callback: async () => {
        new StarterSelectModal(this).open();
      },
    });

    this.addCommand({
      id: "open-language-select-modal",
      name: "New playground",
      callback: async () => {
        let conf = {
          title: "",
          markup: "html",
          style:  "css",
          twcss: false,
          lightningcss: false,
          windicss: false,
          unocss: false,
          script: "javascript",
        };
        let cb = async (res: any) => {
          await this.newLanguageSelectPlayground(res);
        };
        new LanguageSelectModal(this.app, this.plugin, "New playground", conf, cb).open();
      },
    });

    this.addCommand({
      id: "new-playground-in-livecodes",
      name: "Quick playground",
      callback: async () => {
        await this.newLivecodesPlayground(false, null);
      }
    });

    this.registerObsidianProtocolHandler("playground", async (e) => {
      const parameters = e as unknown as Parameters;
      if (parameters.playgroundPath) {
        try {
          const f = this.app.vault.getAbstractFileByPath(parameters.playgroundPath!);
          if (f instanceof TFile) {
            this.settings.jsonTemplate = f;
            await this.saveSettings();
            await this.activatePlaygroundView();
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
                  await this.activatePlaygroundView();
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
          const ALLOWED_EXTS = ["html","mdx","css","scss","js","jsx","ts","tsx","astro","svelte"];
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
                .setTitle("Open in Livecodes")
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
          const ALLOWED_EXTS = ["html","mdx","css","scss","js","jsx","ts","tsx","astro","svelte"];
          let showMenu = false;
          let fileExt = f.name.split('.').pop();
          if (ALLOWED_EXTS.includes(fileExt as string)) {
            showMenu = true;
          }
          if (showMenu) {
            menu.addItem( (item) => {
              item
                .setTitle("Open in Livecodes")
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
    console.log(this.manifest.name, "(v"+this.manifest.version+")", this.state );
  }

  onunload() {
    this.state = "unloaded";
    this.app.workspace.getLeavesOfType(VIEW_TYPE_PLAYGROUND).forEach((leaf) => {
      if (leaf.view instanceof PlaygroundView) {
        leaf.detach();
      }
    });
    console.log(this.manifest.name, "(v"+this.manifest.version+")", this.state );
  }

  async activatePlaygroundView() {
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
  }

  async newLanguageSelectPlayground(res:{title: string, markup: string, style: string, twcss: boolean, windicss: boolean, unocss: boolean, lightningcss: boolean, script: string, processor: string}) {
    if (res.title?.length === 0) {
      return;
    }
    let newPlayground = blankPlayground;
    let processors = [];
    
    if (res.twcss) {
      newPlayground.customSettings = JSON.stringify({"imports":{},"tailwindcss":{"plugins":["@tailwindcss/forms","@tailwindcss/typography","@tailwindcss/aspect-ratio","@tailwindcss/line-clamp"],"theme":{"extend":{"colors":{"sky":{"50":"#f0f9ff","100":"#e0f2fe","200":"#bae6fd","300":"#7dd3fc","400":"#38bdf8","500":"#0ea5e9","600":"#0284c7","700":"#0369a1","800":"#075985","900":"#0c4a6e"},"cyan":{"50":"#ecfeff","100":"#cffafe","200":"#a5f3fc","300":"#67e8f9","400":"#22d3ee","500":"#06b6d4","600":"#0891b2","700":"#0e7490","800":"#155e75","900":"#164e63"}}}}}});
      newPlayground.style.content = "@tailwind base;\n@tailwind components;\n@tailwind utilities;";
      processors.push("tailwindcss");
    }

    if (res.lightningcss) {
      processors.push("lightningcss");
    }

    if (res.unocss) {
      processors.push("unocss");
    }

    if (res.windicss) {
      processors.push("windicss");
    }
    newPlayground.processors = processors as unknown as string;
    newPlayground.markup.language = res.markup;
    newPlayground.style.language = res.style;
    newPlayground.script.language = res.script;

    newPlayground.title = res.title;
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
    newPlayground.enableAI = this.settings.enableAI;
    newPlayground.autoupdate = this.settings.autoUpdate;
    newPlayground.delay = this.settings.delay;

    let prettyCfg: string | undefined = JSON.stringify(newPlayground, null, 2);
    try {
      await this.app.vault
        .create(
          this.settings.playgroundFolder+'/'+res.title + ".json",
          await this.createText(
            prettyCfg
          )
        ).then(async (f:TFile) => {
            this.settings.jsonTemplate = f;
            await this.saveSettings();
            await this.activatePlaygroundView();
          }
        );
      new Notice("New playground saved as: " + this.settings.playgroundFolder+'/'+res.title + ".json");
    } catch (error) {
      new Notice("❌ " + error + " Click this message to dismiss.", 0);
    }
  }

  async newLivecodesPlayground(fromMenu:boolean = false, file:TFile|TFolder|null) {
    await saveAsModal(this.app, "New livecodes playground", "Save as:", "", "e.g. New Playground", false)
      .then(async (fName:string) => {
        if (fName?.length === 0) {
          return;
        }
        let newPlayground = blankPlayground;
        if (fromMenu && file !== null && (file instanceof TFile || file instanceof TFolder)) {
          let foundHtml: boolean = false;
          let foundMdx: boolean = false;
          let foundCss: boolean = false;
          let foundScss: boolean = false;
          let foundJavaScript: boolean = false;
          let foundJsx: boolean = false;
          let foundTsx: boolean = false;
          let foundTypeScript: boolean = false;
          let foundSvelte: boolean = false;
          let foundAstro: boolean = false;
          let foundFolderWithHtml: boolean = false;
          let foundFolderWithMdx: boolean = false;
          let foundFolderWithCss: boolean = false;
          let foundFolderWithScss: boolean = false;
          let foundFolderWithJavaScript: boolean = false;
          let foundFolderWithJsx: boolean = false;
          let foundFolderWithTsx: boolean = false;
          let foundFolderWithTypeScript: boolean = false;
          let foundFolderWithSvelte: boolean = false;
          let foundFolderWithAstro: boolean = false;
          if (file instanceof TFile) {
            let fileExt = file.extension;
            foundHtml = fileExt === 'html';
            foundMdx = fileExt === 'mdx';
            foundCss = fileExt === 'css';
            foundScss = fileExt === 'scss';
            foundJavaScript = fileExt === 'js';
            foundJsx = fileExt === 'jsx';
            foundTsx = fileExt === 'tsx';
            foundTypeScript = fileExt === 'ts';
            foundSvelte = fileExt === 'svelte';
            foundAstro = fileExt === 'astro';
          } else if (file instanceof TFolder) {
            foundFolderWithHtml = await this.adapter.exists(file.path+"/markup.html");
            foundFolderWithMdx = await this.adapter.exists(file.path+"/markup.mdx");
            foundFolderWithCss = await this.adapter.exists(file.path+"/style.css");
            foundFolderWithScss = await this.adapter.exists(file.path+"/style.scss");
            foundFolderWithJavaScript = await this.adapter.exists(file.path+"/script.js");
            foundFolderWithJsx = await this.adapter.exists(file.path+"/script.jsx");
            foundFolderWithTsx = await this.adapter.exists(file.path+"/script.tsx");
            foundFolderWithTypeScript = await this.adapter.exists(file.path+"/script.ts");
            foundFolderWithSvelte = await this.adapter.exists(file.path+"/script.svelte");
            foundFolderWithAstro = await this.adapter.exists(file.path+"/markup.astro");
          }
          if (foundHtml || foundFolderWithHtml) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/markup.html") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.markup.content = code;
            newPlayground.markup.language = "html";
            if (foundHtml) {
              newPlayground.style.language = "css";
              newPlayground.script.language = "javascript";
            }
          }
          if (foundMdx || foundFolderWithMdx) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/markup.mdx") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.markup.content = code;
            newPlayground.markup.language = "mdx";
            if (foundMdx) {
              newPlayground.style.language = "css";
              newPlayground.script.language = "jsx";
            }
          }
          if (foundAstro || foundFolderWithAstro) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/markup.astro") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.markup.content = code;
            newPlayground.markup.language = "astro";
            if (foundAstro) {
              newPlayground.style.language = "css";
              newPlayground.script.language = "javascript";
            }
          }
          if (foundCss || foundFolderWithCss) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/style.css") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.style.content = code;
            newPlayground.style.language = "css";
            if (foundCss) {
              newPlayground.markup.language = "html";
              newPlayground.script.language = "javascript";
            }
          }
          if (foundScss || foundFolderWithScss) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/style.scss") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.style.content = code;
            newPlayground.style.language = "scss";
            if (foundScss) {
              newPlayground.markup.language = "html";
              newPlayground.script.language = "javascript";
            }
          }
          if (foundJavaScript || foundFolderWithJavaScript) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/script.js") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.script.content = code;
            newPlayground.script.language = "javascript";
            if (foundJavaScript) {
              newPlayground.markup.language = "html";
              newPlayground.style.language = "css";
            }
          }
          if (foundJsx || foundFolderWithJsx) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/script.jsx") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.script.content = code;
            newPlayground.script.language = "jsx";
            if (foundJsx) {
              newPlayground.markup.language = "html";
              newPlayground.style.language = "css";
            }
          }
          if (foundTsx || foundFolderWithTsx) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/script.tsx") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.script.content = code;
            newPlayground.script.language = "tsx";
            if (foundTsx) {
              newPlayground.markup.language = "html";
              newPlayground.style.language = "css";
            }
          }
          if (foundTypeScript || foundFolderWithTypeScript) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/script.ts") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.script.content = code;
            newPlayground.script.language = "typescript";
            if (foundTypeScript) {
              newPlayground.markup.language = "html";
              newPlayground.style.language = "css";
            }
          }
          if (foundSvelte || foundFolderWithSvelte) {
            let f = file instanceof TFolder ? this.app.vault.getAbstractFileByPath(file.path+"/script.svelte") : this.app.vault.getAbstractFileByPath(file.path);
            let code = await this.app.vault.read(f as TFile)
            newPlayground.script.content = code;
            newPlayground.script.language = "svelte";
            if (foundSvelte) {
              newPlayground.markup.language = "html";
              newPlayground.style.language = "css";
            }
          }
        }
        else {
          newPlayground.markup.content = '';
          newPlayground.style.content = '';
          newPlayground.script.content = '';
          newPlayground.markup.language = '';
          newPlayground.style.language = '';
          newPlayground.script.language = '';
          newPlayground.activeEditor = '';
          newPlayground.stylesheets = "[]";
          newPlayground.cssPreset = '';
          newPlayground.scripts = "[]";
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
        newPlayground.enableAI = this.settings.enableAI;
        newPlayground.autoupdate = this.settings.autoUpdate;
        newPlayground.delay = this.settings.delay;
        let prettyCfg: string | undefined = JSON.stringify(newPlayground, null, 2);
        // reset?
        newPlayground = blankPlayground;
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
                await this.activatePlaygroundView();
              }
            );
          new Notice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json");
        } catch (error) {
          new Notice("❌ " + error + " Click this message to dismiss.", 0);
        }
      });
  };

  async newLivecodesPlaygroundFromGist(tpl: string) {
    let newTemplate: Partial<config> = JSON.parse(tpl) as Partial<config>;
    await saveAsModal(this.app, "New livecodes playground", "Save as:", newTemplate.title, "e.g. New Playground", false)
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
                await this.activatePlaygroundView();
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
    console.log(this.manifest.name, "(v"+this.manifest.version+")", this.state );

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
import { App, Plugin, PluginManifest, TFile, normalizePath, TFolder, requestUrl, Platform, Menu, MenuItem, Editor, MarkdownView, moment } from "obsidian";
import { PlaygroundView, VIEW_TYPE_PLAYGROUND } from "./views/playground";
import { LivecodesSettingsTab } from './settings';
import { PlaygroundSelectModal } from "./modals/PlaygroundSelect";
import { StarterSelectModal } from "./modals/StarterSelect";
import { LanguageSelectModal } from "./modals/LanguageSelect";
import { saveAsModal } from "./modals/SaveAs";
import { codepenUrlModal } from "./modals/codepenUrl";
import { blankPlayground, codeBlockLanguages, ALLOWED_LANGS, ALLOWED_EXTS } from "./livecodes";
import { Parameters } from "../@types/global";
import { LivecodesSettings, DEFAULT_SETTINGS } from './settings/default';
// import { codeBlockPostProcessor } from './editor/codeblockProcessor';
import { onElement } from './utils';
import { showNotice } from './utils/notice';
// @ts-ignore
import { config } from 'livecodes';
import * as cheerio from 'cheerio';

export default class LivecodesPlugin extends Plugin {

  settings!: LivecodesSettings;
  manifest: PluginManifest;
  plugin: LivecodesPlugin;
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

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  async onload() {
    await this.loadSettings();

    if (Platform.isDesktop) {
      this.register(
        onElement(
          document,
          "contextmenu" as keyof HTMLElementEventMap,
          "div",
          this.onClickCodeblock.bind(this)
        )
      );
    }

    this.registerView(
      VIEW_TYPE_PLAYGROUND,
      (leaf) => new PlaygroundView(this.app, leaf, this.settings.jsonTemplate, this.settings),
    );

    this.addRibbonIcon("file-code-2", "Open livecodes playground", async () => {
      new PlaygroundSelectModal(this).open();
    });

    this.addRibbonIcon("code", "Quick playground", async () => {
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

    this.addCommand({
      id: "open-codeblocks-in-livecodes",
      name: "Open codeblocks in Livecodes",
      editorCheckCallback: (checking, editor, view) => {
        let res = this.checkForCodeblocks( editor );
        if (res) {
          if (!checking) {
            this.newLivecodesPlaygroundFromCodeblocks();
          }
          return true;
        }
        return false;
      }
    });

    this.addCommand({
      id: "open-livecodes-playground-from-codepen",
      name: "New playground from Codepen",
      callback: async () => {
        try {
          await codepenUrlModal(this.app, "Codepen URL", "", "", "e.g. https://codepen.io/chriscoyier/pen/DELgOJ", false)
            .then(async (cpUrl:string) => {
              if (cpUrl?.length === 0) {
                return;
              }
              let regex = /https:\/\/codepen\.io\/[a-zA-Z0-9_\-]{1,50}\/pen\/[a-zA-z0-9]{1,50}/g;
              if (!regex.test(cpUrl)) {
                showNotice('Error: Unable to validate as codepen.io URL. See the developer console for error details. Click this message to dismiss', 0, 'error');
                return;
              }
              showNotice(`Fetching pen from ${cpUrl}`, 10000, 'loading');
              await requestUrl(cpUrl).then(
                async (f) => {
                  let htmlContent = f.text;
                  // console.log('htmlContent');
                  // console.log(htmlContent);
                  let cnf:Partial<config> = {title: '', markup:{content:'',language:''},style:{content:'',language:''},script:{content:'',language:''}};
                  try {
                    // https://cheerio.js.org/docs/basics/loading
                    const $ = cheerio.load(htmlContent);
                    let content: string = '';
                    // https://cheerio.js.org/docs/basics/selecting
                    // https://cheerio.js.org/docs/api/classes/Cheerio#text
                    $('textarea[id="init-data"]').each((i, el) => {
                      content = $(el).text()?.trim();
                    });
                    if (content === '') {
                      showNotice("Error importing codepen: content not found." + " Click this message to dismiss.", 0, 'error');
                      return;
                    }
                    let penJson = JSON.parse(content);
                    // console.log('penJson');
                    // console.log(penJson);
                    let itemJson = JSON.parse(penJson.__item);
                    // console.log('itemJson');
                    // console.log(itemJson);
                    await saveAsModal(this.app, "New livecodes playground", "Save as:", (itemJson.title !== '') ? itemJson.title : 'Untitled', "e.g. New Playground", false)
                      .then(async (fName:string) => {
                        if (fName?.length === 0) {
                          return;
                        }

                        cnf.title = fName;
                        cnf.description = (itemJson.description !== '') ? itemJson.description : '';
                        cnf.tags = (itemJson.tags.length) ? itemJson.tags : [];

                        let extStylesheets:any[] = [];
                        let extScripts:any[] = [];
                        if (itemJson.resources.length) {
                          itemJson.resources.forEach((resource: any) => {
                            if (resource.resource_type === 'css') {
                              extStylesheets = [...extStylesheets, resource.url];
                            }
                            if (resource.resource_type === 'js') {
                              extScripts = [...extScripts, resource.url];
                            }
                          });
                          if (extStylesheets.length) {
                            cnf.stylesheets = extStylesheets;
                          }
                          if (extScripts.length) {
                            cnf.scripts = extScripts;
                          }
                        }

                        // style lang
                        if ( itemJson.css_pre_processor !== '' && ['scss', 'less', 'stylus'].contains(itemJson.css_pre_processor) ) {
                          cnf.style.language = itemJson.css_pre_processor;
                        }
                        else {
                          cnf.style.language = 'css'
                        }
                        if (itemJson.css_starter !== '') {
                          switch (itemJson.css_starter) {
                            case "reset":
                              cnf.cssPreset = 'reset-css';
                              break;
                            case "normalize":
                              cnf.cssPreset = 'normalize.css';
                              break;
                          }
                        }
                        cnf.style.content = itemJson.css;

                        // js library
                        if (itemJson.js_library !== '') {
                          switch (itemJson.js_library) {
                            case "jquery":
                              cnf.head = blankPlayground.head + '\n<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>';
                              break;
                          }
                        }

                        // script lang
                        if (itemJson.js_pre_processor !== '' && ['coffeescript', 'typescript', 'livescript', 'babel'].contains(itemJson.js_pre_processor)) {
                          cnf.script.language = itemJson.js_pre_processor;
                        } else {
                          cnf.script.language = 'javascript';
                        }
                        cnf.script.content = itemJson.js;

                        // markup lang
                        if (itemJson.html_pre_processor !== '' && ['pug', 'markdown'].contains(itemJson.html_pre_processor)) {
                          cnf.markup.language = itemJson.html_pre_processor;
                        } else {
                          cnf.markup.language = 'html';
                        }
                        cnf.markup.content = "<!-- source: "+cpUrl+" -->\n\n" + itemJson.html;

                        if (itemJson.head !== '') {
                          if (cnf.head !== undefined) {
                            cnf.head = cnf.head + '\n' + itemJson.head;
                          } else {
                            cnf.head =  blankPlayground.head + '\n' + itemJson.head;
                          }
                        }
                        if (itemJson.html_classes !== '') {
                          cnf.htmlAttrs = `lang="en" class="${itemJson.html_classes}"`
                        }

                        let newPlayground:Partial<config> = {...blankPlayground, ...cnf};
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
                        // https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
                        // let cleanTitle: string = cnf.title.replace(/[/\\?%*:|"<>]/g, '-');
                        // let cleanTitle: string = cnf.title.replace(/[/\\?%*:|"]/g, '-');
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
                                await this.activatePlaygroundView(true);
                              }
                            );
                          showNotice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json", 3000, 'success');
                        } catch (error) {
                          showNotice(this.settings.playgroundFolder+'/'+fName + ".json - " + error + " Click this message to dismiss.", 0, 'error');
                        }
                      }
                    );
                  } catch (error) {
                    throw error;
                  }
                }
              );
            });
        } catch (error) {
          showNotice(error + " Click this message to dismiss.", 0, 'error');
          console.log(error);
        }
      }
    });

    this.registerObsidianProtocolHandler("playground", async (e) => {
      const parameters = e as unknown as Parameters;
      if (parameters.playgroundPath) {
        try {
          const f = this.app.vault.getFileByPath(parameters.playgroundPath!);
          if (f) {
            this.settings.jsonTemplate = f;
            await this.saveSettings();
            await this.activatePlaygroundView();
          }
        } catch (error) {
          showNotice('Error: ' + error + " Click this message to dismiss.", 0, 'error');
        }
      }
      else if (parameters.gistUrl) {
        showNotice('Requesting gist from Github…', 5000, 'loading');
        try {
          let requestResults = await requestUrl(parameters.gistUrl);
          await this.newLivecodesPlaygroundFromGist(JSON.stringify(requestResults.json));
        } catch (error) {
          showNotice('Error: ' + error + " Click this message to dismiss.", 0, 'error');
        }
      }
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        const f = this.app.vault.getFileByPath(file.path);
        if (f && f.extension.toLowerCase() === "json" && f.path.contains(this.settings.playgroundFolder)) {
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
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", async (menu, file) => {
        const f = this.app.vault.getFolderByPath(file.path);
        if (f && f.children.length > 1 && f.children.length <= 3) {
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
        const f:TFile|null = this.app.vault.getFileByPath(file.path);
        if (f) {
          let showMenu = false;
          let fileExt = f.name.split('.').pop();
          if (ALLOWED_EXTS.includes(fileExt as string)) {
            showMenu = true;
          }
          if (showMenu) {
            menu.addItem( (item) => {
              item
                .setTitle("Open in Livecodes")
                .setSection('livecodes')
                .setIcon("file-code-2")
                .onClick(async () => {
                  await this.newLivecodesPlayground(true, f);
                  return;
                });
            });
          }
        }
      })
    );

    this.addSettingTab(new LivecodesSettingsTab(this.app, this));

    /*/
    this.registerEvent(
      this.app.workspace.on('resize', () => {
        // this.handleResize();
        console.log('%c --------- main workspace on resize ---------', 'color:var(--color-purple);');
        console.log('%c PlaygroundView', 'color:var(--color-purple);');
        console.log(this.app.workspace.getActiveViewOfType(PlaygroundView));
        console.log('%c VIEW_TYPE_PLAYGROUND', 'color:var(--color-purple);');
        console.log(this.app.workspace.getLeavesOfType(VIEW_TYPE_PLAYGROUND));
        this.app.workspace.getLeavesOfType('markdown').forEach(leaf => {
          console.log("%c --- refreshed panes ---", 'color:var(--color-purple);');
          if (leaf.getViewState().state.mode.includes('preview'))
            // leaf.view.previewMode.rerender(true);
            console.log(leaf);
        });
      }),
    );
    /**/

    // window.addEventListener('resize', () => {
    //   console.log('--------- on window resize ---------');
    //   console.log(this);
    //   return { }
    // })

    // this.registerMarkdownPostProcessor((el, ctx) => {
    //   codeBlockPostProcessor(el, ctx, this.app, this);
    // });

    this.state = "loaded";
    console.log(this.manifest.name, "(v"+this.manifest.version+")", this.state );
  }

  onunload() {
    this.state = "unloaded";
    console.log(this.manifest.name, "(v"+this.manifest.version+")", this.state );
  }

  private checkForCodeblocks(
    editor: Editor
  ): boolean {
    const PATTERN = /^([A-Za-z \t]*)```([A-Za-z]*)?\n([\s\S]*?)```([A-Za-z \t]*)*$/gm;
    let markdown = editor.getValue();
    let matches;
    do {
      matches = PATTERN.exec(markdown);
      if (matches && [...ALLOWED_LANGS,...['js','ts']].includes(matches![2])) {
          return true;
      }
    } while (matches);
    return false;
  }

  async activatePlaygroundView(skipNotice: boolean = false) {
    if (!skipNotice) {
      showNotice("Loading playground…", 5000, 'loading');
    }

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

  /*/
  async onExternalSettingsChange(): Promise<void> {
    console.log('onExternalSettingsChange');
    await this.loadSettings();
  }
  /**/

  async newLanguageSelectPlayground(res:{title: string, markup: string, style: string, twcss: boolean, windicss: boolean, unocss: boolean, lightningcss: boolean, script: string, processor: string}) {
    if (res.title?.length === 0) {
      return;
    }
    let newPlayground:Partial<config> = blankPlayground;

    newPlayground.markup.language = res.markup;
    newPlayground.markup.content = '';
    newPlayground.style.language = res.style;
    newPlayground.style.content = '';
    newPlayground.script.language = res.script;
    newPlayground.script.content = '';

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
      showNotice("New playground saved as: " + this.settings.playgroundFolder+'/'+res.title + ".json", 3000, 'success');
    } catch (error) {
      showNotice(this.settings.playgroundFolder+'/'+res.title + ".json - " + error + " Click this message to dismiss.", 0, 'error');
    }
  }

  async newLivecodesPlayground(fromMenu:boolean = false, file:TFile|TFolder|null) {
    await saveAsModal(this.app, "New livecodes playground", "Save as:", "", "e.g. New Playground", false)
      .then(async (fName:string) => {
        if (fName?.length === 0) {
          return;
        }
        let newPlayground:Partial<config> = blankPlayground;
        if (fromMenu && file !== null && (file instanceof TFile || file instanceof TFolder)) {
          let foundMarkup: boolean = false;
          let foundStyle: boolean = false;
          let foundScript: boolean = false;
          let newMarkupFile: string = '';
          let newMarkupExtension: string = '';
          let newStyleFile: string = '';
          let newStyleExtension: string = '';
          let newScriptFile: string = '';
          let newScriptExtension: string = '';
          if (file instanceof TFile) {
            let fileExt:string = file.extension;
            foundMarkup = fileExt === 'html' || fileExt === 'mdx' || fileExt === 'astro';
            foundStyle = fileExt === 'css' || fileExt === 'scss';
            foundScript = fileExt === 'js' || fileExt === 'jsx' || fileExt === 'tsx' || fileExt === 'ts' || fileExt === 'svelte';
            if (fileExt === 'html' || fileExt === 'mdx' || fileExt === 'astro') {
              newMarkupExtension = fileExt;
            }
            else if (fileExt === 'css' || fileExt === 'scss') {
              newStyleExtension = fileExt;
            }
            else if (fileExt === 'js' || fileExt === 'jsx' || fileExt === 'tsx' || fileExt === 'ts' || fileExt === 'svelte') {
              newScriptExtension = fileExt;
            }
          } else if (file instanceof TFolder) {
            file.children.forEach((f:TFile) => {
              if (f.extension === 'html' || f.extension === 'mdx' || f.extension === 'astro') {
                newMarkupFile = normalizePath(f.path);
                newMarkupExtension = f.extension;
                foundMarkup = true;
              }
              if (f.extension === 'css' || f.extension === 'scss') {
                newStyleFile = normalizePath(f.path);
                newStyleExtension = f.extension;
                foundStyle = true;
              }
              if (
                f.extension === 'js' ||
                f.extension === 'jsx' ||
                f.extension === 'tsx' ||
                f.extension === 'ts' ||
                f.extension === 'svelte'
              ) {
                newScriptFile = normalizePath(f.path);
                newScriptExtension = f.extension;
                foundScript = true;
              }
            });
          }
          newPlayground.markup.language = 'html';
          newPlayground.markup.content = '';
          newPlayground.style.language = 'css';
          newPlayground.style.content = '';
          newPlayground.script.language = 'javascript';
          newPlayground.script.content = '';

          if (foundMarkup) {
            let f: TFile = file instanceof TFolder ? this.app.vault.getFileByPath(newMarkupFile)! : this.app.vault.getFileByPath(file.path)!;
            let code = await this.app.vault.read(f)
            newPlayground.markup.content = code;
            newPlayground.markup.language = newMarkupExtension;
          }
          if (foundStyle) {
            let f: TFile = file instanceof TFolder ? this.app.vault.getFileByPath(newStyleFile)! : this.app.vault.getFileByPath(file.path)!;
            let code = await this.app.vault.read(f)
            newPlayground.style.content = code;
            newPlayground.style.language = newStyleExtension;
          }
          if (foundScript) {
            let f: TFile = file instanceof TFolder ? this.app.vault.getFileByPath(newScriptFile)! : this.app.vault.getFileByPath(file.path)!;
            let code = await this.app.vault.read(f)
            newPlayground.script.content = code;
            newPlayground.script.language = newScriptExtension;
          }
        }
        else {
          newPlayground.markup.content = '';
          newPlayground.style.content = '';
          newPlayground.script.content = '';
          newPlayground.markup.language = this.settings.quickPlaygroundMarkup || '';
          newPlayground.style.language = this.settings.quickPlaygroundStyle || '';
          newPlayground.script.language = this.settings.quickPlaygroundScript || '';
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
          showNotice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json", 3000, 'success');
        } catch (error) {
          showNotice(this.settings.playgroundFolder+'/'+fName + ".json - " + error + " Click this message to dismiss.", 0, 'error');
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
          showNotice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json", 3000, 'success');
        } catch (error) {
          showNotice(this.settings.playgroundFolder+'/'+fName + ".json - " + error + " Click this message to dismiss.", 0, 'error');
        }
      });

  };

  async newLivecodesPlaygroundFromCodeblock(language: string, code: string) {
    await saveAsModal(this.app, "New livecodes playground", "Save as:", "", "e.g. New Playground", false)
      .then(async (fName:string) => {
        if (fName?.length === 0) {
          return;
        }
        let newPlayground = blankPlayground;
        let foundMarkup: boolean = false;
        let foundStyle:  boolean = false;
        let foundScript: boolean = false;

        codeBlockLanguages().markup.forEach((l) => {
          if (l.name === language) {
            foundMarkup = true;
            return;
          }
        });
        codeBlockLanguages().style.forEach((l) => {
          if (l.name === language) {
            foundStyle = true;
            return;
          }
        });
        codeBlockLanguages().script.forEach((l) => {
          if (l.name === language) {
            foundScript = true;
            return;
          }
        });

        if (foundMarkup) {
          newPlayground.style.content = '';
          newPlayground.style.language = 'css';
          newPlayground.script.content = '';
          newPlayground.script.language = 'javascript';
          newPlayground.markup.content = code;
          newPlayground.markup.language = language;
          newPlayground.activeEditor = 'markup';
        }
        if (foundStyle) {
          newPlayground.markup.content = '';
          newPlayground.markup.language = 'html';
          newPlayground.script.language = 'javascript';
          newPlayground.script.content = '';
          newPlayground.style.content = code;
          newPlayground.style.language = language;
          newPlayground.activeEditor = 'style';
          if (
            language === 'tailwindcss' ||
            language === 'unocss' ||
            language === 'windicss' ||
            language === 'lightningcss'
          ) {
            let processors = [];
            processors.push(language);;
            newPlayground.processors = processors as unknown as string;
            if (language === 'tailwindcss') {
              newPlayground.style.content = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n" + code;
              newPlayground.style.language = "tailwindcss";
            }
          }
        }
        if (foundScript) {
          newPlayground.markup.content = '';
          newPlayground.markup.language = 'html';
          newPlayground.style.content = '';
          newPlayground.style.language = 'css';
          newPlayground.script.content = code;
          newPlayground.script.language = language;
          newPlayground.activeEditor = 'script';
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
          showNotice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json", 3000, 'success');
        } catch (error) {
          showNotice(this.settings.playgroundFolder+'/'+fName + ".json - " + error + " Click this message to dismiss.", 0, 'error');
        }
        /**/
      });
  };

  async newLivecodesPlaygroundFromCodeblocks() {
    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view?.file) {
      let fCache = this.app.metadataCache.getFileCache(view.file);
      let cnf:Partial<config> = {markup:{content:'',language:''},style:{content:'',language:''},script:{content:'',language:''},};
      let cacheRead = await this.app.vault.cachedRead(view?.file);
      let codeSections = fCache?.sections?.filter( (section) => section.type === "code" ) || [];
      for (let section of codeSections) {
        let start = section.position.start.offset;
        let end = section.position.end.offset;
        let extracted = cacheRead.substring(start, end);
        let rows = extracted.split("\n").filter((row) => row.length > 0);
        let codeLanguage:string = rows[0].replace("```", "");
        let code = extracted.replace(/^(.*)\n/,'').replace(/\n.*$/,'').trim();
        if (codeLanguage === 'html' || codeLanguage === 'mdx' || codeLanguage === 'astro') {
          cnf.markup.content = code;
          cnf.markup.language = codeLanguage;
          cnf.activeEditor = 'markup';
        }
        if (codeLanguage === 'css' || codeLanguage === 'scss') {
          cnf.style.content = code;
          cnf.style.language = codeLanguage;
        }
        if (codeLanguage === 'javascript' || codeLanguage === 'js' || codeLanguage === 'jsx' || codeLanguage === 'tsx' || codeLanguage === 'ts' || codeLanguage === 'typescript' || codeLanguage === 'svelte') {
          cnf.script.content = code;
          if (codeLanguage === 'js' || codeLanguage === 'ts') {
            cnf.script.language = codeLanguage === 'js' ? 'javascript' : 'typescript';
          }
          else {
            cnf.script.language = codeLanguage;
          }
        }
      }

      let codeSource = fCache?.frontmatter?.source || null;

      await saveAsModal(this.app, "New livecodes playground", "Save as:", view.file.name.replace(".md", ""), "e.g. New Playground", false)
      .then(async (fName:string) => {
        if (fName?.length === 0) {
          return;
        }
        let newPlayground:Partial<config> = {...blankPlayground, ...cnf};
        if (codeSource) {
          newPlayground.description = 'Source: ' + codeSource;
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
          showNotice("New playground saved as: " + this.settings.playgroundFolder+'/'+fName + ".json", 3000, 'success');
        } catch (error) {
          showNotice(this.settings.playgroundFolder+'/'+fName + ".json - " + error + " Click this message to dismiss.", 0, 'error');
        }
      });
    }
  };

  async copyStringToClipboard(text:string, topic:string|undefined=undefined) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        showNotice((topic !== undefined ? topic + " " : "Text ") + "copied to clipboard", 2500, 'success');
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

  onClickCodeblock(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let nodeType = target.localName;
    if (nodeType !== 'code' && !(target.parentElement instanceof HTMLPreElement)) {
      return;
    }
    let lang = 'text';
    let LANG_REGEX = /^language-/;
    target.classList.forEach((val, key) => {
      if (LANG_REGEX.test(val)) {
        lang = val.replace(`language-`, '');
        return;
      }
    });
    let menu = new Menu();
    if (ALLOWED_LANGS.includes(lang)) {
      menu.addItem((item: MenuItem) =>
        item
          .setIcon("code")
          .setTitle("Open in Livecodes")
          .onClick(async (ele) => {
            let code:string = '';
            if (nodeType === 'code') {
              code = target.textContent!;
            } else {
              code = target.firstChild?.textContent!;
            }
            await this.newLivecodesPlaygroundFromCodeblock(lang, code);
          })
      );
    }

    let offset = 0;
    menu.showAtPosition({
      x: event.pageX + offset,
      y: event.pageY + offset,
    });
    this.app.workspace.trigger("html-contextmenu:contextmenu", menu);
  }

}

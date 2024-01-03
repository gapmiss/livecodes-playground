import { Plugin, PluginManifest, DataAdapter, TFile, Notice, normalizePath, TFolder } from "obsidian";
import { PlaygroundView, VIEW_TYPE_PLAYGROUND } from "./views/playground";
import { ProjectView, VIEW_TYPE_PROJECT } from "./views/project";
import { LivecodesSettingsTab } from './settings';
import { TemplateSelectModal } from "./modals/template-select-modal";
import { CodeblockRenderChild } from "./views/codeblock";
import { HeadlessRenderChild } from "./views/headless";

//@ts-ignore
import { EmbedOptions, config } from "livecodes";

import {
	Parameters,
} from "./types";

interface LivecodesSettings {
	templateFolder: string;
	appUrl: string;
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
	delay: number;
	template: TFile | undefined;
	dataHeight: any;
	projectOptions: Partial<config>;
}

const DEFAULT_SETTINGS: LivecodesSettings = {
	templateFolder: "livecodes",
	appUrl: "https://v19.livecodes.io/",
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
	delay: 1500,
	template: undefined,
	dataHeight: "300",
	projectOptions: {},
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
	delay: number = 1500;
	d: any = new Date();
	template: TFile | undefined;
	dataHeight: string | undefined;
	logDebug: boolean = true;
	projectOptions: Partial<config>;

  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_PLAYGROUND,
      (leaf) => new PlaygroundView(this.app, leaf, this.settings.template, this.settings),
    );

    this.addRibbonIcon("code", "Playground: Open Template", async () => {
      new TemplateSelectModal(this).open();
    });

		this.addCommand({
			id: "open-template-select-modal",
			name: "Open template in playground",
			callback: async () => {
				new TemplateSelectModal(this).open();
			},
		});

		this.registerMarkdownCodeBlockProcessor(
			"playground",
			async (source, el, ctx) => {
				ctx.addChild(
					new CodeblockRenderChild(
						el,
						this.app,
						source,
						this.settings,
					)
				);
			}
		);

		this.registerMarkdownCodeBlockProcessor(
			"headless",
			async (source, el, ctx) => {
				ctx.addChild(
					new HeadlessRenderChild(
						el,
						this.app,
						source,
						this.settings,
					)
				);
			}
		);

		this.registerObsidianProtocolHandler("playground", async (e) => {
			const parameters = e as unknown as Parameters;
			// console.log('parameters');
			// console.log(parameters);
			// return;
			// let templatePath = this.settings.templateFolder + "/" + decodeURI(parameters.template as string);
			// console.log('templatePath');
			// console.log(templatePath);

			const f = this.app.vault.getAbstractFileByPath(parameters.tplPath!);
			if (f instanceof TFile) {
				this.settings.template = f;
				await this.saveSettings();
				// console.log(this.settings);
				await this.activateView();
			}
		});

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        const f = this.app.vault.getAbstractFileByPath(file.path);
        if (f instanceof TFile) {
          if (f.extension.toLowerCase() === "json" && f.path.contains(this.settings.templateFolder)) {
            menu.addItem((item) => {
              item
                .setTitle("Livecodes: Open this template")
                .setIcon("code")
                .onClick(async () => {
									// console.log('f');
									// console.log(f);
									this.settings.template = f;
									await this.saveSettings();
									await this.activateView();
                });
            });
            menu.addItem((item) => {
              item
                .setTitle("Livecodes: Copy markdown link")
                .setIcon("link")
                .onClick(async () => {
									// console.log('f');
									// console.log(f);
									let tplPath = normalizePath(f.path);
									await this.copyStringToClipboard("["+f.name+"](obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&tplPath="+encodeURIComponent(tplPath)+")");
                });
            });
            menu.addItem((item) => {
              item
                .setTitle("Livecodes: Copy Obsidian URL")
                .setIcon("link")
                .onClick(async () => {
									// console.log('f');
									// console.log(f);
									let tplPath = normalizePath(f.path);
									await this.copyStringToClipboard("obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&tplPath="+encodeURIComponent(tplPath));
                });
            });
          }
        }
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {


        const f = this.app.vault.getAbstractFileByPath(file.path);
				
				const ALLOWED_EXTS = ["html","css","js"];
				let showMenu = false;
        if (f instanceof TFolder && f.children.length <= 3) {
					f.children.forEach((f) => {
						let fileExt = f.name.split('.').pop();
						if (ALLOWED_EXTS.includes(fileExt as string)) {
							showMenu = true;
							return;
						}
					});
					if (showMenu) {
						let options:EmbedOptions = {
							config: undefined,
							appUrl: this.settings.appUrl,
							params: {
								autoupdate: this.settings.autoUpdate,
								delay: this.settings.delay,
								theme: this.settings.darkTheme ? "dark" : "light",
								fontFamily: this.settings.fontFamily,
								fontSize: Number(this.settings.fontSize),
								closeBrackets: this.settings.closeBrackets,
								trailingComma: this.settings.trailingComma,
								singleQuote: this.settings.singleQuote,
								semicolons: this.settings.semicolons,
								useTabs: this.settings.useTabs,
								tabSize: Number(this.settings.tabSize),
								console: "open", // or full
								lineNumbers: this.settings.lineNumbers,
								wordWrap: this.settings.wordWrap,
								editor: this.settings.editor,
								version: "19"
							},
							loading: "eager",
						};
						let htmlContent: any;
						let cssContent: any;
						let jsContent: any;
						let newConfig:Partial<config>;
            menu.addItem( (item) => {
              item
                .setTitle("Livecodes: Open this project")
                .setIcon("file-code-2")
                .onClick(async () => {
									f.children.forEach( async (child, index) => {
										let fileExt = child.name.split('.').pop();
										const c = this.app.vault.getAbstractFileByPath(child.path);
										let codeContent = await this.app.vault.read(c as TFile);
										if (fileExt === 'html') {
											htmlContent = codeContent;
											console.log('-----'+htmlContent);
										} else if (fileExt === 'css') {
											cssContent = codeContent;
											console.log('-----'+cssContent);
										} else {
											jsContent = codeContent;
											console.log('-----'+jsContent);
										}

										// switch (fileExt) {
										// 	case "html":
										// 		console.log('html '+codeContent);
										// 		htmlContent = codeContent;
										// 		break;
										// 	case "css":
										// 		console.log('css '+codeContent);
										// 		cssContent = codeContent;
										// 		break;
										// 	case "js":
										// 		console.log('js ' +codeContent);
										// 		jsContent = codeContent;
										// 		break;
										// }

										// console.log('newConfig');
										// console.log(newConfig);
										// options.config = newConfig;
										// console.log('options');
										// console.log(options);

										console.log(htmlContent);
										console.log(cssContent);
										console.log(jsContent);
										newConfig = {
											"markup": {
												"language": "html",
												"content": htmlContent
											},
											"style": {
												"language": "css",
												"content": cssContent
											},
											"script": {
												"language": "javascript",
												"content": jsContent
											},
										};


									});
									
									// console.log('options');
									// console.log(options);
									console.log('newConfig');
									console.log(newConfig);
									// options.config = newConfig;
									this.settings.template = undefined;
									this.settings.projectOptions = newConfig;
									// console.log('this.projectOptions');
									// console.log(this.projectOptions);
									await this.saveSettings();
									await this.activateView();
									// await this.openProjectView();
                });
            });
					}
        }
      })
    );

    this.addSettingTab(new LivecodesSettingsTab(this.app, this));

    this.state = "loaded";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
  }

  onunload() {
    this.state = "unloaded";
		this.app.workspace.getLeavesOfType(VIEW_TYPE_PLAYGROUND).forEach((leaf) => {
			if (leaf.view instanceof PlaygroundView) {
				leaf.detach();
			}
		});
		// this.app.workspace.getLeavesOfType(VIEW_TYPE_TOGGL).forEach((leaf) => leaf.detach());
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
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

  async openProjectView() {
		new Notice("Loading project…", 5000);

    await this.app.workspace.getLeaf(true).setViewState({
      type: VIEW_TYPE_PROJECT,
      active: true,
    });

    const leaf = this.app.workspace.getMostRecentLeaf();
		// console.log('leaf');
		// console.log(leaf);
    if (leaf?.view instanceof ProjectView) {
	    this.app.workspace.revealLeaf(leaf);
		}
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  public async saveSettings() {
    await this.saveData(this.settings);
  }

  static foo() {
    return "bar";
  }

	static buildOptions() {

	}

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

}
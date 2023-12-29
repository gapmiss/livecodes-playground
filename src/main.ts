import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
  addIcon,
  PluginManifest,
  DataAdapter,
  TFile,
  Notice
} from "obsidian";

import { 
  LivecodesView, 
  VIEW_TYPE_LIVECODES 
} from "./views/livecodes";
import { LivecodesSettingsTab } from './settings';
import { TemplateSelectModal } from "./modals/template-select-modal";
import { PlaygroundRenderChild } from "./views/playground";
import { HeadlessRenderChild } from "./views/headless";

interface LivecodesSettings {
  varNumber: number;
  varString: string;
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
	delay: number;
	template: TFile | undefined;
	dataHeight: any;
  // myTemplate: string;
}

const DEFAULT_SETTINGS: LivecodesSettings = {
  varNumber: 3,
  varString: "Hello",
	templateFolder: "livecodes",
	appUrl: "https://livecodes.io/",
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
	delay: 1500,
	template: undefined,
	dataHeight: "300",
  // myTemplate: "",
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
	delay: number = 1500;
	d: any = new Date();
	template: TFile | undefined;
	dataHeight: string | undefined;
	logDebug: boolean = true;
  // myTemplate: string | undefined;

  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_LIVECODES,
      (leaf) => new LivecodesView(leaf, this.settings.template),
    );

    this.addRibbonIcon("code", "Playground: Open Template", async () => {
      new TemplateSelectModal(this).open();
      /*/
      const { workspace } = this.app;

      let leaf: WorkspaceLeaf | null = null;
      const leaves = workspace.getLeavesOfType(VIEW_TYPE_LIVECODES);

      if (leaves.length > 0) {
        leaf = leaves[0];
      } else {
        // leaf = workspace.getRightLeaf(false);
        leaf = workspace.getLeaf(false)
        await leaf.setViewState({ type: VIEW_TYPE_LIVECODES, active: true });
      }

      workspace.revealLeaf(leaf);
      /**/
    });

		this.registerMarkdownCodeBlockProcessor(
			"playground",
			async (source, el, ctx) => {
				ctx.addChild(
					new PlaygroundRenderChild(
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

    this.registerExtensions(["json"], "markdown");

    this.addSettingTab(new LivecodesSettingsTab(this.app, this));

    this.state = "loaded";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
  }

  onunload() {
    this.state = "unloaded";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
  }

  async activateView() {
		new Notice("Loading livecodes playground…", 5000);

    await this.app.workspace.getLeaf(true).setViewState({
      type: VIEW_TYPE_LIVECODES,
      active: true,
    });

    const leaf = this.app.workspace.getMostRecentLeaf();

    if (leaf?.view instanceof LivecodesView) {
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
    // console.log("foo() method");
    return "Consequat laborum labore in dolore ex voluptate consequat est proident eu deserunt.";
  }


	/**
	 * https://github.com/eoureo/obsidian-runjs/blob/master/src/main.ts#L1394
	 */
  async reload() {
    this.state = "start reloading";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
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


}

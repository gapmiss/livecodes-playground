import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
  addIcon,
  PluginManifest,
  DataAdapter
} from "obsidian";
import { SBPView, VIEW_TYPE_SBP } from "./view";
import SVELTE_ICON from "./util"

interface SBPSettings {
  varNumber: number;
  varString: string;
}

const DEFAULT_SETTINGS: SBPSettings = {
  varNumber: 3,
  varString: "Hello",
};


export default class SvelteBasePlugin extends Plugin {
  settings!: SBPSettings;
  manifest: PluginManifest;
  plugin: SvelteBasePlugin;
  public adapter: DataAdapter = this.app.vault.adapter;
  state: string = 'initial';

  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_SBP,
      (leaf) => new SBPView(leaf, this.settings.varNumber, this.settings.varString),
    );
    addIcon("svelte-icon", SVELTE_ICON);
    this.addRibbonIcon("svelte-icon", "svelte-base-plugin", async () => {
      const { workspace } = this.app;

      let leaf: WorkspaceLeaf | null = null;
      const leaves = workspace.getLeavesOfType(VIEW_TYPE_SBP);

      if (leaves.length > 0) {
        leaf = leaves[0];
      } else {
        // leaf = workspace.getRightLeaf(false);
        leaf = workspace.getLeaf(false)
        await leaf.setViewState({ type: VIEW_TYPE_SBP, active: true });
      }

      workspace.revealLeaf(leaf);
    });

    this.addSettingTab(new SBPSettingsTab(this.app, this));

    this.state = "loaded";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
  }

  onunload() {
    this.state = "unloaded";
    console.log("["+this.manifest.name, "v"+this.manifest.version+"]", this.state );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  static foo() {
    // console.log("foo() method");
    return "Consequat laborum labore in dolore ex voluptate consequat est proident eu deserunt.";
  }

}

class SBPSettingsTab extends PluginSettingTab {
  plugin: SvelteBasePlugin;

  constructor(app: App, plugin: SvelteBasePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("My number")
      // .setDesc("")
      .addText((text) =>
        text
          .setPlaceholder("My number")
          .setValue(this.plugin.settings.varNumber.toString())
          .onChange(async (value) => {
            this.plugin.settings.varNumber = parseInt(value || "33");
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("My String")
      // .setDesc("")
      .addText((text) =>
        text
          .setPlaceholder("My string")
          .setValue(this.plugin.settings.varString.toString())
          .onChange(async (value) => {
            this.plugin.settings.varString = value;
            await this.plugin.saveSettings();
          })
      );
  }
}

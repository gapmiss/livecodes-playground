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
  favoriteNumber: number;
  favoriteWord: string;
}

const DEFAULT_SETTINGS: SBPSettings = {
  favoriteNumber: 33,
  favoriteWord: "Hello",
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
      (leaf) => new SBPView(leaf, this.settings.favoriteNumber, this.settings.favoriteWord),
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
      .setName("Favorite number")
      .setDesc("What is your favorite number?")
      .addText((text) =>
        text
          .setPlaceholder("33 is the best number!")
          .setValue(this.plugin.settings.favoriteNumber.toString())
          .onChange(async (value) => {
            this.plugin.settings.favoriteNumber = parseInt(value || "33");
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Favorite word")
      .setDesc("What is your favorite word?")
      .addText((text) =>
        text
          .setPlaceholder("Hello is the best word!")
          .setValue(this.plugin.settings.favoriteWord.toString())
          .onChange(async (value) => {
            this.plugin.settings.favoriteWord = value;
            await this.plugin.saveSettings();
          })
      );
  }
}

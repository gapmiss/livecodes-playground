import LivecodesPlugin from "../main";
import {
  FuzzyMatch,
  FuzzySuggestModal,
  TFile,
  TFolder,
  Vault
} from "obsidian";
import { showNotice } from '../utils/notice';

export class PlaygroundSelectModal extends FuzzySuggestModal<TFile> {
  plugin: LivecodesPlugin;
  vault: Vault;

  constructor(plugin: LivecodesPlugin) {
    super(plugin.app);
    this.plugin = plugin;
    this.vault = plugin.app.vault;
    this.containerEl.addClass("playground-select-modal");
    this.setPlaceholder("Select a playground or type to search");
  }

  getItems(): TFile[] {
    const playgroundFolder = this.plugin.settings.playgroundFolder;
    const folder = this.vault.getAbstractFileByPath(playgroundFolder);
    if (!folder || !(folder instanceof TFolder)) {
      showNotice("Error: "+playgroundFolder+" is not a valid folder in the plugin settings. Click this message to dismiss.", 0, 'error');
      this.close();
      return [];
    }
    return this.getPlaygroundsInFolder(folder);
  }

  getItemText(item: TFile): string {
    let regex = new RegExp(this.plugin.settings.playgroundFolder+"\/", "g");
    return item.path.replace(regex, "").replace(".json", "");
  }

  renderSuggestion(match: FuzzyMatch<TFile>, el: HTMLElement) {
    super.renderSuggestion(match, el);
  }

  async onChooseItem(f: TFile) {
    if (f.path) {
      this.plugin.settings.jsonTemplate = f;
      this.plugin.saveSettings();
      await this.plugin.activatePlaygroundView();
      return Promise.resolve;
    } else {
      console.log(`Invalid file path: ${f.path}`);
      return Promise.reject;
    }
  }

  private getPlaygroundsInFolder(folder: TFolder): TFile[] {
    let files: TFile[] = [];
    Vault.recurseChildren(folder, (file) => {
      if (file instanceof TFile && file.extension === 'json') {
        files.push(file);
      }
    });
    return files.sort( (a: { name: string; },b: { name: string; }) => {
      return a.name.localeCompare(b.name);
    });
  }

}

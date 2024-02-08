import { type App, ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile } from 'obsidian';
// @ts-ignore
// import { config } from 'livecodes';
import LivecodesPlugin from '../main';
import Component from "../components/Search.svelte";

export const VIEW_TYPE_SEARCH = "Livecodes-search-view";

export class LivecodesSearchView extends ItemView {
  plugin: LivecodesPlugin;
  component: Component;
  // jsonTemplate: TFile | undefined;
  adapter: FileSystemAdapter;

  constructor(
    app: App,
    leaf: WorkspaceLeaf, 
    // jsonTemplate: TFile|undefined,
    private settings: any,
  ) {
    super(leaf);
    // this.jsonTemplate = jsonTemplate;
    this.adapter = this.app.vault.adapter as FileSystemAdapter;
  }

  getViewType() {
    return VIEW_TYPE_SEARCH;
  }

  getDisplayText() {
    // let fileName = this.jsonTemplate?.path
    //   .substring(
    //     this.jsonTemplate?.path.lastIndexOf("/") + 1, 
    //     this.jsonTemplate?.path.length
    //   ).replace(
    //     ".json",
    //     ""
    //   );
    return "Livecodes Search ";
  }

  getIcon(): string {
    return "search-code";
  }

  async onOpen() {
    if (this.contentEl) {
      this.contentEl.empty();
    }
  


    this.component = new Component({
      target: this.contentEl,
      props: {
        // jsonTemplate: newTemplate,
        // tplPath: tplPath!
      },
    });

  }

  async onClose() {
    this.component.$destroy();
  }
}

import { type App, ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile } from 'obsidian';
// @ts-ignore
import { config } from 'livecodes';
import LivecodesPlugin from '../main';
import Component from "../components/Playground.svelte";

export const VIEW_TYPE_PLAYGROUND = "Livecodes-view";

export class PlaygroundView extends ItemView {
  plugin: LivecodesPlugin;
  component: Component;
  jsonTemplate: TFile | undefined;
  adapter: FileSystemAdapter;

  constructor(
    app: App,
    leaf: WorkspaceLeaf, 
    jsonTemplate: TFile|undefined,
    private settings: any,
  ) {
    super(leaf);
    this.jsonTemplate = jsonTemplate;
    this.adapter = this.app.vault.adapter as FileSystemAdapter;
  }

  getViewType() {
    return VIEW_TYPE_PLAYGROUND;
  }

  getDisplayText() {
    let fileName = this.jsonTemplate?.path
      .substring(
        this.jsonTemplate?.path.lastIndexOf("/") + 1, 
        this.jsonTemplate?.path.length
      ).replace(
        ".json",
        ""
      );
    return "Livecodes / "+fileName;
  }

  getIcon(): string {
    return "code";
  }

  async onOpen() {
    if (this.contentEl) {
      this.contentEl.empty();
    }
  
    let foundTemplate: boolean = (this.jsonTemplate !== undefined);
    
    let tplPath = this.jsonTemplate?.path;
    let tpl = await this.adapter.read(tplPath!);
    let newTemplate: Partial<config> = JSON.parse(tpl) as Partial<config>;
    
    if (foundTemplate) {
      let tplPath = normalizePath((this.jsonTemplate!).path);
      let tpl = await this.adapter.read(tplPath);
      newTemplate = JSON.parse(tpl) as Partial<config>;
    }

    this.component = new Component({
      target: this.contentEl,
      props: {
        jsonTemplate: newTemplate,
        tplPath: tplPath!
      },
    });

  }

  async onClose() {
    this.component.$destroy();
  }
}

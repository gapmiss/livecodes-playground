import { type App, ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile } from 'obsidian';
// @ts-ignore
import { config } from 'livecodes';
import LivecodesPlugin from '../main';
import Component from "../components/Playground.svelte";

export const VIEW_TYPE_PLAYGROUND = "Livecodes-view";

export class PlaygroundView extends ItemView {
	plugin: LivecodesPlugin;
  component: Component;
  template: TFile | undefined;
	adapter: FileSystemAdapter;

  constructor(
    app: App,
    leaf: WorkspaceLeaf, 
    template: TFile|undefined,
    private settings: any,
  ) {
    super(leaf);
    this.template = template;
		this.adapter = this.app.vault.adapter as FileSystemAdapter;
  }

  getViewType() {
    return VIEW_TYPE_PLAYGROUND;
  }

  getDisplayText() {
    return "Livecodes";
  }

  getIcon(): string {
    return "code";
  }

  async onOpen() {
		if (this.contentEl) {
			this.contentEl.empty();
		}
    console.log('this.template');
    console.log(this.template);
    let foundTemplate: boolean = (this.template !== undefined);
    
		let tplPath = this.template?.path;
		let newTemplate: Partial<config>;
		let tpl = await this.adapter.read(tplPath!);
		newTemplate = JSON.parse(tpl) as Partial<config>;
		console.log('foundTemplate');
		console.log(foundTemplate);
    if (foundTemplate) {
			let tplPath = normalizePath((this.template!).path);
      let tpl = await this.adapter.read(tplPath);
      newTemplate = JSON.parse(tpl) as Partial<config>;
    }

    this.component = new Component({
      target: this.contentEl,
      props: {
        template: newTemplate,
        tplPath: tplPath!
      },
    });

  }

  async onClose() {
    this.component.$destroy();
  }
}
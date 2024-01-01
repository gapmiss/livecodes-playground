import { type App, ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile } from 'obsidian';
import LivecodesPlugin from '../main';
import Component from "../components/Livecodes.svelte";

// @ts-ignore
import { config } from 'livecodes';



export const VIEW_TYPE_LIVECODES = "Livecodes-view";

export class LivecodesView extends ItemView {

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
    return VIEW_TYPE_LIVECODES;
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
    console.log(this.template);
    let foundTemplate: boolean = (this.template !== undefined);
    console.log('foundTemplate');
    console.log(foundTemplate);
    // let newTemplate: Partial<config>;

    // let part:string = this.source.trim().substring(2);
		// let content:string = part.substring(part.length-2,0).trim();
    // console.log('this.plugin');
    // console.log(this.plugin);
    // return;
		let tplPath = this.template?.path;
		// let tplPath = this.settings.templateFolder + "/" + this.template?.path;
		let newTemplate: Partial<config>;

		// let tplPath:string|undefined;
		let tpl = await this.adapter.read(tplPath!);
		newTemplate = JSON.parse(tpl) as Partial<config>;


    
		
    if (foundTemplate) {
      console.log('ssssssss');
			let tplPath = normalizePath((this.template!).path);
      console.log('----tplPath');
      console.log(tplPath);
      let tpl = await this.adapter.read(tplPath);
      newTemplate = JSON.parse(tpl) as Partial<config>;
    }
    console.log('tplPath');
    console.log(tplPath);
    // return;
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

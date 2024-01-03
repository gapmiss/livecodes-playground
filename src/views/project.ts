import { type App, ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile } from 'obsidian';
// @ts-ignore
import { config } from 'livecodes';
import LivecodesPlugin from '../main';
import Component from "../components/Project.svelte";

export const VIEW_TYPE_PROJECT = "Project-view";

export class ProjectView extends ItemView {
	plugin: LivecodesPlugin;
  component: Component;
  projectOptions: Partial<config>;
	adapter: FileSystemAdapter;

  constructor(
    app: App,
    leaf: WorkspaceLeaf, 
    projectOptions: Partial<config>,
    private settings: any,
  ) {
    super(leaf);
    this.projectOptions = settings.projectOptions;
		this.adapter = this.app.vault.adapter as FileSystemAdapter;
  }

  getViewType() {
    return VIEW_TYPE_PROJECT;
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
		console.log('got here');
    // console.log('this.template');
    // console.log(this.template);
    // let foundTemplate: boolean = (this.template !== undefined);
		// let tplPath = this.template?.path;
		// let newTemplate: Partial<config>;
		// let tpl = await this.adapter.read(tplPath!);
		// newTemplate = JSON.parse(tpl) as Partial<config>;
		// 
    // if (foundTemplate) {
		// 	let tplPath = normalizePath((this.template!).path);
    //   let tpl = await this.adapter.read(tplPath);
    //   newTemplate = JSON.parse(tpl) as Partial<config>;
    // }

    this.component = new Component({
      target: this.contentEl,
      props: {
        projectOptions: this.projectOptions,
        // tplPath: tplPath!
      },
    });

  }

  async onClose() {
    this.component.$destroy();
  }
}

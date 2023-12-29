import { ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile, Notice, DataAdapter } from 'obsidian';
import LivecodesPlugin from "../main";

// @ts-ignore
import { config } from 'livecodes';

import Component from "../components/Livecodes.svelte";

export const VIEW_TYPE_LIVECODES = "Livecodes-view";

export class LivecodesView extends ItemView {
	plugin: LivecodesPlugin;
  component: Component;
  template: TFile | undefined;
	adapter: FileSystemAdapter;

  constructor(leaf: WorkspaceLeaf, template: TFile|undefined) {
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
    let foundTemplate: boolean = (this.template !== undefined);
    let newTemplate: Partial<config>;
		let tplPath: string|undefined;
    if (foundTemplate) {
			let tplPath = normalizePath((this.template!).path);
      let tpl = await this.adapter.read(tplPath);
      newTemplate = JSON.parse(tpl) as Partial<config>;
    }

    this.component = new Component({
      target: this.contentEl,
      props: {
        myTemplate: newTemplate,
        myTemplatePath: tplPath,
      },
    });
  }

  async onClose() {
    this.component.$destroy();
  }
}

/**
 * from: https://github.com/Obsidian-TTRPG-Community/TTRPG-Community-Admin/
 */
async function copyStringToClipboard(text:string, topic:string|undefined=undefined) {
  navigator.clipboard
      .writeText(text)
      .then(function () {
          new Notice((topic !== undefined ? topic + " " : "") + "Copied to clipboard", 2500);
      })
      .catch(function (error) {
          console.error('Failed to copy to clipboard: ', error)
      })
}
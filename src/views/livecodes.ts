import { ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile, Notice, DataAdapter } from 'obsidian';
import LivecodesPlugin from "../main";
import { openPromptModal } from "../modals/prompt-modal";
// @ts-ignore
import { config } from 'livecodes';

import Component from "../components/Livecodes.svelte";

export const VIEW_TYPE_LIVECODES = "Livecodes-view";

export class LivecodesView extends ItemView {
	plugin: LivecodesPlugin;
  component: Component;
  // varNumber: number;
  template: string | null;
	adapter: FileSystemAdapter;

  constructor(leaf: WorkspaceLeaf, template: string|null) {
    super(leaf);
    // this.varNumber = varNumber;
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
		// return;
    let foundTemplate: boolean = (this.template !== null);
    let newTemplate: Partial<config>;
    if (foundTemplate) {
      let tpl = await this.adapter.read(normalizePath((this.template as unknown as TFile).path));
      newTemplate = JSON.parse(tpl) as Partial<config>;
    }

    this.component = new Component({
      target: this.contentEl,
      props: {
        // myNumber: this.varNumber,
        myTemplate: newTemplate,
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
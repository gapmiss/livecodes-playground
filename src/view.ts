import { ItemView, WorkspaceLeaf } from "obsidian";
import Component from "./Components/Component.svelte";

export const VIEW_TYPE_SBP = "SBP-view";

export class SBPView extends ItemView {
  component: Component;
  varNumber: number;
  varString: string;

  constructor(leaf: WorkspaceLeaf, varNumber: number, varString: string) {
    super(leaf);
    this.varNumber = varNumber;
    this.varString = varString;
  }

  getViewType() {
    return VIEW_TYPE_SBP;
  }

  getDisplayText() {
    return "Svelte Base Plugin";
  }

  getIcon(): string {
    return "svelte-icon";
  }

  async onOpen() {
    this.component = new Component({
      target: this.contentEl,
      props: {
        myNumber: this.varNumber,
        myString: this.varString,
      },
    });
  }

  async onClose() {
    this.component.$destroy();
  }
}
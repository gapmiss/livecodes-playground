import { ItemView, WorkspaceLeaf } from "obsidian";
import Component from "./Components/Component.svelte";

export const VIEW_TYPE_SBP = "SBP-view";

export class SBPView extends ItemView {
  component: Component;
  favoriteNumber: number;
  favoriteWord: string;

  constructor(leaf: WorkspaceLeaf, favoriteNumber: number, favoriteWord: string) {
    super(leaf);
    this.favoriteNumber = favoriteNumber;
    this.favoriteWord = favoriteWord;
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
        myNumber: this.favoriteNumber,
        myString: this.favoriteWord,
      },
    });
  }

  async onClose() {
    this.component.$destroy();
  }
}
import { type App, ItemView, WorkspaceLeaf, FileSystemAdapter, normalizePath, TFile } from 'obsidian';
import 'svelte';
import LivecodesPlugin from '../main';
import Component from "../components/Search.svelte";

export const VIEW_TYPE_PLAYGROUND_SEARCH = "livecodes-search-view";

export class LivecodesSearchView extends ItemView {
  plugin: LivecodesPlugin;
  component: Component;
  adapter: FileSystemAdapter;

  constructor(
    app: App,
    leaf: WorkspaceLeaf, 
    private settings: any,
  ) {
    super(leaf);
    this.adapter = this.app.vault.adapter as FileSystemAdapter;
  }

  getViewType() {
    return VIEW_TYPE_PLAYGROUND_SEARCH;
  }

  getDisplayText() {
    return "Playground search ";
  }

  getIcon(): string {
    return "search-code";
  }

  async onOpen() {
    if (this.contentEl) {
      this.contentEl.empty();
    }

    this.component = new Component({
      target: this.contentEl
    });

  }

  async onClose() {
    this.component.$destroy();
  }
}
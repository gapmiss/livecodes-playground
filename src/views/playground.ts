import { type App, ItemView, WorkspaceLeaf, normalizePath, TFile, Menu } from 'obsidian';
import 'svelte';
// @ts-ignore
import { config } from 'livecodes';
import LivecodesPlugin from '../main';
import Component from "../components/Playground.svelte";

export const VIEW_TYPE_PLAYGROUND = "Livecodes-view";

export class PlaygroundView extends ItemView {
  plugin: LivecodesPlugin;
  component: Component;
  jsonTemplate: TFile | undefined;

  constructor(
    app: App,
    leaf: WorkspaceLeaf, 
    jsonTemplate: TFile|undefined,
    private settings: any,
  ) {
    super(leaf);
    this.jsonTemplate = jsonTemplate;
  }

  getViewType() {
    return VIEW_TYPE_PLAYGROUND;
  }

  getDisplayText() {
    if (this.jsonTemplate === undefined) {
      return 'Plugin no longer active';
    }
    let fileName = this.jsonTemplate?.path
      .substring(
        this.jsonTemplate?.path.lastIndexOf("/") + 1, 
        this.jsonTemplate?.path.length
      ).replace(
        ".json",
        ""
      )
      .replace(
        this.settings.playgroundFolder + "/",
        ""
      );
    return `${fileName}`; // return "<Livecodes> "+fileName;
  }

  getIcon(): string {
    return "code";
  }

  async onOpen() {
    if (this.contentEl) {
      this.contentEl.empty();
    }
    
    let foundTemplate: boolean = (this.jsonTemplate !== undefined);
    if (!foundTemplate) {
      return;
    }
    
    let playgroundPath: string = normalizePath((this.jsonTemplate!).path);
    let fPath: TFile = this.app.vault.getFileByPath(playgroundPath)!;
    let tpl: string = await this.app.vault.read(fPath);
    let newTemplate: Partial<config> = JSON.parse(tpl) as Partial<config>;
    this.component = new Component({
      target: this.contentEl,
      props: {
        jsonTemplate: newTemplate,
        playgroundPath: playgroundPath!
      },
    });

  }

  async onClose() {
    this.component.$destroy();
  }

  /**
   * https://github.com/zsviczian/obsidian-excalidraw-plugin/blob/146d04ea6486df84897bb1dc1b525affd691f042/src/ExcalidrawView.ts#L1124
   */
  onResize() {
    // console.log('--------- playground view onResize ---------');
  }

  onPaneMenu(menu: Menu, source: 'more-options' | 'tab-header' | string): void {
    // menu.addItem((item) => {
    //   item.setTitle('Do something');
    //   item.setSection('action');
    //   item.onClick(
    //     async (e) => {
    //       console.log(this);
    //       console.log(e);
    //     }
    //   )
    // });
    menu.hide();
    // super.onPaneMenu(menu, source);
  }

}

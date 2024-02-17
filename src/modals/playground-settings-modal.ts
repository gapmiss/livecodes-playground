import { App, Modal, Setting, ButtonComponent } from "obsidian";
import LivecodesPlugin from '../main';
import Tags from "../components/Tags.svelte";

type PlaygroundSettingsCallback = (text: string | null) => void;

export class PlaygroundSettingsModal extends Modal {
  plugin: LivecodesPlugin;
  title: string | null;
  changes: {title: string, description: string, tags: string[], head: string, htmlAttrs: string};
  callback: PlaygroundSettingsCallback;

  constructor(
    app: App,
    plugin: LivecodesPlugin,
    title: string | null,
    changes: {title: string, description: string, tags: string[], head: string, htmlAttrs: string},
    callback: PlaygroundSettingsCallback,
  ) {
    super(app);
    this.plugin = plugin;
    this.title = title;
    this.changes = changes;
    this.callback = callback;
  }

  onOpen() {
    const { contentEl } = this;
    this.contentEl.addClass("livecodes-editor-settings-modal");
    contentEl.empty();
    if (this.title) this.titleEl.setText(this.title);

    new Setting(this.contentEl)
      .setName('Title')
      .setClass("title-setting")
      .addText(text =>
        text
        .setValue(this.changes.title)
        .onChange(async newTitleSetting => {
          this.changes.title = newTitleSetting;
        })
      );

    new Setting(this.contentEl)
      .setName('Description')
      .setClass("description-setting")
      .addTextArea(text =>
        text
        .setValue(this.changes.description)
        .onChange(async newDescriptionSetting => {
          this.changes.description = newDescriptionSetting;
        })
      );

    new Tags({
      target: contentEl,
      props: {changes: this.changes},
    }); 

    new Setting(this.contentEl)
      .setName('<head>')
      .setDesc('Content for <head> element')
      .setClass("head-setting")
      .addTextArea(text =>
        text
        .setValue(this.changes.head)
        .onChange(async newHeadSetting => {
          this.changes.head = newHeadSetting;
        })
      );

    new Setting(this.contentEl)
      .setName('<html> Attrs')
      .setDesc('Attributes for <html> element.')
      .setClass("htmlattrs-setting")
      .addTextArea(text =>
        text
        .setValue(this.changes.htmlAttrs)
        .onChange(async newHtmlAttrsSetting => {
          this.changes.htmlAttrs = newHtmlAttrsSetting;
        })
      ); 

    const buttonDiv = contentEl.createDiv({
        cls: "modal-button-container",
    });

    new ButtonComponent(buttonDiv)
      .setButtonText("Update")
      .setCta()
      .onClick(() => {
        this.onOK();
      })
      .setCta();

    new ButtonComponent(buttonDiv).setButtonText("Cancel").onClick(() => {
      this.close();
    });
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }

  onOK() {
    this.callback(JSON.stringify(this.changes));
    this.close();
  }
}

export async function openPlaygroundSettingsModal(
  app: App,
  plugin: LivecodesPlugin,
  title: string | null,
  changes: {title: string, description: string, tags: string[], head: string, htmlAttrs: string},
  callback?: PlaygroundSettingsCallback
): Promise<any[] | null> {
  return await new Promise((resolve, reject) => {
    new PlaygroundSettingsModal(
      app,
      plugin,
      title,
      changes,
      callback ??
        ((text: any | null) => {
          resolve(text);
        })
    ).open();
  });
}

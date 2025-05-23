import { App, Modal, Setting, ButtonComponent, setIcon } from "obsidian";
import 'svelte';
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
          this.changes.title = newTitleSetting.trim();
        })
      );

    new Setting(this.contentEl)
      .setName('Description')
      .setClass("description-setting")
      .addTextArea(text =>
        text
        .setValue(this.changes.description)
        .onChange(async newDescriptionSetting => {
          this.changes.description = newDescriptionSetting.trim();
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
          this.changes.head = newHeadSetting.trim();
        })
      );

    new Setting(this.contentEl)
      .setName('<html> Attrs')
      .setDesc('Attributes for <html> element')
      .setClass("htmlattrs-setting")
      .addTextArea(text =>
        text
        .setValue(this.changes.htmlAttrs)
        .onChange(async newHtmlAttrsSetting => {
          this.changes.htmlAttrs = newHtmlAttrsSetting.trim();
        })
      ); 
    
    let buttonDiv = contentEl.createDiv({cls: "modal-button-container"});
    let noticeDiv = buttonDiv.createDiv({cls: "modal-button-notice"});
    let noticeIcon = noticeDiv.createSpan({cls: "modal-button-notice-icon"});
    noticeIcon.setAttribute("aria-label", "Notice");
    let noticeText = noticeDiv.createSpan({cls: "modal-button-notice-text"});
    noticeText.textContent = "Updating these settings will reset the playground editor and clipboard history.";
    setIcon((noticeIcon), "alert-triangle");
    
    buttonDiv.appendChild(noticeDiv);

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

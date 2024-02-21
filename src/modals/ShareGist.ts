import { App, Modal, Setting, ButtonComponent, setIcon } from "obsidian";
import LivecodesPlugin from '../main';
import Tags from "../components/Tags.svelte";

type ShareGistCallback = (text: string | null) => void;

export class ShareGistModal extends Modal {
  plugin: LivecodesPlugin;
  title: string | null;
  changes: {includeLivecodesLink: boolean, includeHtmlFile: boolean, includeJsonFile: boolean, includeMarkdownFile: boolean};
  callback: ShareGistCallback;

  constructor(
    app: App,
    plugin: LivecodesPlugin,
    title: string | null,
    changes: {includeLivecodesLink: boolean, includeHtmlFile: boolean, includeJsonFile: boolean, includeMarkdownFile: boolean},
    callback: ShareGistCallback,
  ) {
    super(app);
    this.plugin = plugin;
    this.title = title;
    this.changes = {includeLivecodesLink: true, includeHtmlFile: true, includeJsonFile: true, includeMarkdownFile: true};
    this.callback = callback;
  }

  onOpen() {
    const { contentEl } = this;
    this.contentEl.addClass("livecodes-share-gist-modal");
    contentEl.empty();
    if (this.title) this.titleEl.setText(this.title);

    new Setting(contentEl)
    .setName('Playground link')
    .setDesc('Include link to open playground in Livecodes')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.includeLivecodesLink)
      .onChange(async newValue => {
        this.changes.includeLivecodesLink = newValue;
        checkIsDisabled();
      })
    );

    new Setting(contentEl)
    .setName('HTML file')
    .setDesc('Include HTML results file')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.includeHtmlFile)
      .onChange(async newValue => {
        this.changes.includeHtmlFile = newValue;
        checkIsDisabled();
      })
    );

    new Setting(contentEl)
    .setName('JSON file')
    .setDesc('Include JSON template file')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.includeJsonFile)
      .onChange(async newValue => {
        this.changes.includeJsonFile = newValue;
        checkIsDisabled();
      })
    );

    new Setting(contentEl)
    .setName('Markdown file')
    .setDesc('Include markdown file with frontmatter and fenced codeblocks')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.includeMarkdownFile)
      .onChange(async newValue => {
        this.changes.includeMarkdownFile = newValue;
        checkIsDisabled();
      })
    );

    let buttonDiv = contentEl.createDiv({cls: "modal-button-container"});
    let noticeDiv = buttonDiv.createDiv({cls: "modal-button-notice"});
    let noticeIcon = noticeDiv.createSpan({cls: "modal-button-notice-icon"});
    noticeIcon.setAttribute("aria-label", "Notice");
    let noticeText = noticeDiv.createSpan({cls: "modal-button-notice-text"});
    noticeText.textContent = "At least one option above must be enabled. If you enable the playground link, you must also enable the JSON file.";
    setIcon((noticeIcon), "alert-triangle");

    buttonDiv.appendChild(noticeDiv);

    let shareButton = new ButtonComponent(buttonDiv)
      .setButtonText("Share")
      .setClass('share-gist-button')
      .setCta()
      .onClick(() => {
        this.onOK();
      })
      .setCta();

    new ButtonComponent(buttonDiv).setButtonText("Cancel").onClick(() => {
      this.close();
    });

    let checkIsDisabled = () => {
      if (
        (!this.changes.includeLivecodesLink && 
        !this.changes.includeHtmlFile && 
        !this.changes.includeJsonFile && 
        !this.changes.includeMarkdownFile) ||
        this.changes.includeLivecodesLink && 
        !this.changes.includeJsonFile
      ) {
        shareButton.disabled = true;
        activeDocument.querySelector('.share-gist-button')?.setAttribute("disabled", '')
      }
      else {
        shareButton.disabled = false;
        activeDocument.querySelector('.share-gist-button')?.removeAttribute("disabled")
      }
    }

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

export async function openShareGistModal(
  app: App,
  plugin: LivecodesPlugin,
  title: string | null,
  changes: {includeLivecodesLink: true, includeHtmlFile: true, includeJsonFile: true, includeMarkdownFile: true},
  callback?: ShareGistCallback
): Promise<string | null> {
  return await new Promise((resolve, reject) => {
    new ShareGistModal(
      app,
      plugin,
      title,
      changes,
      callback ??
        ((text: string | null) => {
          resolve(text);
        })
    ).open();
  });
}

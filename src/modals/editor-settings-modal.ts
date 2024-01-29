import { App, Modal, Setting, ButtonComponent, TextComponent, TextAreaComponent } from "obsidian";
import LivecodesPlugin from '../main';

type EditorSettingsCallback = (text: string | null) => void;

export class EditorSettingsModal extends Modal {
		plugin: LivecodesPlugin;
    title: string | null;
    changes: {title: string, description: string, head: string, htmlAttrs: string};
		callback: EditorSettingsCallback;

    constructor(
        app: App,
				plugin: LivecodesPlugin,
        title: string | null,
        changes: {title: string, description: string, head: string, htmlAttrs: string},
				callback: EditorSettingsCallback,
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

			const titleInput = new Setting(this.contentEl)
				.setName('title')
				.setDesc('Title of project')
				.setClass("title-setting")
				.addText(text =>
					text
					.setValue(this.changes.title)
					.onChange(async newTitleSetting => {
						this.changes.title = newTitleSetting;
					})
				);

			const descriptionInput = new Setting(this.contentEl)
				.setName('description')
				.setDesc('Description of project')
				.setClass("description-setting")
				.addTextArea(text =>
					text
					.setValue(this.changes.description)
					.onChange(async newDescriptionSetting => {
						this.changes.description = newDescriptionSetting;
					})
				);

			const headTextArea = new Setting(this.contentEl)
				.setName('head')
				.setDesc('Content for <head> element')
				.setClass("head-setting")
				.addTextArea(text =>
					text
					.setValue(this.changes.head)
					.onChange(async newHeadSetting => {
						this.changes.head = newHeadSetting;
					})
				);

			const htmlAttrsTextArea = new Setting(this.contentEl)
				.setName('htmlAttrs')
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

export async function openEditorSettingsModal(
    app: App,
    plugin: LivecodesPlugin,
    title: string | null,
    changes: {title: string, description: string, head: string, htmlAttrs: string},
		callback?: EditorSettingsCallback
): Promise<any[] | null> {
    return await new Promise((resolve, reject) => {
        new EditorSettingsModal(
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

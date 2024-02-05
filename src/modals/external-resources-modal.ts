import { App, Modal, Setting, ButtonComponent, TextComponent, TextAreaComponent } from "obsidian";
import LivecodesPlugin from '../main';

type ExternalResourcesCallback = (text: string | null) => void;

export class ExternalResourcesModal extends Modal {
		plugin: LivecodesPlugin;
    title: string | null;
    changes: {stylesheets: string[], scripts: string[], cssPreset: string};
		callback: ExternalResourcesCallback;

    constructor(
        app: App,
				plugin: LivecodesPlugin,
        title: string | null,
        changes: {stylesheets: string[], scripts: string[], cssPreset: string},
				callback: ExternalResourcesCallback,
    ) {
				super(app);
				this.plugin = plugin;
        this.title = title;
				this.changes = changes;
				this.callback = callback;
    }

    onOpen() {

			const { contentEl } = this;
			this.contentEl.addClass("livecodes-external-resources-modal");
			contentEl.empty();
			if (this.title) this.titleEl.setText(this.title);

			new Setting(this.contentEl)
				.setName('External stylesheets')
				.setClass("stylesheets-setting")
				.addTextArea(text =>
					text
					.setValue(this.changes.stylesheets.join("\n"))
					.setPlaceholder("https://")
					.onChange(async newStylesheetsSetting => {
						this.changes.stylesheets = newStylesheetsSetting.split("\n");
					})
				);

			new Setting(this.contentEl)
				.setName('External scripts')
				.setClass("scripts-setting")
				.addTextArea(text =>
					text
					.setValue(this.changes.scripts.join("\n"))
					.setPlaceholder("https://")
					.onChange(async newScriptsSetting => {
						this.changes.scripts = newScriptsSetting.split("\n");
					})
				);

			new Setting(this.contentEl)
				.setName('CSS preset')
				.setClass("cssPreset-setting")
				.addDropdown((dropdown) => {
					dropdown
					.addOptions({
						"":"none",
						"normalize.css":"normalize.css",
						"reset-css":"reset-css",
					})
					.setValue(this.changes.cssPreset)
					.onChange(async (newCssPresetSetting) => {
						this.changes.cssPreset = newCssPresetSetting;
					});
				});

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

export async function openExternalResourcesModal(
    app: App,
    plugin: LivecodesPlugin,
    title: string | null,
    changes: {stylesheets: string[], scripts: string[], cssPreset: string},
		callback?: ExternalResourcesCallback
): Promise<any[] | null> {
    return await new Promise((resolve, reject) => {
        new ExternalResourcesModal(
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

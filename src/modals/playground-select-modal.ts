import LivecodesPlugin from "../main";
import {
	FileSystemAdapter,
	FuzzyMatch,
	FuzzySuggestModal,
	Notice,
	TFile,
	TFolder,
	Vault
} from "obsidian";

export class PlaygroundSelectModal extends FuzzySuggestModal<TFile> {
	plugin: LivecodesPlugin;
	vault: Vault;
	adapter: FileSystemAdapter;

	constructor(plugin: LivecodesPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.vault = plugin.app.vault;
		this.adapter = plugin.app.vault.adapter as FileSystemAdapter;
		this.containerEl.addClass("playground-select-modal");
		this.setPlaceholder("Select a playground or type to search");
	}

	getItems(): TFile[] {
		const playgroundFolder = this.plugin.settings.playgroundFolder;
		const folder = this.vault.getAbstractFileByPath(playgroundFolder);
		if (!folder || !(folder instanceof TFolder)) {
			new Notice(
				createFragment((frag) => {
					frag.appendText(" ❗ ERROR ❗\n'"+playgroundFolder+"'");
					frag.appendText(" is not a valid folder in the plugin settings.");
				}),
				0
			);
			this.close();
			return [];
		}
		return this.getPlaygroundsInFolder(folder);
	}

	getItemText(item: TFile): string {
		var regex = new RegExp(this.plugin.settings.playgroundFolder+"\/", "g");
		return item.path.replace(regex, "").replace(".json", "");
	}

	renderSuggestion(match: FuzzyMatch<TFile>, el: HTMLElement) {
		super.renderSuggestion(match, el);
	}

	async onChooseItem(f: TFile) {
		if (f.path) {
			this.plugin.settings.jsonTemplate = f;
			this.plugin.saveSettings;
			await this.plugin.activateView();
			return Promise.resolve;
		} else {
			new Notice("Invalid file path.")
			console.log(`Invalid file path: ${f.path}`);
			return Promise.reject;
		}
	}

	private getPlaygroundsInFolder(folder: TFolder): TFile[] {
		let files: TFile[] = [];
		Vault.recurseChildren(folder, (file) => {
			if (file instanceof TFile && file.extension === 'json') {
				files.push(file);
			}
		});
		return files.sort( (a: { name: string; },b: { name: string; }) => {
			return a.name.localeCompare(b.name);
		});
	}

}

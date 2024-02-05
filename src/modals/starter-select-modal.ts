import LivecodesPlugin from "../main";
import {
	FileSystemAdapter,
	FuzzyMatch,
	FuzzySuggestModal,
	Vault,
	Notice,
	TFile
} from "obsidian";
import { livecodesStarters } from "src/utils/starters";
import { openPromptModal } from "./prompt-modal";
import { blankPlayground } from "../utils";

export class StarterSelectModal extends FuzzySuggestModal<string> {
	plugin: LivecodesPlugin;
	vault: Vault;
	adapter: FileSystemAdapter;
	name: string;
	activeEditor: string;
	head: string;
	markup: [];
	style: [];
	script: [];
	content: string;
	language: string;
	stylesheets: string[];
	scripts: string[];
	
	constructor(plugin: LivecodesPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.vault = plugin.app.vault;
		this.adapter = plugin.app.vault.adapter as FileSystemAdapter;
		this.containerEl.addClass("starter-select-modal");
		this.setPlaceholder("Select a starter or type to search");
	}

	getItems(): any[] {
		return livecodesStarters.sort( (a: { name: string; }, b: { name: string; }) => {
			return a.name.localeCompare(b.name);
		});
	}

	getItemText(item: any): string {
		return item.name;
	}

	renderSuggestion(match: FuzzyMatch<string>, el: HTMLElement) {
		super.renderSuggestion(match, el);
	}

	createText = async (
		fileContent: string|undefined
	): Promise<string> => {
		return fileContent?.trim() as string;
	}

	async onChooseItem(starter: any) {
		await openPromptModal(this.app, "Livecodes playground", "Save as:", "", "e.g. New Project", false)
			.then(async (fName:string) => {				
				if (fName?.length === 0) {
					return;
				}
				let newPlayground = blankPlayground;
				let foundHead: boolean = starter.head !== undefined;
				let foundProcessors: boolean = starter.processors !== undefined;
				let foundMarkup: boolean = starter.markup !== undefined;
				let foundStyle: boolean = starter.style !== undefined;
				let foundScript: boolean = starter.script !== undefined;
				let foundStylesheets: boolean = starter.stylesheets !== undefined;
				let foundScripts: boolean = starter.scripts !== undefined;
				if (foundHead) {
					newPlayground.head = starter.head;
				}
				if (foundProcessors) {
					newPlayground.processors = starter.processors;
				}
				if (foundMarkup) {
					newPlayground.markup.content = starter.markup.content;
					newPlayground.markup.language = starter.markup.language;
				}
				if (foundStyle) {
					newPlayground.style.content = starter.style.content;
					newPlayground.style.language = starter.style.language;
				}
				if (foundScript) {
					newPlayground.script.content = starter.script.content;
					newPlayground.script.language = starter.script.language;
				}
				if (foundStylesheets) {
					newPlayground.stylesheets = starter.stylesheets;
				}
				if (foundScripts) {
					newPlayground.scripts = starter.scripts;
				}
				if (starter.activeEditor !== undefined) {
					newPlayground.activeEditor = starter.activeEditor;
				}
				newPlayground.title = fName;
				newPlayground.appUrl = this.plugin.settings.appUrl;
				newPlayground.fontFamily = this.plugin.settings.fontFamily;
				newPlayground.fontSize = this.plugin.settings.fontSize;
				newPlayground.editor = this.plugin.settings.editor;
				newPlayground.editorTheme = this.plugin.settings.editorTheme;
				newPlayground.lineNumbers = this.plugin.settings.lineNumbers;
				newPlayground.theme = this.plugin.settings.darkTheme ? "dark" : "light";
				newPlayground.useTabs = this.plugin.settings.useTabs;
				newPlayground.tabSize = this.plugin.settings.tabSize;
				newPlayground.closeBrackets = this.plugin.settings.closeBrackets;
				newPlayground.semicolons = this.plugin.settings.semicolons;
				newPlayground.singleQuote = this.plugin.settings.singleQuote;
				newPlayground.trailingComma = this.plugin.settings.trailingComma;
				newPlayground.wordWrap = this.plugin.settings.wordWrap;
				newPlayground.autoupdate = this.plugin.settings.autoUpdate;
				newPlayground.delay = this.plugin.settings.delay;

				let prettyCfg: string | undefined = JSON.stringify(newPlayground, null, 2);
				try {
					await this.app.vault
						.create(
							this.plugin.settings.playgroundFolder+'/'+fName + ".json",
							await this.createText(
								prettyCfg
							)
						).then(async (f:TFile) => {
								this.plugin.settings.jsonTemplate = f;
								await this.plugin.saveSettings();
								await this.plugin.activateView();
							}
						);
					new Notice("New project saved as: " + this.plugin.settings.playgroundFolder+'/'+fName + ".json");
				} catch (error) {
					new Notice("❌ " + error + " Click this message to dismiss.", 0);
				}
			});
	}

}

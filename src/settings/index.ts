import { App, PluginSettingTab, Setting, debounce, Notice } from 'obsidian';
import LivecodesPlugin from '../main';
import { FolderSuggest } from "./FolderSuggester";

export class LivecodesSettingsTab extends PluginSettingTab {
	plugin: LivecodesPlugin;

	constructor(app: App, plugin: LivecodesPlugin) {
			super(app, plugin);
			this.plugin = plugin;
	}

	display(): void {
		let debounceNotice = debounce(
			() => {
				new Notice("Trailing slash is required");
			},
			200
		);
		let { containerEl } = this;
		containerEl.addClass("livecodes-settings-tab");
		containerEl.empty();

		new Setting(containerEl)
		.setName(this.plugin.manifest.name)
		.setDesc("(v" + this.plugin.manifest.version + ") ⚠️ NOTE: All settings changes are applied to future Livecodes playgrounds. Clicking the red \"reload\" icon will reload the Livecodes plugin and close all current playgrounds.")
		.setClass("setting-item-heading")
		.addExtraButton((component) => {
			component
			.setIcon("refresh-cw")
			.setTooltip("Reload plugin")
			.onClick(async () => {
				await this.plugin.reload();
				new Notice(`[${this.plugin.manifest.name} v${this.plugin.manifest.version}] reloaded`);
			});
			component.extraSettingsEl.classList.add("mod-warning");
		})
		.then(cb => {
			cb.settingEl.classList.add("setting-head");
		});

		new Setting(containerEl)
			.setName('App URL')
			.setDesc('URL for serving livecodes static codebase. e.g. https://livecodes.io/')
			.addText(text =>
			text
			.setPlaceholder('https://livecodes.io/')
			.setValue(this.plugin.settings.appUrl)
			.onChange(async newAppUrl => {
				if ( newAppUrl.split("").pop() != '/' ) {
					debounceNotice();
					// text.setValue(this.plugin.settings.appUrl);
					return;
				}
				this.plugin.settings.appUrl = newAppUrl;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Template folder')
		.setDesc('The vault folder for JSON templates.')
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl);
			cb
			.setPlaceholder("e.g. templates")
			.setValue(this.plugin.settings.templateFolder)
			.onChange(async (newPath) => {
				this.plugin.settings.templateFolder = newPath;
				await this.plugin.saveSettings();
			});
		});
		/*
		new Setting(containerEl)
		.setName('Code blocks')
		.setDesc('Enable "Open with livecodes" button in  code blocks. Currently, only works with "js" and "javascript"')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.codeBlocks)
			.onChange(async newValue => {
				this.plugin.settings.codeBlocks = newValue;
				await this.plugin.saveSettings();
			})
		);
		*/
		new Setting(containerEl)
		.setName('Dark Theme')
		.setDesc('Enable dark theme')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.darkTheme)
			.onChange(async newValue => {
				this.plugin.settings.darkTheme = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Line numbers')
		.setDesc('Enable line numbers in editor pane')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.lineNumbers)
			.onChange(async newValue => {
				this.plugin.settings.lineNumbers = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Word wrap')
		.setDesc('Enable word wrapping in editor pane.')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.wordWrap)
			.onChange(async newValue => {
				this.plugin.settings.wordWrap = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Auto close brackets')
		.setDesc('Use auto-complete to close brackets and quotes.')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.closeBrackets)
			.onChange(async newValue => {
				this.plugin.settings.closeBrackets = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Semi-colons')
		.setDesc('Enable code formatter to use semi-colons.')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.semicolons)
			.onChange(async newValue => {
				this.plugin.settings.semicolons = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Single quotes')
		.setDesc('Enable code formatter to use single quotes instead of double quotes.')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.singleQuote)
			.onChange(async newValue => {
				this.plugin.settings.singleQuote = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Trailing commas')
		.setDesc('Enable code formatter to use trailing commas.')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.trailingComma)
			.onChange(async newValue => {
				this.plugin.settings.trailingComma = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Use tabs')
		.setDesc('Enable tabs instead of spaces')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.useTabs)
			.onChange(async newValue => {
				this.plugin.settings.useTabs = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Tab size')
		.setDesc('Choice of tab size')
		.addDropdown((dropdown) => {
			dropdown
			.addOptions({
				"2":"2",
				"4":"4",				
			})
			.setValue(this.plugin.settings.tabSize)
			.onChange(async (value) => {
				this.plugin.settings.tabSize = value;
				await this.plugin.saveSettings();
			});
		});

		new Setting(containerEl)
		.setName('Auto update')
		.setDesc('Enable auto updates after editor code changes.')
		.addToggle(toggle =>
			toggle
			.setValue(this.plugin.settings.autoUpdate)
			.onChange(async newValue => {
				this.plugin.settings.autoUpdate = newValue;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('Delay')
		.setDesc('Time delay (in milliseconds) follwing code change, after which the result is updated.')
		.addSlider(slider => slider
			.setLimits(500, 3000, 500)
			.setValue(this.plugin.settings.delay)
			.setDynamicTooltip()
			.onChange(async (value) => {
					this.plugin.settings.delay = value;
					await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
			.setName('Playground height')
			.setDesc('CSS height for livecodes playground component. e.g. 600 or 100% (default: 300)')
			.addText(text =>
			text
			.setPlaceholder('e.g. 600 or 100%')
			.setValue(this.plugin.settings.dataHeight)
			.onChange(async newValue => {
				this.plugin.settings.dataHeight = newValue;
				await this.plugin.saveSettings();
			})
		);


		new Setting(containerEl)
		.setName('Editor Font')
		// .setDesc('')
		.addDropdown((dropdown) => {
			dropdown
			.addOptions({
				"Default":"Default",
				"Anonymous Pro":"Anonymous Pro",
				"Cascadia Code":"Cascadia Code",
				"Code New Roman":"Code New Roman",
				"Comic Mono":"Comic Mono",
				"Courier Prime":"Courier Prime",
				"DEC Terminal Modern":"DEC Terminal Modern",
				"DejaVu Mono":"DejaVu Mono",
				"TypoPRO Fantasque Sans Mono":"TypoPRO Fantasque Sans Mono",
				"Fira Code":"Fira Code",
				"Fixedsys 62":"Fixedsys 62",
				"Hack":"Hack",
				"Hermit":"Hermit",
				"IBM Plex Mono":"IBM Plex Mono",
				"Inconsolata":"Inconsolata",
				"Iosevka":"Iosevka",
				"JetBrains Mono":"JetBrains Mono",
				"Menlo":"Menlo",
				"Monofur":"Monofur",
				"TypoPRO Monoid":"TypoPRO Monoid",
				"Noto Sans Mono":"Noto Sans Mono",
				"Nova Mono":"Nova Mono",
				"OpenDyslexic":"OpenDyslexic",
				"ProFontWindows":"ProFontWindows",
				"Roboto Mono":"Roboto Mono",
				"SF Mono":"SF Mono",
				"Source Code Pro":"Source Code Pro",
				"Space Mono":"Space Mono",
				"Sudo Var":"Sudo Var",
				"Ubuntu Mono":"Ubuntu Mono",
				"Victor Mono":"Victor Mono",
			})
			.setValue(this.plugin.settings.fontFamily)
			.onChange(async (value) => {
				this.plugin.settings.fontFamily = value;
				await this.plugin.saveSettings();
			});
		});

		new Setting(containerEl)
		.setName('Editor Font Size')
		// .setDesc('')
		.addDropdown((dropdown) => {
			dropdown
			.addOptions({
				"10":"10",
				"11":"11",
				"12":"12",
				"13":"13",
				"14":"14",
				"15":"15",
				"16":"16",
				"17":"17",
				"18":"18",
				"19":"19",
				"20":"20",
				"22":"22",
				"24":"24",
				"26":"26",				
			})
			.setValue(this.plugin.settings.fontSize)
			.onChange(async (value) => {
				this.plugin.settings.fontSize = value;
				await this.plugin.saveSettings();
			});
		});
	
		new Setting(containerEl)
		.setName('Editor')
		.setDesc('Choice of code editor.')
		.addDropdown((dropdown) => {
			dropdown
			.addOptions({
				"monaco":"monaco",
				"codemirror":"codemirror",
				"codejar":"codejar",
			})
			.setValue(this.plugin.settings.editor)
			.onChange(async (value) => {
				this.plugin.settings.editor = value;
				await this.plugin.saveSettings();
			});
		});
	}
	
}

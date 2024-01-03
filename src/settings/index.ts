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
			.setDesc('URL for serving livecodes static codebase. e.g. https://v19.livecodes.io/')
			.addText(text =>
			text
			.setPlaceholder('https://v19.livecodes.io/')
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


/*/
"editor-settings-editorTheme-monaco-dark":"",
	"monaco:active4d@dark":"Active4D",
	"monaco:all-hallows-eve@dark":"All Hallows Eve",
	"monaco:amy@dark":"Amy",
	"monaco:birds-of-paradise@dark":"Birds of Paradise",
	"monaco:blackboard@dark":"Blackboard",
	"monaco:brilliance-black@dark":"Brilliance Black",
	"monaco:brilliance-dull@dark":"Brilliance Dull",
	"monaco:chrome-devtools@dark":"Chrome DevTools",
	"monaco:clouds-midnight@dark":"Clouds Midnight",
	"monaco:clouds@dark":"Clouds",
	"monaco:cobalt@dark":"Cobalt",
	"monaco:cobalt2@dark":"Cobalt2",
	"monaco:dawn@dark":"Dawn",
	"monaco:dracula@dark":"Dracula",
	"monaco:dreamweaver@dark":"Dreamweaver",
	"monaco:eiffel@dark":"Eiffel",
	"monaco:espresso-libre@dark":"Espresso Libre",
	"monaco:github@dark":"GitHub",
	"monaco:github-dark@dark":"GitHub Dark",
	"monaco:github-light@dark":"GitHub Light",
	"monaco:hc-black@dark":"High Contrast (Black)",
	"monaco:hc-light@dark":"High Contrast (Light)",
	"monaco:idle@dark":"Idle",
	"monaco:idlefingers@dark":"Idle Fingers",
	"monaco:iplastic@dark":"iPlastic",
	"monaco:katzenmilch@dark":"Katzenmilch",
	"monaco:krtheme@dark":"krTheme",
	"monaco:kuroir@dark":"Kuroir Theme",
	"monaco:lazy@dark":"Lazy",
	"monaco:magicwb-amiga@dark":"MagicWB (Amiga)",
	"monaco:merbivore-soft@dark":"Merbivore Soft",
	"monaco:merbivore@dark":"Merbivore",
	"monaco:monoindustrial@dark":"monoindustrial",
	"monaco:monokai@dark":"Monokai",
	"monaco:monokai-bright@dark":"Monokai Bright",
	"monaco:night-owl@dark":"Night Owl",
	"monaco:nord@dark":"Nord",
	"monaco:oceanic-next@dark":"Oceanic Next",
	"monaco:pastels-on-dark@dark":"Pastels on Dark",
	"monaco:slush-and-poppies@dark":"Slush and Poppies",
	"monaco:solarized-dark@dark":"Solarized Dark",
	"monaco:solarized-light@dark":"Solarized Light",
	"monaco:spacecadet@dark":"SpaceCadet",
	"monaco:sunburst@dark":"Sunburst",
	"monaco:textmate-mac-classic@dark":"Textmate (Mac Classic)",
	"monaco:tomorrow@dark":"Tomorrow",
	"monaco:tomorrow-night@dark":"Tomorrow Night",
	"monaco:tomorrow-night-blue@dark":"Tomorrow Night Blue",
	"monaco:tomorrow-night-bright@dark":"Tomorrow Night Bright",
	"monaco:tomorrow-night-eighties@dark":"Tomorrow Night Eighties",
	"monaco:twilight@dark":"Twilight",
	"monaco:upstream-sunburst@dark":"Upstream Sunburst",
	"monaco:vibrant-ink@dark":"Vibrant Ink",
	"monaco:vs@dark":"VS",
	"monaco:vs-dark@dark":"VS Dark",
	"monaco:xcode-default@dark":"Xcode Default",
	"monaco:zenburnesque@dark":"Zenburnesque",
"editor-settings-editorTheme-monaco-light":""
	"":"Default",
	"monaco:active4d@light":"Active4D",
	"monaco:all-hallows-eve@light":"All Hallows Eve",
	"monaco:amy@light":"Amy",
	"monaco:birds-of-paradise@light":"Birds of Paradise",
	"monaco:blackboard@light":"Blackboard",
	"monaco:brilliance-black@light":"Brilliance Black",
	"monaco:brilliance-dull@light":"Brilliance Dull",
	"monaco:chrome-devtools@light":"Chrome DevTools",
	"monaco:clouds-midnight@light":"Clouds Midnight",
	"monaco:clouds@light":"Clouds",
	"monaco:cobalt@light":"Cobalt",
	"monaco:cobalt2@light":"Cobalt2",
	"monaco:dawn@light":"Dawn",
	"monaco:dracula@light":"Dracula",
	"monaco:dreamweaver@light":"Dreamweaver",
	"monaco:eiffel@light":"Eiffel",
	"monaco:espresso-libre@light":"Espresso Libre",
	"monaco:github@light":"GitHub",
	"monaco:github-dark@light":"GitHub Dark",
	"monaco:github-light@light":"GitHub Light",
	"monaco:hc-black@light":"High Contrast (Black)",
	"monaco:hc-light@light":"High Contrast (Light)",
	"monaco:idle@light":"Idle",
	"monaco:idlefingers@light":"Idle Fingers",
	"monaco:iplastic@light":"iPlastic",
	"monaco:katzenmilch@light":"Katzenmilch",
	"monaco:krtheme@light":"krTheme",
	"monaco:kuroir@light":"Kuroir Theme",
	"monaco:lazy@light":"Lazy",
	"monaco:magicwb-amiga@light":"MagicWB (Amiga)",
	"monaco:merbivore-soft@light":"Merbivore Soft",
	"monaco:merbivore@light":"Merbivore",
	"monaco:monoindustrial@light":"monoindustrial",
	"monaco:monokai@light":"Monokai",
	"monaco:monokai-bright@light":"Monokai Bright",
	"monaco:night-owl@light":"Night Owl",
	"monaco:nord@light":"Nord",
	"monaco:oceanic-next@light":"Oceanic Next",
	"monaco:pastels-on-dark@light":"Pastels on Dark",
	"monaco:slush-and-poppies@light":"Slush and Poppies",
	"monaco:solarized-dark@light":"Solarized Dark",
	"monaco:solarized-light@light":"Solarized Light",
	"monaco:spacecadet@light":"SpaceCadet",
	"monaco:sunburst@light":"Sunburst",
	"monaco:textmate-mac-classic@light":"Textmate (Mac Classic)",
	"monaco:tomorrow@light":"Tomorrow",
	"monaco:tomorrow-night@light":"Tomorrow Night",
	"monaco:tomorrow-night-blue@light":"Tomorrow Night Blue",
	"monaco:tomorrow-night-bright@light":"Tomorrow Night Bright",
	"monaco:tomorrow-night-eighties@light":"Tomorrow Night Eighties",
	"monaco:twilight@light":"Twilight",
	"monaco:upstream-sunburst@light":"Upstream Sunburst",
	"monaco:vibrant-ink@light":"Vibrant Ink",
	"monaco:vs@light":"VS",
	"monaco:vs-dark@light":"VS Dark",
	"monaco:xcode-default@light":"Xcode Default",
	"monaco:zenburnesque@light":"Zenburnesque",
"editor-settings-editorTheme-codemirror-dark":"",
	"":"Default",
	"codemirror:amy@dark":"Amy",
	"codemirror:aura@dark":"Aura",
	"codemirror:ayu-light@dark":"Ayu Light",
	"codemirror:barf@dark":"Barf",
	"codemirror:basic-light@dark":"Basic Light",
	"codemirror:basic-dark@dark":"Basic Dark",
	"codemirror:bespin@dark":"Bespin",
	"codemirror:birds-of-paradise@dark":"Birds of Paradise",
	"codemirror:boys-and-girls@dark":"Boys and Girls",
	"codemirror:clouds@dark":"Clouds",
	"codemirror:cobalt@dark":"Cobalt",
	"codemirror:cm-light@dark":"Codemirror Light",
	"codemirror:cool-glow@dark":"Cool Glow",
	"codemirror:dracula@dark":"Dracula",
	"codemirror:espresso@dark":"Espresso",
	"codemirror:github-dark@dark":"GitHub Dark",
	"codemirror:github-light@dark":"GitHub Light",
	"codemirror:gruvbox-dark@dark":"Gruvbox Dark",
	"codemirror:gruvbox-light@dark":"Gruvbox Light",
	"codemirror:material-dark@dark":"Material Dark",
	"codemirror:material-light@dark":"Material Light",
	"codemirror:noctis-lilac@dark":"Noctis Lilac",
	"codemirror:nord@dark":"Nord",
	"codemirror:one-dark@dark":"One Dark",
	"codemirror:rose-pine-dawn@dark":"Rosé Pine Dawn",
	"codemirror:smoothy@dark":"Smoothy",
	"codemirror:solarized-dark@dark":"Solarized Dark",
	"codemirror:solarized-light@dark":"Solarized Light",
	"codemirror:tokyo-night@dark":"Tokyo Night",
	"codemirror:tokyo-night-day@dark":"Tokyo Night Day",
	"codemirror:tokyo-night-storm@dark":"Tokyo Night Storm",
	"codemirror:tomorrow@dark":"Tomorrow",
"editor-settings-editorTheme-codemirror-light":"",
	"":"Default",
	"codemirror:amy@light":"Amy",
	"codemirror:aura@light":"Aura",
	"codemirror:ayu-light@light":"Ayu Light",
	"codemirror:barf@light":"Barf",
	"codemirror:basic-light@light":"Basic Light",
	"codemirror:basic-dark@light":"Basic Dark",
	"codemirror:bespin@light":"Bespin",
	"codemirror:birds-of-paradise@light":"Birds of Paradise",
	"codemirror:boys-and-girls@light":"Boys and Girls",
	"codemirror:clouds@light":"Clouds",
	"codemirror:cobalt@light":"Cobalt",
	"codemirror:cm-light@light":"Codemirror Light",
	"codemirror:cool-glow@light":"Cool Glow",
	"codemirror:dracula@light":"Dracula",
	"codemirror:espresso@light":"Espresso",
	"codemirror:github-dark@light":"GitHub Dark",
	"codemirror:github-light@light":"GitHub Light",
	"codemirror:gruvbox-dark@light":"Gruvbox Dark",
	"codemirror:gruvbox-light@light":"Gruvbox Light",
	"codemirror:material-dark@light":"Material Dark",
	"codemirror:material-light@light":"Material Light",
	"codemirror:noctis-lilac@light":"Noctis Lilac",
	"codemirror:nord@light":"Nord",
	"codemirror:one-dark@light":"One Dark",
	"codemirror:rose-pine-dawn@light":"Rosé Pine Dawn",
	"codemirror:smoothy@light":"Smoothy",
	"codemirror:solarized-dark@light":"Solarized Dark",
	"codemirror:solarized-light@light":"Solarized Light",
	"codemirror:tokyo-night@light":"Tokyo Night",
	"codemirror:tokyo-night-day@light":"Tokyo Night Day",
	"codemirror:tokyo-night-storm@light":"Tokyo Night Storm",
	"codemirror:tomorrow@light":"Tomorrow",
"editor-settings-editorTheme-codejar-dark":"",
	"":"Default",
	"codejar:a11y-dark@dark":"A11y Dark",
	"codejar:atom-dark@dark":"Atom Dark",
	"codejar:base16-ateliersulphurpool-light@dark":"Base16 Ateliersulphurpool Light",
	"codejar:cb@dark":"CB",
	"codejar:coldark-cold@dark":"Coldark Cold",
	"codejar:coldark-dark@dark":"Coldark Dark",
	"codejar:coy@dark":"Coy",
	"codejar:coy-without-shadows@dark":"Coy Without Shadows",
	"codejar:darcula@dark":"Darcula",
	"codejar:dark@dark":"Dark",
	"codejar:dracula@dark":"Dracula",
	"codejar:duotone-dark@dark":"Duotone Dark",
	"codejar:duotone-earth@dark":"Duotone Earth",
	"codejar:duotone-forest@dark":"Duotone Forest",
	"codejar:duotone-light@dark":"Duotone Light",
	"codejar:duotone-sea@dark":"Duotone Sea",
	"codejar:duotone-space@dark":"Duotone Space",
	"codejar:funky@dark":"Funky",
	"codejar:ghcolors@dark":"GH Colors",
	"codejar:gruvbox-dark@dark":"Gruvbox Dark",
	"codejar:gruvbox-light@dark":"Gruvbox Light",
	"codejar:holi-theme@dark":"Holi Theme",
	"codejar:hopscotch@dark":"Hopscotch",
	"codejar:laserwave@dark":"Laserwave",
	"codejar:lucario@dark":"Lucario",
	"codejar:material-dark@dark":"Material Dark",
	"codejar:material-light@dark":"Material Light",
	"codejar:material-oceanic@dark":"Material Oceanic",
	"codejar:night-owl@dark":"Night Owl",
	"codejar:nord@dark":"Nord",
	"codejar:okaidia@dark":"Okaidia",
	"codejar:one-dark@dark":"One Dark",
	"codejar:one-light@dark":"One Light",
	"codejar:pojoaque@dark":"Pojoaque",
	"codejar:shades-of-purple@dark":"Shades of Purple",
	"codejar:solarized-dark-atom@dark":"Solarized Dark Atom",
	"codejar:solarized-light@dark":"Solarized Light",
	"codejar:synthwave84@dark":"Synthwave 84",
	"codejar:tomorrow@dark":"Tomorrow",
	"codejar:twilight@dark":"Twilight",
	"codejar:vs@dark":"VS",
	"codejar:vsc-dark-plus@dark":"VSC Dark Plus",
	"codejar:xonokai@dark":"Xonokai",
	"codejar:z-touchs@dark":"Z-Touchs",
"editor-settings-editorTheme-codejar-light":"",
	"":"Default",
	"codejar:a11y-dark@light":"A11y Dark",
	"codejar:atom-dark@light":"Atom Dark",
	"codejar:base16-ateliersulphurpool-light@light":"Base16 Ateliersulphurpool Light",
	"codejar:cb@light":"CB",
	"codejar:coldark-cold@light":"Coldark Cold",
	"codejar:coldark-dark@light":"Coldark Dark",
	"codejar:coy@light":"Coy",
	"codejar:coy-without-shadows@light":"Coy Without Shadows",
	"codejar:darcula@light":"Darcula",
	"codejar:dark@light":"Dark",
	"codejar:dracula@light":"Dracula",
	"codejar:duotone-dark@light":"Duotone Dark",
	"codejar:duotone-earth@light":"Duotone Earth",
	"codejar:duotone-forest@light":"Duotone Forest",
	"codejar:duotone-light@light":"Duotone Light",
	"codejar:duotone-sea@light":"Duotone Sea",
	"codejar:duotone-space@light":"Duotone Space",
	"codejar:funky@light":"Funky",
	"codejar:ghcolors@light":"GH Colors",
	"codejar:gruvbox-dark@light":"Gruvbox Dark",
	"codejar:gruvbox-light@light":"Gruvbox Light",
	"codejar:holi-theme@light":"Holi Theme",
	"codejar:hopscotch@light":"Hopscotch",
	"codejar:laserwave@light":"Laserwave",
	"codejar:lucario@light":"Lucario",
	"codejar:material-dark@light":"Material Dark",
	"codejar:material-light@light":"Material Light",
	"codejar:material-oceanic@light":"Material Oceanic",
	"codejar:night-owl@light":"Night Owl",
	"codejar:nord@light":"Nord",
	"codejar:okaidia@light":"Okaidia",
	"codejar:one-dark@light":"One Dark",
	"codejar:one-light@light":"One Light",
	"codejar:pojoaque@light":"Pojoaque",
	"codejar:shades-of-purple@light":"Shades of Purple",
	"codejar:solarized-dark-atom@light":"Solarized Dark Atom",
	"codejar:solarized-light@light":"Solarized Light",
	"codejar:synthwave84@light":"Synthwave 84",
	"codejar:tomorrow@light":"Tomorrow",
	"codejar:twilight@light":"Twilight",
	"codejar:vs@light":"VS",
	"codejar:vsc-dark-plus@light":"VSC Dark Plus",
	"codejar:xonokai@light":"Xonokai",
	"codejar:z-touchs@light":"Z-Touchs",
/**/
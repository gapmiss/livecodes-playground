import { App, PluginSettingTab, Setting, debounce, DropdownComponent, setIcon } from 'obsidian';
import { helpModals } from "./help";
import LivecodesPlugin from '../main';
import { FolderSuggest } from "./FolderSuggester";
import { monacoDarkThemes } from "../livecodes/themes/monacoDarkThemes";
import { monacoLightThemes } from "../livecodes/themes/monacoLightThemes";
import { codemirrorDarkThemes } from "../livecodes/themes/codemirrorDarkThemes";
import { codemirrorLightThemes } from "../livecodes/themes/codemirrorLightThemes";
import { codejarDarkThemes } from "../livecodes/themes/codejarDarkThemes";
import { codejarLightThemes } from "../livecodes/themes/codejarLightThemes";
import { showNotice } from '../utils/notice';
import { codeLanguages } from "../livecodes";
import { NOTE_MD_TEMPLATE, GIST_MD_TEMPLATE } from './default';
import { HelpModal } from '../modals/HelpModal';
import { confirm } from "../modals/Confirm";

export class LivecodesSettingsTab extends PluginSettingTab {
  plugin: LivecodesPlugin;

  constructor(app: App, plugin: LivecodesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("livecodes-settings-tab");

    let debounceNotice = debounce(
      () => {
        showNotice('Trailing slash is required', 2000, 'error');
      },
      1000
    );

    let desc = document.createDocumentFragment();
    desc.append(
      "All changes are applied to future Livecodes playground views.",
      desc.createEl("br"),
      desc.createEl("br"),
      "Need help or an introduction? Visit the plugin ",
      desc.createEl("a", {
        href: "https://github.com/gapmiss/livecodes-playground/",
        text: "README",
        attr: { "aria-label": "https://github.com/gapmiss/livecodes-playground/", "class": "external-link", "data-tooltip-position": "top", "tabindex": '0' }
      }),
      " and ",
      desc.createEl("a", {
        href: "https://gapmiss.github.io/livecodes-playground-docs/",
        text: "documentation",
        attr: { "aria-label": "https://gapmiss.github.io/livecodes-playground-docs/", "class": "external-link", "data-tooltip-position": "top", "tabindex": '0' }
      }),
      " and LiveCodes.io ",
      desc.createEl("a", {
        href: "https://livecodes.io/docs/getting-started/",
        text: "documentation",
        attr: { "aria-label": "https://livecodes.io/docs/getting-started/", "class": "external-link", "data-tooltip-position": "top", "tabindex": '0' }
      }),
      " for additional help."
    );

    new Setting(containerEl)
      .setDesc(desc)
      .setClass("setting-item-heading-onboarding")
      .then(cb => {
        cb.settingEl.classList.add("setting-head");
      })
      .then(cb => {
        cb.settingEl.classList.add("setting-head");
      });

    new Setting(containerEl)
      .setName('App URL')
      .setDesc('URL for serving livecodes static codebase')
      .setClass("livecodes-settings-input-appurl")
      .addText(text =>
        text
          .setPlaceholder('https://v45.livecodes.io/')
          .setValue(this.plugin.settings.appUrl)
          .onChange(async newAppUrl => {
            this.plugin.settings.appUrl = newAppUrl;
            await this.plugin.saveSettings();
            if (newAppUrl.split("").pop() != '/') {
              debounceNotice();
              return;
            }
          })
      )
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.appUrl.title as string, helpModals.appUrl.description as string, "", true).open();
          })
      });

    new Setting(containerEl)
      .setName('Playground folder')
      .setDesc('Vault folder for saving playground JSON files')
      .setClass("livecodes-settings-input-playgrounds")
      .addSearch((cb) => {
        new FolderSuggest(cb.inputEl, this.app);
        cb
          .setPlaceholder("e.g. playgrounds")
          .setValue(this.plugin.settings.playgroundFolder)
          .onChange(async (newPath) => {
            this.plugin.settings.playgroundFolder = newPath;
            await this.plugin.saveSettings();
          });
      })
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.playgroundFolder.title as string, helpModals.playgroundFolder.description as string).open();
          })
      });

    new Setting(containerEl)
      .setName('Auto watch')
      .setDesc('Enable to watch for playground changes and save JSON file')
      .setClass("livecodes-settings-input-autowatch")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.autoWatch)
          .onChange(async newValue => {
            this.plugin.settings.autoWatch = newValue;
            await this.plugin.saveSettings();
          })
      })
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.autoWatch.title as string, helpModals.autoWatch.description as string).open();
          })
      });

    new Setting(containerEl)
      .setName('Notes folder')
      .setDesc('Vault folder for saving playground notes')
      .setClass("livecodes-settings-input-notes")
      .addSearch((cb) => {
        new FolderSuggest(cb.inputEl, this.app);
        cb
          .setPlaceholder("e.g. playgrounds/notes")
          .setValue(this.plugin.settings.notesFolder)
          .onChange(async (newPath) => {
            this.plugin.settings.notesFolder = newPath;
            await this.plugin.saveSettings();
          });
      })
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.notesFolder.title as string, helpModals.notesFolder.description as string).open();
          })
      });

    new Setting(containerEl)
      .setName("Sharing")
      .setHeading();

    new Setting(containerEl)
      .setName('Short share URL')
      .setDesc('Enable short URL service for sharing a playground URL. Click the help icon for privacy implications.')
      .setClass("livecodes-settings-input-shorturl")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.shortUrl)
          .onChange(async newValue => {
            this.plugin.settings.shortUrl = newValue;
            await this.plugin.saveSettings();
          })
      })
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.shortUrl.title as string, helpModals.shortUrl.description as string, 'alert').open();
          })
      });

    new Setting(containerEl)
      .setName('Github API token')
      .setDesc('For creating Github gists. Click the help icon for further details.')
      .setClass("livecodes-settings-input-githubtoken")
      .addText(text => text
        .setPlaceholder('Github API token')
        .setValue(this.plugin.settings.githubApiToken)
        .onChange(async (newValue) => {
          this.plugin.settings.githubApiToken = newValue;
          await this.plugin.saveSettings();
        })
      )
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.githubToken.title as string, helpModals.githubToken.description as string).open();
          })
      });

    new Setting(containerEl)
      .setName('Github gist privacy')
      .setDesc('Gists are secret by default. Enable this setting to create public gists.')
      .setClass("livecodes-settings-input-githubgistpublic")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.githubGistPublic)
          .onChange(async newValue => {
            this.plugin.settings.githubGistPublic = newValue;
            await this.plugin.saveSettings();
          })
      })
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.githubGistPublic.title as string, helpModals.githubGistPublic.description as string).open();
          })
      });

    new Setting(containerEl)
      .setName('AI code assistant')
      .setDesc('Enable Codeium AI')
      .setClass("livecodes-settings-input-enableai")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.enableAI)
          .onChange(async newValue => {
            this.plugin.settings.enableAI = newValue;
            await this.plugin.saveSettings();
          })
      )
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.enableAI.title as string, helpModals.enableAI.description as string, 'alert').open();
          })
      });

    new Setting(containerEl)
      .setName("Editor")
      .setHeading();

    new Setting(containerEl)
      .setName('Code editor')
      .setClass("dropdownEditor")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            "monaco": "monaco",
            "codemirror": "codemirror",
            "codejar": "codejar",
          })
          .setValue(this.plugin.settings.editor)
          .onChange(async (newValue) => {
            this.plugin.settings.editor = newValue;
            await toggleChoices(this.plugin.settings.editor);
            await this.plugin.saveSettings();
          });
      })
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.editor.title as string, helpModals.editor.description as string).open();
          })
      });

    const dropdownMonacoDark = new Setting(containerEl)
      .setName('Monaco theme (dark mode)')
      .setClass("dropdownMonacoDark")
      .addDropdown((dropdown: DropdownComponent) => {
        monacoDarkThemes.forEach(({ name, desc }) => {
          dropdown
            .addOption(name, desc)
        })
        dropdown
          .setValue(this.plugin.settings.monacoDarkTheme)
          .onChange(async (newValue) => {
            this.plugin.settings.monacoDarkTheme = newValue;
            await toggleChoices(this.plugin.settings.editor);
            await this.plugin.saveSettings();
          });
      });

    const dropdownMonacoLight = new Setting(containerEl)
      .setName('Monaco theme (light mode)')
      .setClass("dropdownMonacoLight")
      .addDropdown((dropdown: DropdownComponent) => {
        monacoLightThemes.forEach(({ name, desc }) => {
          dropdown
            .addOption(name, desc)
        })
        dropdown
          .setValue(this.plugin.settings.monacoLightTheme)
          .onChange(async (newValue) => {
            this.plugin.settings.monacoLightTheme = newValue;
            await toggleChoices(this.plugin.settings.editor);
            await this.plugin.saveSettings();
          });
      });

    const dropdownCodemirrorDark = new Setting(containerEl)
      .setName('Codemirror theme (dark mode)')
      .setClass("dropdownCodemirrorDark")
      .addDropdown((dropdown: DropdownComponent) => {
        codemirrorDarkThemes.forEach(({ name, desc }) => {
          dropdown
            .addOption(name, desc)
        })
        dropdown
          .setValue(this.plugin.settings.codemirrorDarkTheme)
          .onChange(async (newValue) => {
            this.plugin.settings.codemirrorDarkTheme = newValue;
            await toggleChoices(this.plugin.settings.editor);
            await this.plugin.saveSettings();
          });
      });

    const dropdownCodemirrorLight = new Setting(containerEl)
      .setName('Codemirror theme (light mode)')
      .setClass("dropdownCodemirrorLight")
      .addDropdown((dropdown: DropdownComponent) => {
        codemirrorLightThemes.forEach(({ name, desc }) => {
          dropdown
            .addOption(name, desc)
        })
        dropdown
          .setValue(this.plugin.settings.codemirrorLightTheme)
          .onChange(async (newValue) => {
            this.plugin.settings.codemirrorLightTheme = newValue;
            await toggleChoices(this.plugin.settings.editor);
            await this.plugin.saveSettings();

          });
      });

    const dropdownCodejarDark = new Setting(containerEl)
      .setName('Codejar theme (dark mode)')
      .setClass("dropdownCodejarDark")
      .addDropdown((dropdown: DropdownComponent) => {
        codejarDarkThemes.forEach(({ name, desc }) => {
          dropdown
            .addOption(name, desc)
        })
        dropdown
          .setValue(this.plugin.settings.codejarDarkTheme)
          .onChange(async (newValue) => {
            this.plugin.settings.codejarDarkTheme = newValue;
            await toggleChoices(this.plugin.settings.editor);
            await this.plugin.saveSettings();
          });
      });

    const dropdownCodejarLight = new Setting(containerEl)
      .setName('Codejar theme (light mode)')
      .setClass("dropdownCodejarLight")
      .addDropdown((dropdown: DropdownComponent) => {
        codejarLightThemes.forEach(({ name, desc }) => {
          dropdown
            .addOption(name, desc)
        })
        dropdown
          .setValue(this.plugin.settings.codejarLightTheme)
          .onChange(async (newValue) => {
            this.plugin.settings.codejarLightTheme = newValue;
            await toggleChoices(this.plugin.settings.editor);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Playground height')
      .setDesc('CSS height for livecodes playground. e.g. 600 or 100% (default: 600)')
      .setClass('livecodes-setting-input-height')
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
      .setName('Layout')
      .setDesc('Sets the playground layout to horizontal or vertical. If set to "responsive", the layout is vertical in small screens when the playground height is larger than its width, otherwise horizontal. (default: responsive)')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            "responsive": "responsive",
            "vertical": "vertical",
            "horizontal": "horizontal",
          })
          .setValue(this.plugin.settings.layout)
          .onChange(async (newValue) => {
            this.plugin.settings.layout = newValue;
            await this.plugin.saveSettings();
          });
      });


    new Setting(containerEl)
      .setName('Dark theme')
      .setDesc('Enable dark theme as default')
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.darkTheme)
          .onChange(async newValue => {
            this.plugin.settings.darkTheme = newValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Editor font')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            "Default": "Default",
            "Anonymous Pro": "Anonymous Pro",
            "Astigmata": "Astigmata",
            "Cascadia Code": "Cascadia Code",
            "Code New Roman": "Code New Roman",
            "Comic Mono": "Comic Mono",
            "Courier Prime": "Courier Prime",
            "DEC Terminal Modern": "DEC Terminal Modern",
            "DejaVu Mono": "DejaVu Mono",
            "TypoPRO Fantasque Sans Mono": "Fantasque Sans Mono",
            "Fira Code": "Fira Code",
            "Fixedsys 62": "Fixedsys",
            "Hack": "Hack",
            "Hermit": "Hermit",
            "IBM Plex Mono": "IBM Plex Mono",
            "Inconsolata": "Inconsolata",
            "Iosevka": "Iosevka",
            "JetBrains Mono": "JetBrains Mono",
            "Menlo": "Menlo",
            "Monaspace Argon": "Monaspace Argon",
            "Monaspace Krypton": "Monaspace Krypton",
            "Monaspace Neon": "Monaspace Neon",
            "Monaspace Radon": "Monaspace Radon",
            "Monaspace Xenon": "Monaspace Xenon",
            "Monofur": "Monofur",
            "TypoPRO Monoid": "Monoid",
            "Noto Sans Mono": "Noto Sans Mono",
            "Nova Mono": "Nova Mono",
            "OpenDyslexic": "OpenDyslexic",
            "ProFontWindows": "ProFont",
            "Roboto Mono": "Roboto Mono",
            "SF Mono": "SF Mono",
            "Source Code Pro": "Source Code Pro",
            "Space Mono": "Space Mono",
            "Sudo Var": "Sudo Var",
            "Ubuntu Mono": "Ubuntu Mono",
            "Victor Mono": "Victor Mono",
          })
          .setValue(this.plugin.settings.fontFamily)
          .onChange(async (newValue) => {
            this.plugin.settings.fontFamily = newValue;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Editor font-size')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            "10": "10",
            "11": "11",
            "12": "12",
            "13": "13",
            "14": "14",
            "15": "15",
            "16": "16",
            "17": "17",
            "18": "18",
            "19": "19",
            "20": "20",
            "22": "22",
            "24": "24",
            "26": "26",
          })
          .setValue(this.plugin.settings.fontSize)
          .onChange(async (newValue) => {
            this.plugin.settings.fontSize = newValue;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Word wrap')
      .setDesc('Enable word wrapping in editor pane')
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.wordWrap)
          .onChange(async newValue => {
            this.plugin.settings.wordWrap = newValue;
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
      .setName('Use tabs')
      .setDesc('Enable tabs instead of spaces')
      .setClass("livecodes-settings-input-usetabs")
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
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            "2": "2",
            "4": "4",
          })
          .setValue(this.plugin.settings.tabSize)
          .onChange(async (newValue) => {
            this.plugin.settings.tabSize = newValue;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Auto close brackets')
      .setDesc('Use auto-complete to close brackets and quotes')
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.closeBrackets)
          .onChange(async newValue => {
            this.plugin.settings.closeBrackets = newValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Auto update')
      .setDesc('Enable auto updates of results pane after editor code changes')
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
        .onChange(async (newValue) => {
          this.plugin.settings.delay = newValue;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Semi-colons')
      .setDesc('Enable code formatter to use semi-colons')
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
      .setDesc('Enable code formatter to use single quotes instead of double quotes')
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
      .setDesc('Enable code formatter to use trailing commas')
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.trailingComma)
          .onChange(async newValue => {
            this.plugin.settings.trailingComma = newValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setHeading()
      .setName("Quick playground")
      .setClass('livecodes-quick-playground-heading')
      .addExtraButton((component) => {
        let isExpanded = false;
        component
          .setIcon("chevron-right")
          .setTooltip("Show processors", { "placement": "left" })
          .onClick(() => {
            let toggles = activeDocument.querySelectorAll('[class$="-quick-select"]');
            if (!isExpanded) {
              component.setIcon('chevron-down').setTooltip("Hide processors", { "placement": "left" })
              isExpanded = true;
              toggles.forEach((toggle:HTMLDivElement)=>{toggle.setAttribute('style', 'display:flex;')});
            }
            else {
              component.setIcon('chevron-right').setTooltip("Show processors", { "placement": "left" })
              isExpanded = false;
              toggles.forEach((toggle:HTMLDivElement)=>{toggle.setAttribute('style', 'display:none;')});
            }
          });
      })
      .then((c) => {
        let bttn:HTMLDivElement|null = activeDocument.querySelector('.livecodes-quick-playground-heading .clickable-icon');
        if (bttn !== null) {
          bttn!.setAttribute('tabindex', '0');
          bttn!.addEventListener('keydown', (evt) => {
            const keyDown = evt.key;
            if ( keyDown === 'Enter' || (['Spacebar', ' '].indexOf(keyDown) >= 0)) {
                evt.preventDefault();
                bttn!.click();
            }
          });
        }
      });

    new Setting(containerEl)
      .setName('Markup')
      .setDesc('Default markup language when using the "Quick playground" command')
      .setClass("dropdown-markup-quick-select")
      .addDropdown((dropdown: DropdownComponent) => {
        codeLanguages().markup.forEach(({ name, title }) => {
          dropdown
          .addOption(name, title)
        })
        dropdown
        .setValue(this.plugin.settings.quickPlaygroundMarkup)
        .onChange(async (newValue) => {
          this.plugin.settings.quickPlaygroundMarkup = newValue;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Style')
      .setDesc('Default style language when using the "Quick playground" command')
      .setClass("dropdown-style-quick-select")
      .addDropdown((dropdown: DropdownComponent) => {
        codeLanguages().style.forEach(({ name, title, processor }) => {
          if (!processor) {
            dropdown
            .addOption(name, title)
          }
        })
        dropdown
        .setValue(this.plugin.settings.quickPlaygroundStyle)
        .onChange(async (newValue) => {
          this.plugin.settings.quickPlaygroundStyle = newValue;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Script')
      .setDesc('Default script language when using the "Quick playground" command')
      .setClass("dropdown-script-quick-select")
      .addDropdown((dropdown: DropdownComponent) => {
        codeLanguages().script.forEach(({ name, title }) => {
          dropdown
          .addOption(name, title)
        })
        dropdown
        .setValue(this.plugin.settings.quickPlaygroundScript)
        .onChange(async (newValue) => {
          this.plugin.settings.quickPlaygroundScript = newValue;
          await this.plugin.saveSettings();
        });
      });


    new Setting(containerEl)
      .setHeading()
      .setName("Markdown templates")
      .setClass('livecodes-templates-heading')
      // .setDesc("Click the help icon for a list of available template variables (powered by Nunjucks)")
      .addExtraButton((component) => {
        let isExpanded = false;
        component
          .setIcon("chevron-right")
          .setTooltip("Show processors", { "placement": "left" })
          .onClick(() => {
            let toggles = activeDocument.querySelectorAll('[class$="-template-setting"]');
            if (!isExpanded) {
              component.setIcon('chevron-down').setTooltip("Hide processors", { "placement": "left" })
              isExpanded = true;
              toggles.forEach((toggle:HTMLDivElement)=>{toggle.setAttribute('style', 'display:flex;')});
            }
            else {
              component.setIcon('chevron-right').setTooltip("Show processors", { "placement": "left" })
              isExpanded = false;
              toggles.forEach((toggle:HTMLDivElement)=>{toggle.setAttribute('style', 'display:none;')});
            }
          });
      })
      .then(() => {
        let bttn:HTMLDivElement|null = activeDocument.querySelector('.livecodes-templates-heading .clickable-icon');
        if (bttn !== null) {
          bttn!.setAttribute('tabindex', '0');
          bttn!.addEventListener('keydown', (evt) => {
            const keyDown = evt.key;
            if ( keyDown === 'Enter' || (['Spacebar', ' '].indexOf(keyDown) >= 0)) {
                evt.preventDefault();
                bttn!.click();
            }
          });
        }
      });

    new Setting(containerEl).setName("Note")
      .setClass("livecodes-note-template-setting")
      .setDesc("Markdown template for creating notes in your vault")
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.noteTemplate.title as string, helpModals.noteTemplate.description as string, '', true).open();
          })
      })
      .addExtraButton((component) => {
        component
          .setIcon("rotate-ccw")
          .setTooltip("Restore default note template", { "placement": "left" })
          .onClick( async () => {
            if (await confirm('Restore this template?', this.plugin.app)) {
              try {
                this.plugin.settings.noteMarkdownTemplate = NOTE_MD_TEMPLATE;
                await this.plugin.saveSettings();
                let textArea = activeDocument.querySelector('.livecodes-note-template-setting .setting-item-control textarea') as HTMLTextAreaElement | null;
                textArea!.value = NOTE_MD_TEMPLATE;
                showNotice("Default note template restored", 3000, 'success');
              } catch (error) {
                console.error(error);
              }
            }
          });
      })
      .addTextArea((text) => {
        text
          .setValue(this.plugin.settings.noteMarkdownTemplate)
          .onChange(async (value) => {
            this.plugin.settings.noteMarkdownTemplate = value;
            await this.plugin.saveSettings();
          })
          // text.inputEl.setAttr("rows", 25);
          // text.inputEl.setAttr("cols", 60);
        }
      );

    new Setting(containerEl).setName("Gist")
      .setClass("livecodes-gist-template-setting")
      .setDesc("Markdown template for saving Github gists")
      .addExtraButton((component) => {
        component
          .setIcon("help-circle")
          .setTooltip("Help", { "placement": "left" })
          .onClick(() => {
            new HelpModal(this.app, helpModals.noteTemplate.title as string, helpModals.noteTemplate.description as string, '', true).open();
          })
      })
      .addExtraButton((component) => {
        component
          .setIcon("rotate-ccw")
          .setTooltip("Restore default gist template", { "placement": "left" })
          .onClick( async () => {
            if (await confirm('Restore this template?', this.plugin.app)) {
              try {
                this.plugin.settings.gistMarkdownTemplate = GIST_MD_TEMPLATE;
                await this.plugin.saveSettings();
                let textArea = activeDocument.querySelector('.livecodes-gist-template-setting .setting-item-control textarea') as HTMLTextAreaElement | null;
                textArea!.value = GIST_MD_TEMPLATE;
                showNotice("Default gist template restored", 3000, 'success');
              } catch (error) {
                console.error(error);
              }
            }
          });
      })
      .addTextArea((text) => {
        text
          .setValue(this.plugin.settings.gistMarkdownTemplate)
          .onChange(async (value) => {
            this.plugin.settings.gistMarkdownTemplate = value;
            await this.plugin.saveSettings();
          })
        }
      );

    new Setting(containerEl)
      .setName("Support the developers")
      .setHeading()
      .setClass("livecodes-sponsorship-heading")
      .addExtraButton((component) => {
        let isExpanded = false;
        component
          .setIcon("chevron-right")
          .setTooltip(helpModals.sponsorship.title, { "placement": "left" })
          .onClick(() => {
            let toggles = activeDocument.querySelectorAll('.livecodes-sponsorship');
            if (!isExpanded) {
              component.setIcon('chevron-down').setTooltip("Hide", { "placement": "left" })
              isExpanded = true;
              activeDocument.querySelector('.livecodes-sponsorship-heading')!.setAttribute('style','border-bottom: 1px solid var(--background-modifier-border);');
              toggles.forEach((toggle:HTMLDivElement)=>{toggle.setAttribute('style', 'display:block;')});
            }
            else {
              component.setIcon('chevron-right').setTooltip("Show", { "placement": "left" })
              isExpanded = false;
              activeDocument.querySelector('.livecodes-sponsorship-heading')!.setAttribute('style','border-bottom: 1px solid transparent;');
              toggles.forEach((toggle:HTMLDivElement)=>{toggle.setAttribute('style', 'display:none;')});
            }
          });
      })
      .then(() => {
        let bttn:HTMLDivElement|null = activeDocument.querySelector('.livecodes-sponsorship-heading .clickable-icon');
        if (bttn !== null) {
          bttn!.setAttribute('tabindex', '0');
          bttn!.addEventListener('keydown', (evt) => {
            const keyDown = evt.key;
            if ( keyDown === 'Enter' || (['Spacebar', ' '].indexOf(keyDown) >= 0)) {
                evt.preventDefault();
                bttn!.click();
            }
          });
        }
      });

    const sponsorEl = containerEl.createEl('div', {
      cls: 'livecodes-sponsorship',
    });

    const descEl = sponsorEl.createEl('div');
    const mssgEl = descEl.createDiv({
      cls: 'sponsorship-message',
      text: helpModals.sponsorship.description,
    });
    const textEl = descEl.createSpan({
      text: 'Support the developers',
    });
    const iconEl = descEl.createSpan({
      cls: 'heart-icon',
    });
    setIcon(iconEl,'heart');
    
    descEl.appendChild(iconEl);
    descEl.appendChild(textEl);
    sponsorEl.appendChild(descEl);
    sponsorEl.appendChild(mssgEl);
    const parser = new DOMParser();
    sponsorEl.appendChild(
      createDonateButton(
        'https://livecodes.io/docs/sponsor',
        parser.parseFromString(liveCodesLogo, 'text/xml').documentElement,
      ),
    );

    const toggleChoices = async (choice: string): Promise<any> => {
      switch (choice) {
        case "monaco":
          let monacodd = [dropdownCodejarDark, dropdownCodejarLight, dropdownCodemirrorDark, dropdownCodemirrorLight];
          monacodd.forEach((dd) => { dd.setClass("choiceHidden") });
          activeDocument.querySelector(".dropdownMonacoDark")?.removeClass("choiceHidden");
          activeDocument.querySelector(".dropdownMonacoLight")?.removeClass("choiceHidden");
          break;
        case "codemirror":
          let cmdd = [dropdownCodejarDark, dropdownCodejarLight, dropdownMonacoDark, dropdownMonacoLight];
          cmdd.forEach((dd) => { dd.setClass("choiceHidden") });
          activeDocument.querySelector(".dropdownCodemirrorDark")?.removeClass("choiceHidden");
          activeDocument.querySelector(".dropdownCodemirrorLight")?.removeClass("choiceHidden");
          break;
        case "codejar":
          let cjdd = [dropdownCodemirrorDark, dropdownCodemirrorLight, dropdownMonacoDark, dropdownMonacoLight]
          cjdd.forEach((dd) => { dd.setClass("choiceHidden"); });
          activeDocument.querySelector(".dropdownCodejarDark")?.removeClass("choiceHidden");
          activeDocument.querySelector(".dropdownCodejarLight")?.removeClass("choiceHidden");
          break;
        default:
          break;
      }
      let allThemes = [
        this.plugin.settings.monacoDarkTheme,
        this.plugin.settings.monacoLightTheme,
        this.plugin.settings.codemirrorDarkTheme,
        this.plugin.settings.codemirrorLightTheme,
        this.plugin.settings.codejarDarkTheme,
        this.plugin.settings.codejarLightTheme,
      ]
      this.plugin.settings.editorTheme = allThemes.filter(n => n).join(",");

      await this.plugin.saveSettings();
    }

    toggleChoices(this.plugin.settings.editor);

  }

}

/**
 * derived from: https://github.com/tgrosinger/advanced-tables-obsidian/blob/a8a483f1b9b5fc10eae5fd11bf808b56b7d06fb3/src/main.ts
 */
const createDonateButton = (link: string, img: HTMLElement): HTMLElement => {
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.setAttribute('tabindex', '0');
  a.setAttribute('aria-label', link);
  a.setAttribute("data-tooltip-position", "top");
  a.addClass('livecodes-sponsorship-button');
  a.appendChild(img);
  return a;
};

const liveCodesLogo = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="66" height="44"><defs><linearGradient transform="matrix(1 0 0 1 0 0)"  id="1" x1="0" y1="0" x2="76.9073" y2="0"><stop stop-color="#D7D7D7" offset="0%"/><stop stop-color="#626262" offset="100%"/></linearGradient><linearGradient transform="matrix(1 0 0 1 0 0)"  id="218" x1="0" y1="0" x2="76.9073" y2="0"><stop stop-color="#D7D7D7" offset="0%"/><stop stop-color="#626262" offset="100%"/></linearGradient><linearGradient transform="matrix(1 0 0 1 0 0)"  id="437" x1="0" y1="0" x2="153.3638" y2="0"><stop stop-color="#D7D7D7" offset="0%"/><stop stop-color="#626262" offset="100%"/></linearGradient></defs><g transform="matrix(0.089552246 0 0 0.09016393 0 0)"><g transform="matrix(1 0 0 1 9.5 4.5)"><path d="M16.7525 286.7298C 6.7066 275.7455 0 253.8097 0 234.5909C 0 215.3848 5.0266 197.5589 17.5891 187.9573L17.5891 187.9573L16.7534 187.9573L214.4292 0L214.4292 127.5964C 192.6508 148.17259 163.3353 171.5021 89.626396 235.9855L89.626396 235.9855L90.4621 237.3407C 129.82939 266.1627 175.0609 310.057 214.4283 348.4704L214.4283 348.4704L214.4283 477.4364L16.7525 286.7298z" stroke="none" fill="#C1C1C1" fill-rule="nonzero" /><g transform="matrix(1 0 0 1 500.5716 0.0017)"><path d="M197.6761 190.6956C 207.7146 201.6806 214.4284 223.6273 214.4284 242.8352C 214.4284 262.0431 209.40161 279.866 196.8322 289.4688L196.8322 289.4688L197.6765 289.4688L0 477.4266L0 349.8297C 21.7793 329.26492 51.094 305.936 124.8034 241.45201L124.8034 241.45201L123.9677 240.09671C 84.607 211.2747 39.3692 167.3799 0.0009 128.9676L0.0009 128.9676L0.0009 0L197.6761 190.6956z" stroke="none" fill="#C1C1C1" fill-rule="nonzero" /></g></g><g transform="matrix(1 0 0 1 219.5 59.5)"><g transform="matrix(1 0 0 1 147.229 92.5951)"><path d="M0 261.9238L143.1698 174.4704L143.1698 0L0 87.2109L0 261.9238z" stroke="none" fill="#FFFFFF" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 4.3302 92.7405)"><path d="M0 174.2764L142.9894 261.5845L142.9894 87.1142L0 0L0 174.2764z" stroke="none" fill="#FFFFFF" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 5.2325 6.0147)"><path d="M284.1743 86.5805L142.0872 0L0 86.5805L142.0872 173.3062L284.17432 86.5805L284.1743 86.5805z" stroke="none" fill="#FFFFFF" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 147.3196 92.5951)"><path d="M0 81.5845L133.8327 0.0967L133.6974 0L0 81.5845z" stroke="none" fill="#FFFFFF" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 13.487 92.5951)"><path d="M0.1353 0L0 0.0967L133.8327 81.5845L0.1353 0z" stroke="none" fill="#FFFFFF" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 147.3196 174.1792)"><path d="" stroke="none" fill="#FFFFFF" fill-rule="nonzero" /></g><path d="M290.1287 87.017L147.3196 0L4.5106 87.017L0 89.8789L0 269.9271L147.5 360L152.0106 357.2352L295 269.9271L295 89.8303L290.1287 87.017zM285.6177 264.30072L151.8302 346.0793L151.8302 182.6194L285.7981 100.9863zM142.8087 346.0793L8.8407 264.2521L8.8407 100.9863L142.8087 182.6194zM13.6223 92.6919L147.3196 11.155899L281.017 92.6919L147.3196 174.1792L13.487 92.6919z" stroke="none" fill="#444444" fill-rule="nonzero" /><g transform="matrix(1 0 0 1 147.9058 133.4844)"><path d="M0 140.566L76.9073 93.662094L76.9073 0L0 46.8553L0 140.56601L0 140.566z" stroke="none" fill="url(#1)" /></g><g transform="matrix(1 0 0 1 69.8257 133.4844)"><path d="M0 93.6621L76.9073 140.56601L76.9073 46.8553L0 0L0 93.6621z" stroke="none" fill="url(#218)" /></g><g transform="matrix(1 0 0 1 70.6373 85.513)"><path d="M153.3638 46.71L76.6819 0L0 46.71L76.6819 93.5654L153.3638 46.71z" stroke="none" fill="url(#437)" /></g><g transform="matrix(1 0 0 1 147.3196 132.223)"><path d="M0 42.102L68.9685 0.0968L68.8787 0L0 42.0534L0 42.101997L0 42.102z" stroke="none" fill="#96BF3D" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 78.3507 132.223)"><path d="M0.0902 0L0 0.0968L68.9685 42.102L68.9685 42.053402L0.0902 0z" stroke="none" fill="#96BF3D" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 147.3196 174.2764)"><path d="" stroke="none" fill="#96BF3D" fill-rule="nonzero" /></g><g transform="matrix(1 0 0 1 64.7736 79.159)"><path d="M160.5811 47.4858L82.5456 0L4.5106 47.4858L0 50.2992L0 151.2369L82.5456 201.68149L87.0566 198.91669L165.1819 151.2369L165.1819 50.2992L160.5811 47.4858zM156.0702 145.56201L87.0566 187.76071L87.0566 103.55721L156.1608 61.45521zM78.0351 187.76071L8.9309 145.562L8.9309 61.4552L78.0351 103.557205zM13.6674 53.064L82.54559 11.155998L151.42429 53.1126L82.545586 95.1174L13.577187 53.1608z" stroke="none" fill="#FFFFFF" fill-rule="nonzero" /></g></g></g></svg>`;

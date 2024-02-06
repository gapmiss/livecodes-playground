import { App, PluginSettingTab, Setting, debounce, Notice, DropdownComponent } from 'obsidian';
import { driverObj } from "../utils";
import LivecodesPlugin from '../main';
import { FolderSuggest } from "./FolderSuggester";
import { monacoDarkThemes } from "../themes/monacoDarkThemes";
import { monacoLightThemes } from "../themes/monacoLightThemes";
import { codemirrorDarkThemes } from "../themes/codemirrorDarkThemes";
import { codemirrorLightThemes } from "../themes/codemirrorLightThemes";
import { codejarDarkThemes } from "../themes/codejarDarkThemes";
import { codejarLightThemes } from "../themes/codejarLightThemes";

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
      1000
    );
    let { containerEl } = this;
    containerEl.addClass("livecodes-settings-tab");
    containerEl.empty();

    new Setting(containerEl)
    .setName(this.plugin.manifest.name)
    .setDesc("Take a tour bitches.")
    .setClass("setting-item-heading")
    .addExtraButton((component) => {
      component
      .setIcon("help-circle")
      .setTooltip("Take a tour")
      .onClick(() => {
        driverObj.drive();
      });
      component.extraSettingsEl.classList.add("tour-button");
    })
    .then(cb => {
      cb.settingEl.classList.add("setting-head");
    });

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
      .setDesc('URL for serving livecodes static codebase, e.g. https://v21.livecodes.io/')
      .setClass("livecodes-settings-input-appurl")
      .addText(text =>
      text
      .setPlaceholder('https://v19.livecodes.io/')
      .setValue(this.plugin.settings.appUrl)
      .onChange(async newAppUrl => {
        this.plugin.settings.appUrl = newAppUrl;
        await this.plugin.saveSettings();
        if ( newAppUrl.split("").pop() != '/' ) {
          debounceNotice();
          return;
        }
      })
    );

    new Setting(containerEl)
    .setName('Playgrounds folder')
    .setDesc('The vault folder for saving playground JSON files.')
    .setClass("livecodes-settings-input-playgrounds")
    .addSearch((cb) => {
      new FolderSuggest(cb.inputEl);
      cb
      .setPlaceholder("e.g. playgrounds")
      .setValue(this.plugin.settings.playgroundFolder)
      .onChange(async (newPath) => {
        this.plugin.settings.playgroundFolder = newPath;
        await this.plugin.saveSettings();
      });
    });

    new Setting(containerEl)
    .setName('Notes folder')
    .setDesc('The vault folder for saving playground notes.')
    .setClass("livecodes-settings-input-notes")
    .addSearch((cb) => {
      new FolderSuggest(cb.inputEl);
      cb
      .setPlaceholder("e.g. playgrounds/notes")
      .setValue(this.plugin.settings.notesFolder)
      .onChange(async (newPath) => {
        this.plugin.settings.notesFolder = newPath;
        await this.plugin.saveSettings();
      });
    });

    new Setting(containerEl)
    .setName('Automatically watch for changes')
    .setDesc('Enable to watch for changes and automatically save projects.')
    .setClass("livecodes-settings-input-autowatch")
    .addToggle(toggle =>
      toggle
      .setValue(this.plugin.settings.autoWatch)
      .onChange(async newValue => {
        this.plugin.settings.autoWatch = newValue;
        await this.plugin.saveSettings();
      })
    );

    new Setting(containerEl)
    .setName('Editor')
    .setDesc('Choice of code editor.')
    .setClass("dropdownEditor")
    .addDropdown((dropdown) => {
      dropdown
      .addOptions({
        "monaco":"monaco",
        "codemirror":"codemirror",
        "codejar":"codejar",
      })
      .setValue(this.plugin.settings.editor)
      .onChange(async (newValue) => {
        this.plugin.settings.editor = newValue;
        await toggleChoices(this.plugin.settings.editor);
        await this.plugin.saveSettings();
      });
    });

    const dropdownMonacoDark = new Setting(containerEl)
    .setName('Monaco theme (dark mode)')
    .setDesc('Choice of monaco editor theme.')
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
    .setDesc('Choice of monaco editor theme.')
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
    .setDesc('Choice of codemirror editor theme.')
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
    .setDesc('Choice of codemirror editor theme.')
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
    .setDesc('Choice of codejar editor theme.')
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
    .setDesc('Choice of codejar editor theme.')
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
    .setName('Dark Theme')
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
      .onChange(async (newValue) => {
        this.plugin.settings.tabSize = newValue;
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
      .onChange(async (newValue) => {
          this.plugin.settings.delay = newValue;
          await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName('Playground height')
      .setDesc('CSS height for livecodes playground component. e.g. 600 or 100% (default: 600)')
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
      .onChange(async (newValue) => {
        this.plugin.settings.fontFamily = newValue;
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
      .onChange(async (newValue) => {
        this.plugin.settings.fontSize = newValue;
        await this.plugin.saveSettings();
      });
    });

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
      this.plugin.settings.editorTheme = allThemes.filter(n => n);
      
      await this.plugin.saveSettings();
    }

    toggleChoices(this.plugin.settings.editor);

  }

}

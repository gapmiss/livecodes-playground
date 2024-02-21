import LivecodesPlugin from "../main";
import {
  FileSystemAdapter,
  Modal,
  Vault,
  Notice,
  TFile,
  Setting, 
  ButtonComponent,
  DropdownComponent,
  App
} from "obsidian";
// import { livecodesStarters } from "src/utils/starters";
// import { openPromptModal } from "./prompt-modal";
import { blankPlayground, codeLanguages } from "../livecodes";

// type LanguageSelectCallback = () => void;
type LanguageSelectCallback = (changes:{title: string, markup: string, style: string, twcss: boolean, windicss: boolean, unocss: boolean, lightningcss: boolean, script: string}) => void;

export class LanguageSelectModal extends Modal {
  app: App;
  plugin: LivecodesPlugin;
  vault: Vault;
  adapter: FileSystemAdapter;
  title: string | null;
  changes: {title: string, markup: string, style: string, twcss: boolean, windicss: boolean, unocss: boolean, lightningcss: boolean, script: string};
  callback: LanguageSelectCallback;

  constructor(
    app: App,
    plugin: LivecodesPlugin, 
    title: string | null,
    changes: {title: string, markup: string, style: string, twcss: boolean, windicss: boolean, unocss: boolean, lightningcss: boolean, script: string},
    callback: LanguageSelectCallback
  ) {
    super(app);
    this.app = app;
    this.plugin = plugin;
    this.vault = this.app.vault;
    this.adapter = this.app.vault.adapter as FileSystemAdapter;
    this.containerEl.addClass("language-select-modal");
    this.title = title;
    this.changes = changes;
    this.callback = callback;
  }


  onOpen() {
    const { contentEl } = this;
    this.contentEl.addClass("livecodes-language-select-modal");
    contentEl.empty();
    if (this.title) this.titleEl.setText(this.title);
    
      // () => {
      //   const element = codeLanguages();
      //   console.log('element');
      //   console.log(element);
      // }


    new Setting(contentEl)
    .setName('Title')
    // .setDesc('For creating Github gists. Click the help icon for further details.')
    // .setClass("livecodes-settings-input-githubtoken")
    .addText(text => text
      .setPlaceholder('New Playground')
      .setValue(this.changes.title)
      .onChange(async (newValue) => {
        this.changes.title = newValue;
      })
    )



      new Setting(contentEl)
    .setName('Markup')
    .setClass("dropdown-markup-select")
    .addDropdown((dropdown: DropdownComponent) => {
      
      codeLanguages().markup.forEach(({ name, title }) => {
        dropdown
        .addOption(name, title)
      })
      dropdown
      .setValue(this.changes.markup)
      .onChange(async (newValue) => {
        this.changes.markup = newValue;
      });
    });
    
    new Setting(contentEl)
    .setName('Style')
    .setClass("dropdown-style-select")
    .addDropdown((dropdown: DropdownComponent) => {
      
      codeLanguages().style.forEach(({ name, title, processor }) => {
        if (!processor) {
          dropdown
          .addOption(name, title) 
        }
      })
      dropdown
      .setValue(this.changes.style)
      .onChange(async (newValue) => {
        this.changes.style = newValue;
      });
    });

    new Setting(contentEl)
    .setName('CSS processing')
    .setHeading();

    new Setting(contentEl)
    .setName('Tailwind CSS')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.twcss)
      .onChange(async newValue => {
        this.changes.twcss = newValue;
      })
    );
    
    new Setting(contentEl)
    .setName('Windy CSS')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.windicss)
      .onChange(async newValue => {
        this.changes.windicss = newValue;
      })
    );
    
    new Setting(contentEl)
    .setName('Uno CSS')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.unocss)
      .onChange(async newValue => {
        this.changes.unocss = newValue;
      })
    );
    
    new Setting(contentEl)
    .setName('Lightning CSS')
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.lightningcss)
      .onChange(async newValue => {
        this.changes.lightningcss = newValue;
      })
    );
    
    new Setting(contentEl)
    .setName('Script')
    .setClass("dropdown-script-select")
    .addDropdown((dropdown: DropdownComponent) => {
      
      codeLanguages().script.forEach(({ name, title }) => {
        dropdown
        .addOption(name, title)
      })
      dropdown
      .setValue(this.changes.script)
      .onChange(async (newValue) => {
        this.changes.script = newValue;
      });
    });

  
    const buttonDiv = contentEl.createDiv({
        cls: "modal-button-container",
    });

    new ButtonComponent(buttonDiv)
      .setButtonText("Create")
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
    this.callback(this.changes);
    this.close();
  }

  createText = async (
    fileContent: string|undefined
  ): Promise<string> => {
    return fileContent?.trim() as string;
  }

}

export async function OpenLanguageSelectCallback(
  app: App,
  plugin: LivecodesPlugin,
  title: string | null,
  changes: {title: string, markup: string, style: string, script: string},
  callback?: LanguageSelectCallback
): Promise<any[] | null> {
  return await new Promise((resolve, reject) => {
    new LanguageSelectModal(
      this.app,
      this.plugin,
      title,
      this.changes,
      callback ??
        (() => {
          return JSON.stringify(this.changes);
        })
    
    ).open();
  });
}
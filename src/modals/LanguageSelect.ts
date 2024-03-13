import LivecodesPlugin from "../main";
import {
  Modal,
  Vault,
  Setting, 
  ButtonComponent,
  DropdownComponent,
  App
} from "obsidian";
import { codeLanguages } from "../livecodes";

type LanguageSelectCallback = (changes:{title: string, markup: string, style: string, twcss: boolean, windicss: boolean, unocss: boolean, lightningcss: boolean, script: string}) => void;

export class LanguageSelectModal extends Modal {
  app: App;
  plugin: LivecodesPlugin;
  vault: Vault;
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

    new Setting(contentEl)
    .setName('Title')
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

    let isExpanded = false;
    new Setting(contentEl)
    .setName('CSS processing')
    .setHeading()
    .addExtraButton((component) => {
      component
        .setIcon("chevron-right")
        .setTooltip("Show processors", { "placement": "left" })
        .onClick(() => {
          let toggles = activeDocument.querySelectorAll('.processor-toggle');
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
    }).then((c) => {
      // is there a better way to do this?
      c.components.forEach(element => {
        // @ts-expect-error
        element.extraSettingsEl.setAttribute('tabindex', '0'); 
        // @ts-expect-error
        element.extraSettingsEl.addEventListener('keydown', (evt) => {
          const keyDown = evt.key;
          if ( keyDown === 'Enter' || (['Spacebar', ' '].indexOf(keyDown) >= 0)) {
              evt.preventDefault();
              // @ts-expect-error
              element.extraSettingsEl.click();
          }
        });
      });
    });

    new Setting(contentEl)
    .setName('Tailwind CSS')
    .setClass("processor-toggle")
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.twcss)
      .onChange(async newValue => {
        this.changes.twcss = newValue;
      })
    );
    
    new Setting(contentEl)
    .setName('Windy CSS')
    .setClass("processor-toggle")
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.windicss)
      .onChange(async newValue => {
        this.changes.windicss = newValue;
      })
    );
    
    new Setting(contentEl)
    .setName('Uno CSS')
    .setClass("processor-toggle")
    .addToggle(toggle =>
      toggle
      .setValue(this.changes.unocss)
      .onChange(async newValue => {
        this.changes.unocss = newValue;
      })
    );
    
    new Setting(contentEl)
    .setName('Lightning CSS')
    .setClass("processor-toggle")
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

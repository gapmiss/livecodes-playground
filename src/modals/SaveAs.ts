import { App, Modal, ButtonComponent, TextComponent, TextAreaComponent } from "obsidian";

type SaveAsCallback = (text: string | null) => void;

export class SaveAsModal extends Modal {
  title: string | null;
  message: string;
  messagDefault: string;
  placeholder: string;
  multiLine: boolean;
  callback: SaveAsCallback;
  textComponent: TextComponent | TextAreaComponent;

  constructor(
    app: App,
    title: string | null,
    message: string,
    messagDefault: string = "",
    placeholder: string = "",
    multiLine: boolean = false,
    callback: SaveAsCallback
  ) {
    super(app);
    this.title = title;
    this.message = message;
    this.messagDefault = messagDefault;
    this.placeholder = placeholder;
    this.multiLine = multiLine;
    this.callback = callback;
  }

  onOpen() {
    const { contentEl } = this;

    this.containerEl.addClass("livecodes-prompt-modal");

    contentEl.empty();

    if (this.title) this.titleEl.setText(this.title);

    if (this.message) contentEl.createEl("p").setText(this.message);

    if (this.multiLine) {
      this.textComponent = new TextAreaComponent(contentEl);
    } else {
      this.textComponent = new TextComponent(contentEl);
    }
    
    this.textComponent
      .setValue(this.messagDefault)
      .setPlaceholder(this.placeholder)
      .then((cb) => {
        cb.inputEl.addClass("prompt-input");
        cb.inputEl.addEventListener("keydown", (event: KeyboardEvent) =>  {
          if (!event.shiftKey && event.key === "Enter") {
            this.onOK();
            event.preventDefault(); // Prevents the addition of a new line in the text field
          }
        });
      });

    const buttonDiv = contentEl.createDiv({
      cls: "modal-button-container",
    });

    new ButtonComponent(buttonDiv)
      .setButtonText("OK")
      .setCta()
      .onClick(() => {
        this.onOK();
      })
      .setCta();

    new ButtonComponent(buttonDiv).setButtonText("Cancel").onClick(() => { this.close() });
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }

  onOK() {
    this.callback(this.textComponent.getValue());
    this.close();
  }
}

export async function saveAsModal(
  app: App,
  title: string | null,
  message: string,
  messagDefault: string = "",
  placeholder: string = "",
  multiLine: boolean = false,
  callback?: SaveAsCallback
): Promise<string | null> {
  return await new Promise((resolve, reject) => {
    new SaveAsModal(
      app,
      title,
      message,
      messagDefault,
      placeholder,
      multiLine,
      callback ??
        ((text: string | null) => {
          resolve(text);
        })
    ).open();
  });
}
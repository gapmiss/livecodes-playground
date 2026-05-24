import { App, Modal, setIcon } from "obsidian";
import { buttonTour } from "../settings/help";
import { copyStringToClipboard } from "../utils";

export class HelpModal extends Modal {
  title: string | undefined;
  message: string;
  icon: string;
  clickToCopy: boolean;
  steps: boolean;
  
  constructor(
    app: App,
    title: string | undefined = '',
    message: string | undefined = '',
    icon: string | undefined = '',
    clickToCopy: boolean = false,
    steps: boolean = false
  ) {
    super(app);
    this.title = title;
    this.message = message;
    this.icon = icon;
    this.clickToCopy = clickToCopy;
    this.steps = steps;
  }

  onOpen() {
    if (!this.message) {
      this.close();
    }
    
    let { contentEl } = this;
    contentEl.empty();
    
    contentEl.addClass("livecodes-help-modal");
    
    // Title and Message
    contentEl.createEl('h1', {text: this.title});
    const range = activeDocument.createRange();
    range.selectNodeContents(contentEl);
    // eslint-disable-next-line no-unsanitized/method -- message is static trusted content from help.ts
    const node = range.createContextualFragment(`${this.message}`);
    contentEl.append(node);

    // render icons
    if (activeDocument.querySelector('.alert-icon')) {
      setIcon(activeDocument.querySelector('.alert-icon')!, "alert-triangle");
    }
    
    // setup click-2-copy
    if (this.clickToCopy) {
      let inputEl = contentEl.querySelectorAll('[class$=-copy]');
      inputEl.forEach((el) => {
        let iconEl = contentEl.createSpan({cls: 'copy-icon', attr: {"aria-label":"Click to copy"}});
        setIcon(iconEl, "copy");
        iconEl.setAttribute('data-tooltip-position', 'top');
        iconEl.setAttribute('tabindex', '0');
        (el).insertAdjacentElement("beforebegin", iconEl);
        [iconEl,(el)].forEach((elt) => {
          elt.addEventListener("click", () => {
            void copyStringToClipboard(el?.textContent, el?.textContent);
          });
          elt.addEventListener('keydown', (evt) => {
            const keyDown = (evt as KeyboardEvent).key;
            if ( keyDown === 'Enter' || (['Spacebar', ' '].indexOf(keyDown) >= 0)) {
                evt.preventDefault();
                (elt as HTMLElement).click();
            }
          });
        });
      });
    }
    
    // render steps for playground help
    if (this.steps) {
      let toolButtons = activeDocument.querySelectorAll('[class$="-button clickable-icon"]');
      let button = activeDocument.querySelector('[data-step]');
      if (button) {
        button.addEventListener('click', (evt) => {
          const dataStep = (evt.target as HTMLElement).getAttribute('data-step') as unknown as number;
          this.close();
          new HelpModal(this.app, buttonTour[dataStep].popover.title, buttonTour[dataStep].popover.description, '', false, true).open();
          toolButtons[dataStep].addClass('button-highlight');
        });					
      }
      let prevButtons = activeDocument.querySelectorAll('[data-prev]');
      prevButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const dataPrev = button.getAttribute('data-prev') as unknown as number;
          this.close();
          new HelpModal(this.app, buttonTour[dataPrev-1].popover.title, buttonTour[dataPrev-1].popover.description, '', false, true).open();
          toolButtons[dataPrev-1].addClass('button-highlight');
        });
      });

      let stepsDiv: HTMLDivElement = activeDocument.createElement("div");
      stepsDiv.addClass("steps-bullets");
      let stepsList: HTMLElement = activeDocument.createElement("ul");
      stepsList.setAttribute("role", "tablist");
      let i:number = 0;
      let dataStep:HTMLElement|null = activeDocument.querySelector('[data-step]');
      let dataStepStr = dataStep!.getAttribute('data-step');
      while (i <= 9) {
        let newStep: HTMLElement = activeDocument.createElement("li");
        newStep.setAttribute("role", "presentation")
        let stepLink: HTMLElement = activeDocument.createElement("a");
        stepLink.setAttribute("role", "button");
        stepLink.setAttribute("tabindex", "0");
        let dataStepNum:number = +dataStepStr!;
        stepLink.setAttribute("aria-label", buttonTour[i].popover.title);
        stepLink.setAttribute("data-tooltip-position", 'top');
        if (i === dataStepNum-1) {
          stepLink.addClass("active");
          stepLink.setAttribute("aria-label", 'Current: ' + buttonTour[i].popover.title);
        }
        stepLink.setAttribute("data-step-number", `${i}`);
        stepLink.addEventListener("keydown", (evt) => {
          const keyDown = evt.key;
          if ( keyDown === 'Enter' || (['Spacebar', ' '].indexOf(keyDown) >= 0)) {
              evt.preventDefault();
              stepLink.click();
          }
        });
        stepLink.addEventListener("click", (evt) => {
          let dataStepNumber = (evt.target as HTMLElement).getAttribute('data-step-number') as unknown as number;
          this.close();
          new HelpModal(this.app, buttonTour[dataStepNumber].popover.title, buttonTour[dataStepNumber].popover.description, '', false, true).open();
          toolButtons[dataStepNumber].addClass('button-highlight');
        });
        newStep.appendChild(stepLink);
        stepsList.appendChild(newStep);
        i++;
      }
      stepsDiv.appendChild(stepsList);
      let pagingSpan = activeDocument.querySelector('div.modal-content.livecodes-help-modal div:has(span) > span');
      pagingSpan?.replaceWith(stepsDiv);
    }

  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
    activeDocument.querySelector(".button-highlight")?.removeClass('button-highlight');
  }

  copyStringToClipboard(text:string) {
    void navigator.clipboard.writeText(text);
  }

}

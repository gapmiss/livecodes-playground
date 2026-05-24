// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
import { AbstractInputSuggest, App, TFolder } from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<TFolder> {

    constructor(
        public inputEl: HTMLInputElement,
        public app: App,
    ) {
        super(app, inputEl);
    }
    getSuggestions(inputStr: string): TFolder[] {
        const lowerCaseInputStr = inputStr.toLowerCase();
        return this.app.vault.getAllFolders(true).filter(
            folder => folder.path.toLowerCase().contains(lowerCaseInputStr)
        );
    }

    renderSuggestion(file: TFolder, el: HTMLElement): void {
        el.setText(file.path);
    }

    selectSuggestion(file: TFolder): void {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}
import { type App, MarkdownRenderChild, normalizePath, FileSystemAdapter } from "obsidian";
import Component from "../components/Codeblock.svelte";

// @ts-ignore
import { config } from 'livecodes';

export class CodeblockRenderChild extends MarkdownRenderChild {

	adapter: FileSystemAdapter;

	constructor(
		container: HTMLElement,
		private app: App,
		private source: string,
		private settings: any,
	) {
		super(container);
		this.adapter = this.app.vault.adapter as FileSystemAdapter;
	}

	onload(): void {
		this.render();
	}

	private async render() {
		while (this.containerEl.firstChild) {
			this.containerEl.removeChild(this.containerEl.firstChild);
		}
		let part:string = this.source.trim().substring(2);
		let content:string = part.substring(part.length-2,0).trim();
		let templatePath = this.settings.templateFolder + "/" + content;
		let newTemplate: Partial<config>;

		let tplPath:string|undefined = normalizePath(templatePath);
		let tpl = await this.adapter.read(tplPath);
		newTemplate = JSON.parse(tpl) as Partial<config>;

		const props = {
			source: this.source,
			template: newTemplate,
			tplPath: tplPath
		};

		new Component({
			target: this.containerEl,
			props: props,
		});
	}

}
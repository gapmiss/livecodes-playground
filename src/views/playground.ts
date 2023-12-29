/**
 * https://github.com/jgblight/obsidian-event-calendar/
 */
import { type App, MarkdownRenderChild, normalizePath, FileSystemAdapter } from "obsidian";
import Playground from "../components/Playground.svelte";
// import LivecodesPlugin from "../main";
// import { main } from "@popperjs/core";
// @ts-ignore
import { config } from 'livecodes';

export class PlaygroundRenderChild extends MarkdownRenderChild {
	// private collection: DataSourceCollection;
	adapter: FileSystemAdapter;
	constructor(
		container: HTMLElement,
		private app: App,
		private source: string,
		private settings: any,
	) {
		super(container);
		this.adapter = this.app.vault.adapter as FileSystemAdapter;
/*/
		const dv = app.plugins.plugins.dataview?.api;
		if (dv == undefined) {
			throw new Error("No DataviewApi available");
		}
		
		this.collection = new DataSourceCollection(
			parseDataSources(this.source),
			this.app,
			dv,
			this.settings
		);
/**/
	}

	onload(): void {
		this.render();
		// this.registerEvent(
		// 	this.app.workspace.on("calendar-update", () => {
		// 		this.render();
		// 	})
		// );
	}

	private async render() {
		// this.collection.updateCache().then(() => {
			while (this.containerEl.firstChild) {
				this.containerEl.removeChild(this.containerEl.firstChild);
			}
			// const plugin = this.app.plugins.plugins['livecodes-for-obsidian'];
			// console.log('this.source.trim()');
			// console.log(this.source.trim());
			let part:string = this.source.trim().substring(2);
			// console.log('part');
			// console.log(part);
			let content:string = part.substring(part.length-2,0).trim();
			// console.log('content');
			// console.log(content);
			// console.log(this.settings.templateFolder + "/" + content);
			let templatePath = this.settings.templateFolder + "/" + content;
			// console.log('templatePath');
			// console.log(templatePath);

			
			let newTemplate: Partial<config>;
			// let tplPath: string|undefined;
			// if (foundTemplate) {
				let tplPath:string|undefined = normalizePath(templatePath);
				let tpl = await this.adapter.read(tplPath);
				newTemplate = JSON.parse(tpl) as Partial<config>;
			// }

			const props = {
				source: this.source,
				template: newTemplate,
				tplPath: tplPath
			};

				new Playground({
					target: this.containerEl,
					props: props,
				});

		// });
	}
}
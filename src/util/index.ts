import { normalizePath, Notice, type App } from "obsidian";

/**
 * 
 * derived from https://github.com/DaRae-00/obsidian-sketch-md-plugin/blob/main/src/util/features.ts
 * 
 */
export function saveJson(
	app: App,
	path: string,
	content: string
) {
	// const markdownView = app.workspace.getActiveViewOfType(MarkdownView);
	// if (!markdownView) {
	// 	return;
	// }
	// const editor = markdownView.editor;
	// if (!editor) {
	// 	return;
	// }
	saveTemplateToFile(app, path, content);
}

async function saveTemplateToFile(
	app: App,
	path: string,
	content: string
) {
	const filePath = normalizePath(path);
	await app.vault.adapter.write(filePath, content);
}

/**
 * 
 * 
 */
export async function downloadFile(data: BlobPart, fileName: string, type="text/plain") {
	const a = window.document.createElement("a");
	a.style.display = "none";
	window.document.body.appendChild(a);
	a.href = window.URL.createObjectURL(
		new Blob([data], { type })
	);
	a.setAttribute("download", fileName);
	a.click();
	window.URL.revokeObjectURL(a.href);
	window.document.body.removeChild(a);
	return;
}

/**
 * from: https://github.com/Obsidian-TTRPG-Community/TTRPG-Community-Admin/
 */
export async function copyStringToClipboard(text:string, topic:string|undefined=undefined) {
  navigator.clipboard
		.writeText(text)
		.then(function () {
			new Notice((topic !== undefined ? topic + " " : "") + "copied to clipboard", 2500);
		})
		.catch(function (error) {
			console.error('Failed to copy to clipboard: ', error)
		})
}

export const blankTemplate = {
	appUrl: "https://v19.livecodes.io/",
	title: "New Project",
	description: "",
	head: "<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
	htmlAttrs: "lang=\"en\" class=\"\"",
	tags: [],
	autoupdate: false,
	autosave: false,
	autotest: false,
	delay: 1500,
	formatOnsave: false,
	mode: "full",
	theme: "dark",
	recoverUnsaved: true,
	showSpacing: false,
	welcome: true,
	readonly: false,
	allowLangChange: true,
	activeEditor: "markup",
	markup: {
		language: "html",
		content: ""
	},
	style: {
		language: "css",
		content: ""
	},
	script: {
		language: "javascript",
		content: ""
	},
	stylesheets: [],
	scripts: [],
	cssPreset: "normalize.css",
	imports: {},
	types: {},
	tests: {
		language: "typescript",
		content: ""
	},
	tools: {
		enabled: "all",
		active: "console",
		status: "open"
	},
	zoom: 1,
	processors: [],
	customSettings: {},
	editor: "monaco",
	fontFamily: "Iosevka",
	fontSize: 12,
	useTabs: false,
	tabSize: 2,
	lineNumbers: true,
	wordWrap: false,
	closeBrackets: true,
	semicolons: true,
	singleQuote: false,
	trailingComma: true,
	emmet: false,
	version: "19"
};

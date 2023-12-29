import { MarkdownView, normalizePath, type App } from "obsidian";

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
	const markdownView = app.workspace.getActiveViewOfType(MarkdownView);
	if (!markdownView) {
		return;
	}
	const editor = markdownView.editor;
	if (!editor) {
		return;
	}
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
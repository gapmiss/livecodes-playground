<script lang="ts">
	import {Notice} from 'obsidian';
	import { createPlayground, EmbedOptions } from "livecodes";
	import { onMount } from 'svelte';
	import {saveJson, downloadFile, copyStringToClipboard}  from "../util";
	import { openPromptModal } from "../modals/prompt-modal";
	
	const app = this.app;
  const plugin = app.plugins.plugins['livecodes-for-obsidian'];
	let container: any;
  let playground: any;
	let watcher: { remove: () => void; } | null;
	
	export let template: any;
	export let tplPath: string;

	let copyHTML:HTMLButtonElement;
	let downloadHTML:HTMLButtonElement;
	let saveAsJSON:HTMLButtonElement;
	let copyShareUrl:HTMLButtonElement;
	let toggleTheme:HTMLButtonElement;
	let onWatch:HTMLButtonElement;

	const options: EmbedOptions = {
		config: template!,
		appUrl: plugin.settings.appUrl,
		params: {
			// @ts-ignore
			editorTheme: plugin.settings.editorTheme,
			autoupdate: plugin.settings.autoUpdate,
			delay: plugin.settings.delay,
			theme: plugin.settings.darkTheme ? "dark" : "light",
			fontFamily: plugin.settings.fontFamily,
			fontSize: Number(plugin.settings.fontSize),
			closeBrackets: plugin.settings.closeBrackets,
			trailingComma: plugin.settings.trailingComma,
			singleQuote: plugin.settings.singleQuote,
			semicolons: plugin.settings.semicolons,
			useTabs: plugin.settings.useTabs,
			tabSize: Number(plugin.settings.tabSize),
			console: "open", // or full
			lineNumbers: plugin.settings.lineNumbers,
			wordWrap: plugin.settings.wordWrap,
			editor: plugin.settings.editor,
			version: "19"
		},
		loading: "eager",
	};

	onMount(() => {

		createPlayground(container, options).then((p) => {
		
			playground = p; // now the SDK is available

			copyHTML.addEventListener(
				"click", 
				async (e) => {
					e.preventDefault();
					try {
						const code = await playground.getCode();
						await copyStringToClipboard(code.result, "HTML code");
					} catch (error) {
						console.log(error.message || error);
					}
				}
			);

			downloadHTML.addEventListener(
				"click", 
				async (e) => {
					e.preventDefault();
					new Notice("Preparing download…");
					try {
						const code = await playground.getCode();
						let fileName = tplPath.substring(tplPath.lastIndexOf("/") + 1, tplPath.length);
						downloadFile(code.result, fileName.replace(/\.json/,".html"));
					} catch (error) {
						console.log(error.message || error);
					}
				}
			);

			onWatch.addEventListener(
				"click", 
				async (e) => {
					e.preventDefault();
					try {
						if (!watcher) {
							new Notice("Watching for changes");
							//@ts-ignore
							watcher = playground.watch('code', ({code, config}) => {
								handleWatchedTemplate(tplPath, config);
								new Notice("Changes saved");
							});
							onWatch.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';
							onWatch.setAttribute("aria-label","Stop watching for changes");
							onWatch.setAttribute("style", "color:var(--color-red);");
						} else {
							watcher?.remove();
							watcher = null;
							onWatch.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
							onWatch.setAttribute("aria-label","Watch for changes");
							onWatch.setAttribute("style", "color:unset");
							new Notice("Stopped watching for changes");
						}
					} catch (error) {
						console.log(error.message || error);
					}
				}
			);

			toggleTheme.addEventListener(
				"click", 
				async (e) => {
					e.preventDefault();
					const currentTheme = plugin.settings.darkTheme ? "dark" : "light";
					try {
						if (currentTheme !== "dark") {
							await playground.setConfig({theme:"dark"})
							plugin.settings.darkTheme = true;
							toggleTheme.setAttribute(
								"aria-label",
								"Set light mode"
							);
						} else {
							await playground.setConfig({theme:"light"})
							plugin.settings.darkTheme = false;
							toggleTheme.setAttribute(
								"aria-label",
								"Set dark mode"
							);
						}
					} catch (error) {
						console.log(error.message || error);
					}
				}
			);

			saveAsJSON.addEventListener(
				"click", 
				async (e) => {
					e.preventDefault();
					const cfg = await playground.getConfig();
					console.log('cfg');
					console.log(cfg);
					let fName = await openPromptModal(this.app, "Livecodes", "Save template as:", "", "e.g. New Project", false);
					if (fName?.length === 0) {
						return;
					}
					let prettyCfg: string|undefined = JSON.stringify(cfg, null, 2);
					try {
						await this.app.vault.create(
							plugin.settings.templateFolder+'/'+fName + ".json",
							await createText(
								prettyCfg
							)
						);
						new Notice("Template saved as: " + plugin.settings.templateFolder+'/'+fName + ".json");
					} catch (error) {
						new Notice("🔔 " + error + " Click this message to dismiss.", 0);
					}
				}
			);

			copyShareUrl.addEventListener(
				"click", 
				async (e) => {
					e.preventDefault();
					try {
						const shareUrl = await playground.getShareUrl();
						await copyStringToClipboard(shareUrl, "Share URL");
					} catch (error) {
						console.log(error.message || error);
					}
				}
			);

	})

});

const handleWatchedTemplate = (tplPath: string, output: any) => {
	// output.config.head = ""; // manipulate the config object
	saveJson(app, tplPath, JSON.stringify(output, null, 2));
};

const createText = async (
		fileContent: string|undefined
	): Promise<string> => {
		return fileContent?.trim() as string;
}
</script>

<div
	class="livecodes-wrapper">
	<div
		bind:this="{container}"
		data-height="{plugin.settings.dataHeight || '300'}">
	</div>

	<div class="buttons-wrapper">
		<button
			aria-label="Watch for changes"
			bind:this={onWatch}
			data-tooltip-position="top">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
		</button>
		<button
			aria-label="Toggle theme"
			bind:this={toggleTheme}
			data-tooltip-position="top">
			{#if plugin.settings.darkTheme}
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
			{/if}
		</button>
		<button
			aria-label="Save as JSON template"
			bind:this={saveAsJSON}
			data-tooltip-position="top">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
		</button>
		<button
			aria-label="Copy share URL to clipboard"
			bind:this={copyShareUrl}
			data-tooltip-position="top">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
		</button>
		<button
			aria-label="Copy HTML to clipboard"
			bind:this={copyHTML}
			data-tooltip-position="top">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
		</button>
		<button
			aria-label="Download HTML"
			bind:this={downloadHTML}
			data-tooltip-position="top">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
		</button>
	</div>
</div>

<style>
	.buttons-wrapper {
		display: flex;
  	justify-content: center;
  	align-items: center;
		margin-bottom: 1em;
	}
	.buttons-wrapper button {
		margin-inline: .25em;
	}
	.buttons-wrapper button:hover svg {
		color: var(--text-accent);
	}
</style>

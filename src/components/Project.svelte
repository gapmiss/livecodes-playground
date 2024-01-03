<script lang="ts">
	import {Notice, setIcon} from 'obsidian';
	import { createPlayground, EmbedOptions } from "livecodes";
	import { onMount } from 'svelte';
	import {saveJson, downloadFile, copyStringToClipboard}  from "../util";
	import { openPromptModal } from "../modals/prompt-modal";
	
	const app = this.app;
  const plugin = app.plugins.plugins['livecodes-for-obsidian'];
	let container: any;
  let playground: any;
	let watcher: { remove: () => void; } | null;

	export let projectOptions: any;
	// export let tplPath: string;

	let copyHTML:HTMLButtonElement;
	let downloadHTML:HTMLButtonElement;
	let saveAsJSON:HTMLButtonElement;
	let copyShareUrl:HTMLButtonElement;
	let toggleTheme:HTMLButtonElement;
	let onWatch:HTMLButtonElement;


	onMount(() => {

		createPlayground(container, projectOptions).then((p) => {
		
			playground = p;

			setIcon(copyHTML, 'clipboard-copy');
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

			// setIcon(downloadHTML, 'file-code-2');
			// downloadHTML.addEventListener(
				// "click", 
				// async (e) => {
					// e.preventDefault();
					// new Notice("Preparing HTML");
					// try {
						// const code = await playground.getCode();
						// let fileName = tplPath.substring(tplPath.lastIndexOf("/") + 1, tplPath.length);
						// downloadFile(code.result, fileName.replace(/\.json/,".html"));
					// } catch (error) {
						// console.log(error.message || error);
					// }
				// }
			// );
			
			// setIcon(onWatch, 'eye');
			// onWatch.addEventListener(
			// 	"click", 
			// 	async (e) => {
			// 		e.preventDefault();
			// 		try {
			// 			if (!watcher) {
			// 				new Notice("Watching for changes");
			// 				//@ts-ignore
			// 				watcher = playground.watch('code', ({code, config}) => {
			// 					handleWatchedTemplate(tplPath, config);
			// 					new Notice("Changes saved");
			// 				});
			// 				setIcon(onWatch, 'eye-off');
			// 				// onWatch.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';
			// 				onWatch.setAttribute("aria-label","Stop watching for changes");
			// 				onWatch.setAttribute("style", "color:var(--text-error);");
			// 			} else {
			// 				watcher?.remove();
			// 				watcher = null;
			// 				setIcon(onWatch, 'eye');
			// 				// onWatch.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
			// 				onWatch.setAttribute("aria-label","Watch for changes and SAVE");
			// 				onWatch.setAttribute("style", "color:unset;");
			// 				new Notice("Stopped watching for changes");
			// 			}
			// 		} catch (error) {
			// 			console.log(error.message || error);
			// 		}
			// 	}
			// );

			if (plugin.settings.darkTheme) {
				setIcon(toggleTheme, 'sun');
			} else {
				setIcon(toggleTheme, 'moon');
			}
			toggleTheme.addEventListener(
				"click", 
				async (e) => {
					e.preventDefault();
					const currentTheme = plugin.settings.darkTheme ? "dark" : "light";
					try {
						if (currentTheme !== "dark") {
							await playground.setConfig({theme:"dark"})
							plugin.settings.darkTheme = true;
							setIcon(toggleTheme, 'sun');
							toggleTheme.setAttribute(
								"aria-label",
								"Set light mode"
							);
						} else {
							await playground.setConfig({theme:"light"})
							plugin.settings.darkTheme = false;
							setIcon(toggleTheme, 'moon');
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

			setIcon(saveAsJSON, 'download');
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
						new Notice("❌ " + error + " Click this message to dismiss.", 0);
					}
				}
			);

			setIcon(copyShareUrl, 'link');
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
		<!-- <button
			aria-label="Watch for changes & SAVE"
			bind:this={onWatch}
			data-tooltip-position="bottom">
		</button> -->
		<button
			aria-label="Save as JSON template"
			bind:this={saveAsJSON}
			data-tooltip-position="bottom">
		</button>
		<button
			aria-label="Set {plugin.settings.darkTheme ? 'light' : 'dark'} mode"
			bind:this={toggleTheme}
			data-tooltip-position="bottom">
		</button>
		<button
			aria-label="Copy share URL to clipboard"
			bind:this={copyShareUrl}
			data-tooltip-position="bottom">
		</button>
		<button
			aria-label="Copy as HTML to clipboard"
			bind:this={copyHTML}
			data-tooltip-position="bottom">
		</button>
		<!-- <button
			aria-label="Save as HTML file"
			bind:this={downloadHTML}
			data-tooltip-position="bottom">
		</button> -->
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
	/* .buttons-wrapper button:hover svg {
		color: var(--text-accent);
	} */
</style>

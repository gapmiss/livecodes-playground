<script lang="ts">
	import { Notice, WorkspaceLeaf, setIcon } from "obsidian";
	import {
		createPlayground,
		EmbedOptions
	} from "livecodes";
	import { onMount } from "svelte";
	import {
		saveJson,
		downloadFile,
		copyStringToClipboard
	} from "../util";
	import { openPromptModal } from "../modals/prompt-modal";
	import { openExternalResourcesModal } from "../modals/external-resources-modal";
	import { openProjectSettingsModal } from "../modals/project-settings-modal";
	import moment from "moment";

	const app = this.app;
	const plugin = app.plugins.plugins["livecodes-for-obsidian"];
	let container: any;
	let playground: any;
	let watcher: { remove: () => void } | null;

	export let jsonTemplate: any;
	export let tplPath: string;

	let copyHTML: HTMLButtonElement;
	let downloadHTML: HTMLButtonElement;
	let createNote: HTMLButtonElement;
	let saveAsJSON: HTMLButtonElement;
	let copyShareUrl: HTMLButtonElement;
	let toggleTheme: HTMLButtonElement;
	let onWatch: HTMLButtonElement;
	let openExternalResources: HTMLButtonElement;
	let openProjectSettings: HTMLButtonElement;
	let leaf: WorkspaceLeaf; 

	const options: EmbedOptions = {
		config: jsonTemplate!,
		appUrl: plugin.settings.appUrl,
		params: {
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
			version: "19",
		},
		loading: "eager",
	};

	onMount(() => {
		createPlayground(container, options).then((p) => {
			playground = p;

			setIcon(copyHTML, "clipboard");
			copyHTML.addEventListener("click", async (e) => {
				e.preventDefault();
				try {
					const code = await playground.getCode();
					await copyStringToClipboard(code.result, "HTML code");
				} catch (error) {
					console.log(error.message || error);
				}
			});

			setIcon(downloadHTML, "file-code-2");
			downloadHTML.addEventListener("click", async (e) => {
				e.preventDefault();
				new Notice("Preparing HTML");
				try {
					const code = await playground.getCode();
					let fileName = tplPath.substring(
						tplPath.lastIndexOf("/") + 1,
						tplPath.length
					);
					downloadFile(
						code.result,
						fileName.replace(/\.json/, ".html")
					);
				} catch (error) {
					console.log(error.message || error);
				}
			});

			setIcon(onWatch, "eye");
			onWatch.addEventListener("click", async (e) => {
				e.preventDefault();
				try {
					if (!watcher) {
						new Notice("Watching for changes");
						watcher = playground.watch(
							"code",
							//@ts-ignore
							({ config }) => {
								handleWatchedTemplate(tplPath, config);
								new Notice("Changes saved");
							}
						);
						setIcon(onWatch, "eye-off");
						onWatch.setAttribute(
							"aria-label",
							"Stop watching for changes"
						);
						onWatch.setAttribute(
							"style",
							"color:var(--text-error);"
						);
					} else {
						watcher?.remove();
						watcher = null;
						setIcon(onWatch, "eye");
						onWatch.setAttribute(
							"aria-label",
							"Watch for changes and SAVE"
						);
						onWatch.setAttribute("style", "color:unset;");
						new Notice("Stopped watching for changes");
					}
				} catch (error) {
					console.log(error.message || error);
				}
			});

			if (plugin.settings.darkTheme) {
				setIcon(toggleTheme, "sun");
			} else {
				setIcon(toggleTheme, "moon");
			}
			toggleTheme.addEventListener("click", async (e) => {
				e.preventDefault();
				const currentTheme = plugin.settings.darkTheme
					? "dark"
					: "light";
				try {
					if (currentTheme !== "dark") {
						await playground.setConfig({ theme: "dark" });
						plugin.settings.darkTheme = true;
						setIcon(toggleTheme, "sun");
						toggleTheme.setAttribute(
							"aria-label",
							"Set light mode"
						);
					} else {
						await playground.setConfig({ theme: "light" });
						plugin.settings.darkTheme = false;
						setIcon(toggleTheme, "moon");
						toggleTheme.setAttribute("aria-label", "Set dark mode");
					}
				} catch (error) {
					console.log(error.message || error);
				}
			});

			setIcon(saveAsJSON, "file-json-2");
			saveAsJSON.addEventListener("click", async (e) => {
				e.preventDefault();
				const cfg = await playground.getConfig();
				let fName = await openPromptModal(
					this.app,
					"Livecodes",
					"Save playground as:",
					"",
					"e.g. New Project",
					false
				);
				if (fName?.length === 0) {
					return;
				}
				let prettyCfg: string | undefined = JSON.stringify(
					cfg,
					null,
					2
				);
				try {
					await this.app.vault.create(
						plugin.settings.playgroundFolder + "/" + fName + ".json",
						await createText(prettyCfg)
					);
					new Notice(
						"Template saved as: " +
							plugin.settings.playgroundFolder +
							"/" +
							fName +
							".json"
					);
				} catch (error) {
					new Notice(
						"❌ " + error + " Click this message to dismiss.",
						0
					);
				}
			});
			// addIcon("notebook-pen", '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-pen"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M18.4 2.6a2.17 2.17 0 0 1 3 3L16 11l-4 1 1-4Z"/></svg>');
			setIcon(createNote, "file-plus-2");
			createNote.addEventListener("click", async (e) => {
				e.preventDefault();
				const cfg = await playground.getConfig();
				let fName = await openPromptModal(
					this.app,
					"Livecodes",
					"Save note as:",
					tplPath.substring(tplPath.lastIndexOf("/") + 1, tplPath.length).replace(/\.json/, ""),
					"e.g. New Playground README",
					false
				);
				if (fName?.length === 0) {
					return;
				}
				// let prettyCfg: string | undefined = JSON.stringify(
				// 	cfg,
				// 	null,
				// 	2
				// );
				try {
					let markDown:string = '';
					let link:string = "obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&tplPath="+encodeURIComponent(tplPath);
					markDown += "---\ncreated: "+moment().format("YYYY-MM-DD")+"\nplayground: \""+link+"\"\n---\n\n";
					if (cfg.markup.content !== "") {
						markDown += "## "+cfg.markup.language+"\n\n```"+cfg.markup.language+"\n"+cfg.markup.content+"\n```\n\n";
					}
					if (cfg.style.content !== "") {
						markDown += "## "+cfg.style.language+"\n\n```"+cfg.style.language+"\n"+cfg.style.content+"\n```\n\n";
					}
					if (cfg.script.content !== "") {
						markDown += "## "+cfg.script.language+"\n\n```"+cfg.script.language+"\n"+cfg.script.content+"\n```\n\n";
					}
					await this.app.vault.create(
						plugin.settings.notesFolder + "/" + fName + ".md",
						await createText(markDown)
					);
					new Notice(
						"Note saved as: " +
							plugin.settings.notesFolder +
							"/" +
							fName
					);
					// await this.leaf.open(plugin.settings.notesFolder + "/" + fName + ".md")
					await this.app.workspace.openLinkText(fName, plugin.settings.notesFolder);
				} catch (error) {
					new Notice(
						"❌ " + error + " Click this message to dismiss.",
						0
					);
				}
			});

			setIcon(copyShareUrl, "link");
			copyShareUrl.addEventListener("click", async (e) => {
				e.preventDefault();
				try {
					const shareUrl = await playground.getShareUrl();
					await copyStringToClipboard(shareUrl, "Share URL");
				} catch (error) {
					console.log(error.message || error);
				}
			});

			setIcon(openExternalResources, "folder-cog");
			openExternalResources.addEventListener("click", async (e) => {
				e.preventDefault();
				try {
					let conf = {
						stylesheets: await playground.getConfig().then((t: any) => {return t.stylesheets}),
						scripts: await playground.getConfig().then((t: any) => {return t.scripts}),
						cssPreset: await playground.getConfig().then((t: any) => {return t.cssPreset})
					};
					await openExternalResourcesModal(
							this.app,
							this.plugin,
							"External resources",
							conf
						)
						.then(
							async (setting) => {
								let newConfig = JSON.parse(setting as unknown as string);
								await playground.setConfig({ 
									stylesheets: newConfig.stylesheets,
									scripts: newConfig.scripts,
									cssPreset: newConfig.cssPreset
								});
							}
						);
				} catch (error) {
					console.log(error.message || error);
				}
			});

			setIcon(openProjectSettings, "cog");
			openProjectSettings.addEventListener("click", async (e) => {
				e.preventDefault();
				try {
					let conf = {
						title: await playground.getConfig().then((t: any) => {return t.title}),
						description: await playground.getConfig().then((t: any) => {return t.description}),
						head: await playground.getConfig().then((t: any) => {return t.head}),
						htmlAttrs: await playground.getConfig().then((t: any) => {return t.htmlAttrs})
					};
					await openProjectSettingsModal(
							this.app,
							this.plugin,
							"Project settings",
							conf
						)
						.then(
							async (setting) => {
								let newConfig = JSON.parse(setting as unknown as string);
								await playground.setConfig({ 
									title: newConfig.title,
									description: newConfig.description,
									head: newConfig.head,
									htmlAttrs: newConfig.htmlAttrs
								});
							}
						);
				} catch (error) {
					console.log(error.message || error);
				}
			});

			if (plugin.settings.autoWatch) {
				try {
					setIcon(onWatch, "eye-off");
					onWatch.setAttribute(
						"aria-label",
						"Stop watching for changes"
					);
					onWatch.setAttribute(
						"style",
						"color:var(--text-error);"
					);
					watcher = playground.watch(
						"code",
						//@ts-ignore
						({ config }) => {
							handleWatchedTemplate(tplPath, config);
							new Notice("Changes saved");
						}
					);
				} catch (error) {
					console.log(error.message || error);
				}
			}

		});
	});

	const handleWatchedTemplate = (tplPath: string, output: any) => {
		saveJson(app, tplPath, JSON.stringify(output, null, 2));
	};

	const createText = async (
		fileContent: string | undefined
	): Promise<string> => {
		return fileContent?.trim() as string;
	};
</script>

<div class="livecodes-wrapper">
	<div
		bind:this={container}
		data-height={plugin.settings.dataHeight || "300"}
	/>

	<div class="buttons-wrapper">
		<button
			aria-label="Watch for changes & SAVE"
			bind:this={onWatch}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="Create note"
			bind:this={createNote}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="Save as JSON"
			bind:this={saveAsJSON}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="Save as HTML"
			bind:this={downloadHTML}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="Copy HTML to clipboard"
			bind:this={copyHTML}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="Copy share URL to clipboard"
			bind:this={copyShareUrl}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="Set {plugin.settings.darkTheme ? 'light' : 'dark'} mode"
			bind:this={toggleTheme}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="External resources"
			bind:this={openExternalResources}
			data-tooltip-position="bottom"
		/>
		<button
			aria-label="Project settings"
			bind:this={openProjectSettings}
			data-tooltip-position="bottom"
		/>
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
		margin-inline: 0.25em;
	}
</style>
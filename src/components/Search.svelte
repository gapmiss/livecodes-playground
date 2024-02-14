<script lang="ts">
  import { Notice, setIcon, TFile, TFolder, Vault, debounce, ButtonComponent } from "obsidian";
  import { onMount } from "svelte";
	import type { TypedDocument, Orama, Results, SearchParams, Language } from '@orama/orama';
	import { create, insert, remove, search, searchVector, count } from '@orama/orama';
	import {INDICATOR_SVG} from "../assets/indicator";
	
	type PlaygroundDocument = TypedDocument<Orama<typeof playgroundSchema>>;
	const playgroundSchema = {
		path: 'string',
		title: 'string',
		description: 'string',
		head: 'string',
		htmlAttrs: 'string',
		tags: 'string[]',
		markup: {
			language: 'string',
			content: 'string'
		},
		style: {
			language: 'string',
			content: 'string'
		},
		script: {
			language: 'string',
			content: 'string'
		},
		scripts: 'string[]',
		stylesheets: 'string[]'
	} as const;

  const app = this.app;
  const plugin = app.plugins.plugins["livecodes-playground"];

	let param:any;
	let entries:any[] = [];
  let searchButton: HTMLButtonElement;
	let searchInput: HTMLInputElement;
	// let openPlayground: HTMLDivElement;

	let debouncAction = debounce(
		async () => {
			entries = [];
			let playgroundDB = await setIndex();
		
			setTimeout(async () => {
				const searchParams: SearchParams<Orama<typeof playgroundSchema>> = {
					term: searchInput.value,
					limit: 1000
				};
				// @ts-ignore
				const result: Results<PlaygroundDocument> = await search(playgroundDB, searchParams);
				result.hits.forEach((hit) => {
					// https://learn.svelte.dev/tutorial/updating-arrays-and-objects
					entries = [...entries, {title: hit.document.title, path: hit.document.path, score: hit.score}];
				});
				return Promise.resolve(entries);
			}, 500);
			document.querySelector(".no-result")?.setAttribute("style", "display: none;");
		},
		1500
	);

	function handleCreateNote(e:MouseEvent) {
		e.preventDefault();
		console.log('handleCreateNote');
		console.log(e.target);
	}

	function handleOpenJson(e:MouseEvent) {
		e.preventDefault();
		console.log('handleOpenJson');
		console.log(e.target);
	}

	function handleKeypress(e:KeyboardEvent) {
		if (e.key === 'Enter') {
			document.querySelector(".search-results-wrapper")?.setAttr("style", "display:none;");
			document.querySelector(".no-result")?.setAttribute("style", "display: flex;");
			debouncAction();
			
		}
	}

	async function setIndex():Promise<Orama<{ readonly path: "string"; readonly title: "string"; readonly description: "string"; readonly head: "string"; readonly htmlAttrs: "string"; readonly tags: "string[]"; readonly markup: { readonly language: "string"; readonly content: "string"; }; readonly style: {  }; readonly script: { }; readonly scripts: "string[]"; readonly stylesheets: "string[]"; }>|any> {
		const playgroundDB: Orama<typeof playgroundSchema> = await create({
			schema: playgroundSchema,
		});
		if (playgroundDB) {
			try {
				const f = this.app.vault.getAbstractFileByPath(plugin.settings.playgroundFolder);
				if (f instanceof TFolder && f.children.length > 0) {

					let playgrounds = getPlaygroundsInFolder(f);
					
						playgrounds.forEach(async (doc) => {
							let jsonFile:TFile = this.app.vault.getAbstractFileByPath(doc.path) as TFile;
							let playgroundJson = await this.app.vault.read(jsonFile)
							try {
								let jsonContent = JSON.parse(playgroundJson);
								await insert(playgroundDB, {
									path: `${jsonFile.path}`,
									title: jsonContent.title,
									description: jsonContent.description,
									head: jsonContent.head,
									htmlAttrs: jsonContent.htmlAttrs,
									tags: (jsonContent.tags) ? jsonContent.tags : "",
									markup: {
										language: (jsonContent.markup.language !== undefined) ? jsonContent.markup.language : "",
										content: jsonContent.markup.content||""
									},
									style: {
										language: (jsonContent.style.language !== undefined) ? jsonContent.style.language : "",
										content: jsonContent.style.content||""
									},
									script: {
										language: (jsonContent.script.language !== undefined) ? jsonContent.script.language : "",
										content: jsonContent.script.content||""
									},
									scripts: jsonContent.scripts||"",
									stylesheets: jsonContent.stylesheets||""
								})
								.then((idP)=>{
									// console.log('idP');
									// console.log(idP);
								});
							} catch (error) {
								console.log(error.message || error);
							}
						});
				}
			} catch (error) {
				console.log(error.message || error);
			}
			return playgroundDB;
		}
	}

	function getPlaygroundsInFolder(folder: TFolder): TFile[] {
    let files: TFile[] = [];
    Vault.recurseChildren(folder, (file) => {
      if (file instanceof TFile && file.extension === 'json') {
        files.push(file);
      }
    });
		// return files;
    return files.sort( (a: { name: string; },b: { name: string; }) => {
      return a.name.localeCompare(b.name);
    });
	}
	
	function createNoteHandler(node: HTMLElement, param: any) {
		setIcon(node, "file-plus-2");
		node.addEventListener("click", (e) => {
			e.preventDefault();
			console.log(e.target);
			console.log(e);
			console.log(param);
		});
	}
	
	function openJsonHandler(node: HTMLElement, param: any) {
		setIcon(node, "file-json-2");
		node.addEventListener("click", (e) => {
			e.preventDefault();
			console.log(e.target);
			console.log(e);
			console.log(param);
		});
		// return {
		// 	update(node: any) {
		// 		// the value has changed
		// 	},
		// 	destroy() {
		// 		// the node has been removed from the DOM
		// 	}
		// };
	}

	onMount(() => {
		searchInput.focus();
		searchButton.addEventListener("click", async (e):Promise<any> => {
			e.preventDefault();
			document.querySelector(".search-results-wrapper")?.setAttr("style", "display:none;");
			document.querySelector(".no-result")?.setAttribute("style", "display: flex;");
			debouncAction();
		});

	});

</script>

<div class="search-form-wrapper">
	<input 
		type="text"
		placeholder="Search…"
		bind:this={searchInput}
		on:keypress={handleKeypress}
	/>
	<button
		aria-label="Search"
		bind:this={searchButton}
		data-tooltip-position="bottom"
	>
		Search
	</button>
</div>

{#if entries.length}
<div class="search-results-wrapper">
	<div class="results-note">
		{entries.length} playgrounds found
	</div>
	{#each entries as item}
		<div 
			class="result-row" 
			aria-label="score: {`${Math.round(item.score * 10000) / 10000}`}"
			data-tooltip-position="top"
		>
			<div>
				<a 
					href="obsidian://playground?vault={encodeURIComponent(app.vault.getName())}&playgroundPath={encodeURIComponent(item.path)}" 
					aria-label="Open playground: {item.path.replace(plugin.settings.playgroundFolder+'/', "")}" 
					data-tooltip-position="left"
				>
					{item.title}
				</a>
			</div>
			<div>
				<button 
					use:createNoteHandler={item.path} 
					class="clickable-icon setting-editor-extra-setting-button" 
					aria-label="Create note"
				>
				</button>
			</div>
			<div>
				<button 
					use:openJsonHandler={item.path} 
					class="clickable-icon setting-editor-extra-setting-button" 
					aria-label="Open JSON"
				>
				</button>
			</div>
		</div>	
		
	{:else}
		<div class="search-results-wrapper">
			<div class="no-result">
				No playgrounds found
			</div>
		</div>
	{/each}
</div>
<!-- {:else}
	<div class="search-results-wrapper"></div> -->
{/if}
<div class="no-result" style="display: none;">
	{@html INDICATOR_SVG}
</div>

<style>
.search-form-wrapper {
	display: flex;
	align-items: center;
  flex-wrap: wrap;
  gap: .5em;
	justify-content: center;
}
.search-form-wrapper button {
	flex-grow: 1;
	cursor: pointer;
}
.search-form-wrapper input {
	flex-grow: 3;
}
.search-results-wrapper {
	padding: 0;
}
.no-result {
	display: flex;
	align-items: center;
  flex-wrap: nowrap;
  gap: .15em;
	justify-content: center;
	padding: 3em;
	color: var(--color-base-60);
}
.result-row:hover {
	background-color: var(--color-base-30);
}
.result-row {
	display: flex;
	align-items: center;
  flex-wrap: nowrap;
  gap: .15em;
	justify-content: center;
}
.result-row div:has(a) {
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
  flex-grow: 1;
  flex-basis: 160px;
	width:100%;
}
.result-row a {
	display: inline-block;
	border:3px solid transparent;
	padding: var(--size-2-3);
}
.result-row a:focus {
	
	border: 3px solid var(--background-modifier-border-focus);
	border-radius: var(--size-2-3);
}
.result-row div:has(button) {
	display: inline-block;
	padding: 0;
}
.result-row {
	padding: .25em;
	border: 1px solid var(--color-base-35);
	border-radius: 4px;
	margin-block-end: .5em;
}
div.results-note {
	padding: .5em;
	margin-block-start: 1.5em;
	margin-block-end: .5em;
	font-size: var(--font-smaller);
	color: var(--color-base-60);
}
</style>
<script lang="ts">
  import { setIcon, TFile, TFolder, Vault, debounce } from "obsidian";
  import { onMount } from "svelte";
	import type { TypedDocument, Orama, Results, SearchParams } from '@orama/orama';
	import { create, insert, remove, search, count } from '@orama/orama';
	import StatusMessage, { StatusType } from '../utils/StatusMessage'	
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
	let status: StatusMessage;

	let startSearch = debounce(
		async () => {
			
			entries = [];
			status.setStatus('Creating index…');
			let playgroundDB = await createIndex();
			status.setStatus('Start query process…');
			setTimeout(async () => {
				
				try {
					const searchParams: SearchParams<Orama<typeof playgroundSchema>> = {
						term: searchInput.value,
						limit: 1000,
						tolerance: 1,
					};
					// @ts-ignore
					const result: Results<PlaygroundDocument> = await search(playgroundDB, searchParams);
					result.hits.forEach((hit) => {
						// https://learn.svelte.dev/tutorial/updating-arrays-and-objects
						entries = [...entries, {title: hit.document.title, path: hit.document.path, score: hit.score}];
					});
					document.querySelector(".waiting-indicator")?.setAttribute("style", "display: none;");
					if (entries.length) {
						document.querySelector(".search-results-wrapper")?.setAttr("style", "display: block;");
					} else {
						document.querySelector(".no-result")?.setAttr("style", "display: flex;");
					}
					status.hide();
					status = new StatusMessage('FINISHED', StatusType.Default, 3 * 1000)
					return Promise.resolve(entries);
				} catch (error) {
					return Promise.reject();
				}
			}, 5000);
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
		e.preventDefault;
		if (e.key === 'Enter' && (e.target as HTMLElement).classList.contains("search-input")) {
			let query = searchInput.value;
			if (query.length > 1) {
				document.querySelector(".search-results-wrapper")?.setAttr("style", "display:none;");
				document.querySelector(".waiting-indicator")?.setAttribute("style", "display: flex;");
				document.querySelector(".no-result")?.setAttr("style", "display: none;");
				status = new StatusMessage('Starting search.', StatusType.Default, 60 * 1000)
				startSearch();
			}
		}
	}

	async function createIndex():Promise<Orama<{ readonly path: "string"; readonly title: "string"; readonly description: "string"; readonly head: "string"; readonly htmlAttrs: "string"; readonly tags: "string[]"; readonly markup: { readonly language: "string"; readonly content: "string"; }; readonly style: {  }; readonly script: { }; readonly scripts: "string[]"; readonly stylesheets: "string[]"; }>|any> {
		
		const playgroundDB: Orama<typeof playgroundSchema> = await create({
			schema: playgroundSchema,
		});
		if (playgroundDB) {
			try {
				status.setStatus('Processing playgrounds…');
				const f = this.app.vault.getAbstractFileByPath(plugin.settings.playgroundFolder);
				if (f instanceof TFolder && f.children.length > 0) {

					let playgrounds = await getPlaygroundsInFolder(f);
					
					playgrounds.forEach(async (doc) => {
						await insertIndex(doc, playgroundDB);
					});
					status.setStatus('Finished processing playgrounds…');
					return Promise.resolve(playgroundDB);
				}

			} catch (error) {
				console.log(error.message || error);
				return Promise.reject(error);
			}
		}
	}

	async function insertIndex(playground:TFile, pdb: Orama<typeof playgroundSchema>) {
		let jsonFile:TFile = this.app.vault.getAbstractFileByPath(playground.path) as TFile;
		let playgroundJson = await this.app.vault.read(jsonFile)
		try {
			let jsonContent = JSON.parse(playgroundJson);
			await insert(pdb, {
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
		} catch (error) {
			console.log(error.message || error);
		}
		return Promise.resolve();
	}

	async function getPlaygroundsInFolder(folder: TFolder): Promise<TFile[]> {
    let files: TFile[] = [];
    Vault.recurseChildren(folder, (file) => {
      if (file instanceof TFile && file.extension === 'json') {
        files.push(file);
      }
    });
		return Promise.resolve(files);
    // return files.sort( (a: { name: string; },b: { name: string; }) => {
      // return a.name.localeCompare(b.name);
    // });
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
			document.querySelector(".waiting-indicator")?.setAttribute("style", "display: flex;");
			document.querySelector(".no-result")?.setAttr("style", "display: none;");
			startSearch();
		});

	});

</script>

<div class="search-form-wrapper">
	<input 
		type="text"
		placeholder="Search…"
		bind:this={searchInput}
		on:keypress={handleKeypress}
		class="search-input"
	/>
	<button
		aria-label="Search"
		bind:this={searchButton}
		data-tooltip-position="bottom"
		class="mod-cta"
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
		<div class="result-row">
			<div class="result-score" aria-label="Result score">score: {`${Math.round(item.score * 100) / 100}`}</div>
			<div>
				<a 
					href="obsidian://playground?vault={encodeURIComponent(app.vault.getName())}&playgroundPath={encodeURIComponent(item.path)}" 
					aria-label="Open playground: {item.path.replace(plugin.settings.playgroundFolder+'/', "")}" 
					
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
		<div class="search-results-wrapper"></div>
	{/each}
</div>
<!-- {:else} -->
{/if}
<div class="waiting-indicator" style="display: none;">
	{@html INDICATOR_SVG}
</div>
<div class="no-result" style="display: none;">
	No playgrounds found
</div>

<style>
div:has(.search-form-wrapper) {
	font-family: var(--font-interface);
}
.search-form-wrapper {
	display: flex;
	align-items: center;
  flex-wrap: wrap;
  gap: .5em;
	justify-content: center;
}
.search-form-wrapper button {
	flex-grow: 1;
	/* cursor: pointer; */
}
.search-form-wrapper input {
	flex-grow: 3;
}
.search-results-wrapper {
	padding: 0;
}
.waiting-indicator {
	align-items: center;
  flex-wrap: nowrap;
  gap: .15em;
	justify-content: center;
	padding: 3em;
	fill: var(--interactive-accent);
}
.no-result {
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
  flex-grow: 1;
  flex-basis: 160px;
	width:100%;
	min-width: 0;
	font-size: var(--font-ui-small);
}
.result-row a {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	display: inline-block;
	border: 3px solid transparent;
	padding: var(--size-2-3);
	width: 100%;
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
	padding: .2em;
	border: 1px solid var(--color-base-35);
	border-radius: var(--size-2-3);
	margin-block-end: .5em;
	position: relative;
}
div.results-note {
	padding: .5em;
	margin-block-start: 1.5em;
	margin-block-end: .5em;
	font-size: var(--font-smaller);
	color: var(--color-base-60);
}
div.result-score {
	display:none;
}
/* div:has(div.result-score):hover > div.result-score {
	display: inline-block;
	position: absolute;
	top: calc(var(--size-4-3) * -1);
	left: calc(var(--size-2-3) * 2);
	font-size: var(--font-ui-smaller);
	color: var(--text-faint);
	background-color: var(--background-secondary);
	border-radius: var(--size-2-3);
	padding-inline: .5em;
	padding-block: .25em;
	text-align: center;
} */
</style>
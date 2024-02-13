<script lang="ts">
  import { Notice, WorkspaceLeaf, setIcon, TFile, TFolder, Vault } from "obsidian";
  import { onMount } from "svelte";
  // import moment from "moment";
	// const JsSearch = require('js-search');
	// console.log(JsSearch);
	import type { TypedDocument, Orama, Results, SearchParams } from '@orama/orama'
	import type { Language } from '@orama/orama'
	import { create, insert, remove, search, searchVector, count } from '@orama/orama'



  const app = this.app;
  const plugin = app.plugins.plugins["livecodes-playground"];
  let container: any;
  // let playground: any;
  let createIndex: HTMLButtonElement;





  // export let jsonTemplate: any;
  let mysterySearch: any;
	let entries: any;
	onMount(async () => {



		setIcon(createIndex, "cog");
		createIndex.addEventListener("click", async (e) => {
			e.preventDefault();
			const db = await create({
				schema: {
					title: 'string',
					description: 'string',
					head: 'string',
					htmlAttrs: 'string',
					tags: 'string',
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
					scripts: 'string',
					stylesheets: 'string'
					// meta: {
					// 	rating: 'number',
					// },
				},
			})
			console.log('db.schema');
			console.log(db.schema);
		
			try {


				const f = this.app.vault.getAbstractFileByPath(plugin.settings.playgroundFolder);

				if (f instanceof TFolder && f.children.length > 0) {
					// const ALLOWED_EXTS = ["json"];
					// let showMenu = false;
					// f.children.forEach((f) => {
					// 	let fileExt = f.name.split('.').pop();
					// 	if (ALLOWED_EXTS.includes(fileExt as string)) {
					// 		// showMenu = true;
					// 		// return;
					// 		console.log(f.path);
					// 	}
					// });

					let playgrounds = getPlaygroundsInFolder(f);
					// console.log(playgrounds);
					await makePromise(playgrounds, db)
						.then(async () => {
							setTimeout(async () => {
								const docNumber = await count(db)
								// console.log('docNumber');
								// console.log(docNumber);
								const searchResult = await search(db, {
									// term: 'Hello',
									term: 'good',
								})
								console.log('searchResult');
								console.log(searchResult);			
								searchResult.hits.forEach((hit) => {
									console.log(hit.document);
								});			
							}, 5000);

						}
					);

					
					//setTimeout(async() => {
					//	const docNumber = await count(db)
					//	console.log('docNumber');
					//	console.log(docNumber);
					//	const searchResult = await search(db, {
					//		term: 'Modulo',
					//	})
					//	console.log('searchResult');
					//	console.log(searchResult);
					//}, 1000);

					// if (showMenu) {
					// 	menu.addItem( (item) => {
					// 		item
					// 			.setTitle("Open in Livecodes playground")
					// 			.setIcon("file-code-2")
					// 			.onClick(async () => {
					// 				await this.newLivecodesPlayground(true, f);
					// 			});
					// 	});
					// }
				}




			} catch (error) {
				console.log(error.message || error);
			}
		});


		// var theGreatGatsby = {
		// 	isbn: '9781597226769',
		// 	title: 'The Great Gatsby',
		// 	author: {
		// 		name: 'F. Scott Fitzgerald'
		// 	},
		// 	tags: ['book', 'inspirational']
		// };
		// var theDaVinciCode = {
		// 	isbn: '0307474275',
		// 	title: 'The DaVinci Code',
		// 	author: {
		// 		name: 'Dan Brown'
		// 	},
		// 	tags: ['book', 'mystery', 'action']
		// };
		// var angelsAndDemons = {
		// 	isbn: '074349346X',
		// 	title: 'Angels & Demons',
		// 	author: {
		// 		name: 'Dan Brown',
		// 	},
		// 	tags: ['book', 'mystery']
		// };

		/*
		var search = new JsSearch.Search('isbn');
		search.addIndex('title');
		search.addIndex(['author', 'name']);
		search.addIndex('tags')

		search.addDocuments([theGreatGatsby, theDaVinciCode, angelsAndDemons]);

		mysterySearch = search.search('mystery');
		console.log(search.search('The'));   // [theGreatGatsby, theDaVinciCode]
		console.log(search.search('scott'));  // [theGreatGatsby]
		console.log(search.search('dan')); // [angelsAndDemons, theDaVinciCode]
		console.log(mysterySearch); // [angelsAndDemons, theDaVinciCode]
		mysterySearch.forEach((res:any[]) => {
			console.log(res);
		});
		entries = Object.entries(mysterySearch);
		*/


	});


	const makePromise = (docs:any[], db: Orama<{ title: string; description: string; head: string; htmlAttrs: string; tags: string; markup: { language: string; content: string; }; style: { language: string; content: string; }; script: { language: string; content: string; }; scripts: string; stylesheets: string; }>) => {
		return new Promise((resolve, reject) => {
			try {
				docs.forEach(async (doc) => {
					// console.log(playground.path);
					let jsonContent = await this.app.vault.read(this.app.vault.getAbstractFileByPath(doc.path) as TFile)
					// console.log(JSON.parse(jsonContent).title);
					try {
						// @ts-ignore
						let res = await insert(db, {
							title: `${JSON.parse(jsonContent).title}`,
							description: `${JSON.parse(jsonContent).description}`,
							head: `${JSON.parse(jsonContent).head}`,
							htmlAttrs: `${JSON.parse(jsonContent).htmlAttrs}`,
							// tags: `${JSON.parse(jsonContent).tags} || []`,
							markup: {
								language: (JSON.parse(jsonContent).markup.language !== undefined) ? JSON.parse(jsonContent).markup.language : "",
								content: `${JSON.parse(jsonContent).markup.content||""}`
							},
							style: {
								language: (JSON.parse(jsonContent).style.language !== undefined) ? JSON.parse(jsonContent).style.language : "",
								content: `${JSON.parse(jsonContent).style.content||""}`
							},
							script: {
								language: (JSON.parse(jsonContent).script.language !== undefined) ? JSON.parse(jsonContent).script.language : "",
								content: `${JSON.parse(jsonContent).script.content||""}`
							},
							scripts: `${JSON.parse(jsonContent).scripts||""}`,
							stylesheets: `${JSON.parse(jsonContent).stylesheets||""}`
						});
						// console.log('res');			
						// console.log(res);			
					} catch (error) {
						// new Notice("❌ " + error + " Click this message to dismiss.", 0);
						console.log(error);
						console.log(JSON.parse(jsonContent));
					}
				});
			} catch (error) {
				reject('rejected:' + error);
			}
			resolve('resolved');
		});
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
</script>

<button
aria-label="Project settings"
bind:this={createIndex}
data-tooltip-position="bottom"
/>

<h2>
	Hello, world!
</h2>

<!-- {#each entries || [] as [key, value]}
	<div>
  	{key+1}.) - {value.isbn}, {value.title},	{value.author.name}
		<ul>
			{#each value.tags || [] as v}
				<li>{v}</li>
			{:else}
				<li>No items found<li/>
			{/each}
		</ul>
	</div>  
{/each} -->





<!-- {#await $storeRequestResults} -->

<!-- {:then result} -->

<!-- 1. Use the logical OR operator to default to an empty array if 'result' is false-y
			  👇 -->
<!-- {#each result || [] as item} -->
	<!-- <li>{item}</li> -->

<!-- 2. Use the `:else` clause to handle the case where the array is empty -->
<!-- {:else} -->
	<!-- <li>No items found<li/> -->
<!-- {/each} -->

<!-- {:catch error} -->

<!-- {/await} -->
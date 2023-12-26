<script lang="ts">
  import { App, Notice, Plugin, Vault, TFile } from "obsidian";
	import { writable } from 'svelte/store';
  import SvelteBasePlugin from "../main";
  export let myTemplate: string;
  export let myTemplatePath: string|undefined;
  
  const app = this.app;
  const plugin = app.plugins.plugins['livecodes-for-obsidian'];
  // const fs = require('fs');
  let vaultPath = plugin.adapter.basePath;
	
  import { onMount } from 'svelte';
  import { EmbedOptions, createPlayground } from 'livecodes';
	// console.log('myTemplate');
	// console.log(myTemplate);
	// console.log('myTemplatePath');
	// console.log(myTemplatePath);
  // Embed Options
  /*/
	const options: EmbedOptions = {
		// appUrl: "https://playground.test/",
    params: {
      html: '<h1>Hello World!</h1>',
      css: 'h1 {color: blue;}',
      js: 'console.log("Hello, Svelte!")',
      console: 'open',
    },
  };
	/**/
	const options: EmbedOptions = {
      config: myTemplate!,
      appUrl: plugin.settings.appUrl,
      params: {
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

  let container: any;
  let playground: any;
  onMount(() => {
    createPlayground(container, options).then((p) => {
      playground = p; // now the SDK is available
			const setTextarea = (value = "", append = false) => {
				if (append) {
					document.querySelector("#text").innerHTML += "\n\n" + value;
				} else {
					document.querySelector("#text").innerHTML = value;
				}
			};
			document.querySelector('[data-command="getCode"]')
				.addEventListener("click", async (e) => {
					e.preventDefault();
					// setTextarea("executing: getCode()");
					try {
						const code = await playground.getCode();
						setTextarea(code.result, false);
					} catch (error) {
						setTextarea(error.message || error, true);
					}
				});
				// document
				// 	.querySelector('[data-command="destroy"]')
				// 	.addEventListener("click", async (e) => {
				// 		e.preventDefault();
				// 		setTextarea("executing: destroy()");
				// 		try {
				// 			await playground.destroy();
				// 			setTextarea("executed: destroy()", true);
				// 		} catch (error) {
				// 			setTextarea(error.message || error, true);
				// 		}
				// 	});
				let watcher;
				const watcherButton = document.querySelector('[data-command="onChange"]');
				watcherButton.addEventListener("click", async (e) => {
					e.preventDefault();
					try {
						if (!watcher) {
							setTextarea("Watching for changes…");
							watcher = playground.onChange((output) => {
								setTextarea("Changes detected:");
								setTextarea(JSON.stringify(output, null, 2), true);
							});
							// watcherButton.innerText = "remove onChange";
							watcherButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';
							watcherButton.setAttribute("aria-label","Stop watching for changes");
						} else {
							watcher?.remove();
							watcher = null;
							setTextarea("Stopped watching for changes…");
							// watcherButton.innerText = "add onChange";
							watcherButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
							watcherButton.setAttribute("aria-label","Watch for changes");
						}
					} catch (error) {
						setTextarea(error.message || error, true);
					}
				});

				
				const setThemeButton = document.querySelector('[data-command="setConfig"]');
				setThemeButton
					.addEventListener("click", async (e) => {
						e.preventDefault();
						const currentTheme = plugin.settings.darkTheme ? "dark" : "light";
						try {
							if (currentTheme !== "dark") {
								await playground.setConfig({theme:"dark"})
								plugin.settings.darkTheme = true;
								setThemeButton.setAttribute("aria-label","Set light mode");
							} else {
								await playground.setConfig({theme:"light"})
								plugin.settings.darkTheme = false;
								setThemeButton.setAttribute("aria-label","Set dark mode");
							}
						} catch (error) {
							setTextarea(error.message || error, true);
						}
					});




			document.querySelector('[data-command="getConfig"]')
				.addEventListener("click", async (e) => {
					e.preventDefault();
					// setTextarea("executing: getConfig()");
					try {
						const config = await playground.getConfig();
						setTextarea(JSON.stringify(config, null, 2), false);
					} catch (error) {
						setTextarea(error.message || error, true);
					}
				});

			document.querySelector('[data-command="getShareUrl"]')
				.addEventListener("click", async (e) => {
					e.preventDefault();
					// setTextarea("executing: getShareUrl()");
					try {
						const shareUrl = await playground.getShareUrl();
						setTextarea(shareUrl, false);
					} catch (error) {
						setTextarea(error.message || error, true);
					}
				});


    });
    // cleanup when the component is destroyed
    return () => playground?.destroy();
  });
</script>

<div 
	bind:this="{container}" 
	class="livecodes-wrapper" data-height="{plugin.settings.dataHeight || '300'}">
</div>

<div class="buttons-wrapper">
	<!-- https://live-codes.github.io/livecodes-examples/sdk-demo.html -->
	<button
		aria-label="Watch for changes"
		data-command="onChange"
		data-tooltip-position="top">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
	</button>

	<button
		aria-label="Toggle theme"
		data-command="setConfig"
		data-tooltip-position="top">
		{#if plugin.settings.darkTheme}
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
		{/if}
	</button>

	<button
		aria-label="Get config"
		data-command="getConfig"
		data-tooltip-position="top">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-braces"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>
	</button>

	<button
		aria-label="Copy share URL"
		data-command="getShareUrl"
		data-tooltip-position="top">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
	</button>

	<button
		aria-label="Get code"
		data-command="getCode"
		data-tooltip-position="top">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
	</button>

	<!-- <a href="#" data-command="destroy">destroy</a> -->

</div>

<textarea name="text" id="text" wrap="off" style="width:100ch;height:30ch;"></textarea>

<h2>myTemplate: {myTemplate.title}</h2>
<div>myTemplatePath: <code>{myTemplatePath}</code></div>
<hr />
<h6>Example:</h6>
<pre>
  <em>// plugin settings</em>
  plugin.settings.varNumber: <span>{plugin.settings.varNumber}</span>
  plugin.settings.varString: <span>{plugin.settings.varString}</span>
  <div />
  <em>// deprecated `app`</em>
  app.vault.configDir: <span>{app.vault.configDir}</span>
  plugin.adapter.basePath: <span>{vaultPath}</span>
  <div />
  <em>// plugin static method</em>
  SvelteBasePlugin.foo(): <span>{SvelteBasePlugin.foo()}</span>
  <div />
  <em>// Obsidian CSS variable</em>
  var(--interactive-accent): <span class="obsidian-var">Hello world</span>
</pre>

<style>
  /* h1 {
    color: hotpink;
  } */
  h2 {
    color: dodgerblue;
  }
  div code,
	pre span {
    color: dodgerblue;
  }
  pre span.obsidian-var {
    color: var(--interactive-accent);
  }
	pre em {
    color: var(--color-base-50);
  }
	.buttons-wrapper {
		margin-bottom: 1em;
	}
</style>

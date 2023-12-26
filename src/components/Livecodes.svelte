<script lang="ts">
  import { App, Notice, Plugin, Vault, TFile } from "obsidian";
  import SvelteBasePlugin from "../main";
  export let myTemplate: string;
  
  const app = this.app;
  const plugin = app.plugins.plugins['livecodes-for-obsidian'];
  // const fs = require('fs');
  let vaultPath = plugin.adapter.basePath;
	
  import { onMount } from 'svelte';
  import { EmbedOptions, createPlayground } from 'livecodes';
	console.log('myTemplate');
	console.log(myTemplate);
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
    });
    // cleanup when the component is destroyed
    return () => playground?.destroy();
  });
</script>

<div 
	bind:this="{container}" 
	class="livecodes-wrapper" data-height="{plugin.settings.dataHeight}">
</div>

<!-- <h1>myNumber: {myNumber}</h1> -->
<h2>myTemplate: {myTemplate.title}</h2>
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
  pre span {
    color: dodgerblue;
  }
  pre span.obsidian-var {
    color: var(--interactive-accent);
  }
  pre em {
    color: var(--color-base-50);
  }
</style>

<script lang="ts">
  import { App, Notice, Plugin, Vault, TFile } from "obsidian";
  import SvelteBasePlugin from "../main";
  export let myNumber: number;
  export let myString: string;
  const app = this.app;
  const plugin = app.plugins.plugins['svelte-base-plugin'];
  // const fs = require('fs');
  let vaultPath = plugin.adapter.basePath;
  // console.log(plugin.adapter);
  // async function readMarkdownFile(file: TFile) {
  //     return app.vault.adapter.read(file);
  // }
</script>

<h1>myNumber: {myNumber}</h1>
<h2>myString: {myString}</h2>
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
  h1 {
    color: hotpink;
  }
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

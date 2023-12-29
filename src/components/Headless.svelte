<script lang="ts">
	import { createPlayground, EmbedOptions } from "livecodes";
	import { App, Notice, Plugin, Vault, TFile, normalizePath } from "obsidian";
	import { onMount } from 'svelte';
	// import debounce from 'debounce';
	// import CodeMirror  from 'codemirror';
	// import { markdown } from '@codemirror/lang-markdown';

	const app = this.app;
  const plugin = app.plugins.plugins['livecodes-for-obsidian'];
  // import SvelteBasePlugin from "../main";
  // let vaultPath = plugin.adapter.basePath;
	import {saveJson, downloadFile}  from "../util";
	let container: any;
  let playground: any;


	// export let source: string;
	export let template: any;
	// export let tplPath: string;



	// let x = source;
	// console.log(source);
	console.log('template');
	console.log(template);
	// console.log(source.trim().startsWith("[["));
	// console.log(source.trim().endsWith("]]"));

	// let part:string = source.trim().substring(2);
  // let content:string = part.substring(part.length-2,1).trim();
	// console.log(plugin.settings.templateFolder + "/" + content);
	// let templatePath = plugin.settings.templateFolder + "/" + content;
	// if (source.startsWith("[[") && source.endsWith("]]")) {
	// 	console.log('found template in source');
	// }
	// let tplPath = normalizePath(templatePath);
  // let tpl = this.adapter.read(tplPath);
	// console.log('tpl');
	// console.log(tpl);
  
	const options: EmbedOptions = {
		view: "headless",
		config: { 
			autoupdate: false 
		},
		appUrl: plugin.settings.appUrl,
	};

	const initialCode = `import { useState, useEffect } from 'react';
export const Hello = ({name}) => {  
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>Hello, {name} !!!</h1>
      <p>You clicked {count} times.</p>
      <button onClick={
        () => setCount(count + 1)}>Click me</button>
    </>
  );
};

<Hello name="LiveCodes"></Hello>

## MDX in short

- ❤️ Powerful- 💻 Everything is a component
- 🔧 Customizable- 📚 Markdown-based
- 🔥 Blazingly blazing fast> from [mdxjs.com](https://mdxjs.com/)`;





	onMount(() => {
		createPlayground(container, options).then(async (p) => {
			playground = p; // now the SDK is available


// the code editor
// const editor = CodeMirror.fromTextArea(
//   document.querySelector("#editor")!,
//   {
//     lineNumbers: true,
//     mode: "markdown",
//   }
// );
// editor.setSize("100%", 200);
// editor.setValue(initialCode);
// @ts-ignore
document.querySelector("#editor")?.textContent = initialCode;

			const compile = async () => {
				await playground.setConfig({
					autoupdate: false,
					markup: {
						language: "mdx",
						content: document.querySelector("#editor")?.textContent,
					},
				});
			};

			// watch for changes
			document.getElementById("editor")?.addEventListener(
				"change", 
				(ev) => {console.log('------------' +ev + '------------')}
				// debounce(compile, 1000)
			);
			// @ts-ignore
			playground.watch("code", ({ code, config }) => {
				console.log(code);
				createSandbox(
					document.querySelector("#output"), 
					code.result
				);
			});

			await compile();

			// create a sandbox for safe execution of compiled code
			function createSandbox (container:any, html:any) {
				const iframe = document.createElement("iframe");
				iframe.src = "https://livecodes-sandbox.pages.dev/v7/";
				// @ts-ignore
				iframe.sandbox = "allow-same-origin allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-presentation allow-scripts";
				iframe.onload = () => {
					iframe.contentWindow!.postMessage({ html }, "*");
				};
				container.innerHTML = "";
				container.appendChild(iframe);
				return iframe;
			}



			
		});
	});

	const handleWatchedTemplate = (tplPath: string, output: any) => {
		// output.config.head = "";
		// console.log('output');
		// console.log(output);
		saveJson(app, tplPath, JSON.stringify(output, null, 2));
	};

/**
 * from: https://github.com/Obsidian-TTRPG-Community/TTRPG-Community-Admin/
 */
 async function copyStringToClipboard(text:string, topic:string|undefined=undefined) {
  navigator.clipboard
      .writeText(text)
      .then(function () {
          new Notice((topic !== undefined ? topic + " " : "") + "Copied to clipboard", 2500);
      })
      .catch(function (error) {
          console.error('Failed to copy to clipboard: ', error)
      })
}

</script>

<div
	bind:this="{container}"  
	class="livecodes-wrapper" 
	data-height="{plugin.settings.dataHeight || '300'}">

	<textarea 	
		id="editor" 
		style="/*display: none;*/">
		{initialCode}
	</textarea>

	<div id="output">Loading...</div>
</div>

<style>
.livecodes-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
#output {
  flex: 1;
}
/* #output iframe {
  width: 100%;
  height: 100%;
  border: none;
} */
</style>

<script lang="ts">
  import { Notice, WorkspaceLeaf, setIcon } from "obsidian";
  import {
    createPlayground,
    EmbedOptions
  } from "livecodes";
  import { Boarding } from "boarding.js";
  // import attachHighPrioClick from "boarding.js";
  const { Octokit } = require("@octokit/rest");
  import * as prettier from "prettier/standalone";
  import * as htmlPlugin from "prettier/plugins/html";
  
  import { onMount } from "svelte";
  import {
    saveJson,
    downloadFile,
    copyStringToClipboard,
    // postToCodepen,
  } from "../utils";
  import { buttonTour } from "../settings/onboarding";
  import { openPromptModal } from "../modals/prompt-modal";
  import { openExternalResourcesModal } from "../modals/external-resources-modal";
  import { openPlaygroundSettingsModal } from "../modals/playground-settings-modal";
  import moment from "moment";

  const app = this.app;
  const plugin = app.plugins.plugins["livecodes-playground"];
  let container: any;
  let playground: any;
  let watcher: { remove: () => void } | null;

  export let jsonTemplate: any;
  export let playgroundPath: string;

  let copyHTML: HTMLButtonElement;
  let downloadHTML: HTMLButtonElement;
  let createNote: HTMLButtonElement;
  let saveAsJSON: HTMLButtonElement;
  let copyShareUrl: HTMLButtonElement;
  let toggleTheme: HTMLButtonElement;
  let onWatch: HTMLButtonElement;
  let openInCodepen:HTMLButtonElement;
  let createGist:HTMLButtonElement;
  let showHelp:HTMLButtonElement;
  let openExternalResources: HTMLButtonElement;
  let openPlaygroundSettings: HTMLButtonElement;
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
          let fileName = playgroundPath.substring(
            playgroundPath.lastIndexOf("/") + 1,
            playgroundPath.length
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
                handleWatchedTemplate(playgroundPath, config);
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

      /**
       * CANNOT POST FORM from Obsidian.md; CORS issue?
       */

      /*/
      setIcon(openInCodepen, 'codepen');
      openInCodepen.addEventListener(
        "click", 
        async (e) => {
          e.preventDefault();
          try {
            let json = {"title": "New Pen", "html": "<div>Hello, World</div>"};
            postToCodepen(
              container, 
              JSON.stringify(json)
                // Quotes will screw up the JSON
                .replace(/"/g, "&​quot;")
                .replace(/'/g, "&apos;")
            );
          } catch (error) {
            console.log(error.message || error);
          }
        }
      );
      /**/

      setIcon(createGist, 'github');
      createGist.addEventListener(
        "click", 
        async (e) => {
          e.preventDefault();
          try {
            const cfg = await playground.getConfig();
            try {
              let markDown:string = '';
              let link:string = "obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&playgroundPath="+encodeURIComponent(playgroundPath);
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
              const code = await playground.getCode();
              await saveAsGist(cfg.title + '.md', markDown, cfg.title + '.html', code.result, cfg.title + '.json', JSON.stringify(cfg) );
            } catch (error) {
              new Notice(
                "❌ " + error + " Click this message to dismiss.",
                0
              );
            }
          } catch (error) {
            console.log(error.message || error);
          }
        }
      );

      setIcon(createNote, "file-plus-2");
      createNote.addEventListener("click", async (e) => {
        e.preventDefault();
        const cfg = await playground.getConfig();
        let fName = await openPromptModal(
          this.app,
          "Livecodes",
          "Save note as:",
          playgroundPath.substring(playgroundPath.lastIndexOf("/") + 1, playgroundPath.length).replace(/\.json/, ""),
          "e.g. New Playground README",
          false
        );
        if (fName?.length === 0) {
          return;
        }
        try {
          let markDown:string = '';
          let link:string = "obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&playgroundPath="+encodeURIComponent(playgroundPath);
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
          const shareUrl = await playground.getShareUrl(plugin.settings.shortUrl);
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

      setIcon(openPlaygroundSettings, "info");
      openPlaygroundSettings.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          let conf = {
            title: await playground.getConfig().then((t: any) => {return t.title}),
            description: await playground.getConfig().then((t: any) => {return t.description}),
            head: await playground.getConfig().then((t: any) => {return t.head}),
            htmlAttrs: await playground.getConfig().then((t: any) => {return t.htmlAttrs})
          };
          await openPlaygroundSettingsModal(
              this.app,
              this.plugin,
              "Playground settings",
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
              handleWatchedTemplate(playgroundPath, config);
              new Notice("Changes saved");
            }
          );
        } catch (error) {
          console.log(error.message || error);
        }
      }

      setIcon(showHelp, "help-circle");
      showHelp.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          const boarding = new Boarding(
            {
            strictClickHandling: "block-all",
            onPopoverRender: (popoverElements) => {
              // setTimeout, so we the count runs immediatly after all internal boarding logic has run. Otherwise we would get an outdated boarding.currentStep number
              // setTimeout(() => {
              //   popoverElements.popoverTitle.innerText = `${
              //     popoverElements.popoverTitle.innerText
              //   } (${boarding.currentStep + 1}/${
              //     boarding.getSteps().length
              //   })`;
              // }, 0);
              setTimeout(() => {
                // let stepsSpan = activeDocument.createElement("span");
                let stepsDiv: HTMLDivElement = activeDocument.createElement("div");
                stepsDiv.addClass("steps-bullets");
                let stepsList: HTMLElement = activeDocument.createElement("ul");
                stepsList.setAttribute("role", "tablist");
                let i = 0;
                boarding.getSteps().forEach((step)=>{
                  let newStep: HTMLElement = activeDocument.createElement("li");
                  newStep.setAttribute("role", "presentation")
                  let stepLink: HTMLElement = activeDocument.createElement("a");
                  stepLink.setAttribute("role", "button");
                  if (i === boarding.currentStep) {
                    stepLink.addClass("active");
                  }
                  stepLink.setAttribute("data-step-number", `${i}`);
                  // stepLink.addEventListener("mouseenter",  async function (e) {
                  //   e.stopPropagation();
                  //   setTimeout(async () => {
                  //     boarding.start(i);
                  //   }, 1000);
                  // });
                  newStep.appendChild(stepLink);
                  stepsList.appendChild(newStep);
                  i++;
                });
                stepsDiv.appendChild(stepsList);
                // stepsSpan.innerText = `(${boarding.currentStep + 1}/${boarding.getSteps().length})`;
                // popoverElements.popoverCloseBtn.insertAdjacentElement("afterend", stepsSpan);
                popoverElements.popoverDescription.appendChild(stepsDiv);
              }, 0);
            },
            opacity: 0.75,
          });
          boarding.defineSteps(buttonTour);
          boarding.start();
        } catch (error) {
          console.log(error.message || error);
        }
      });

    });
  });

  const handleWatchedTemplate = (playgroundPath: string, output: any) => {
    saveJson(app, playgroundPath, JSON.stringify(output, null, 2));
  };

  const createText = async (
    fileContent: string | undefined
  ): Promise<string> => {
    return fileContent?.trim() as string;
  };

  async function prettifyHtml(src: string, fileName: string): Promise<string> {
    /**
     * derived from https://github.com/alexgavrusev/obsidian-plugin-prettier-2/blob/master/src/main.ts
     * https://prettier.io/docs/en/options
     */
    return await prettier.format(src, {
      filepath: fileName,
      parser: "html",
      bracketSameLine: true,
      printWidth: 1000,
      // singleAttributePerLine: true,
      htmlWhitespaceSensitivity: "ignore",
      plugins: [
        htmlPlugin
      ]
    })
    .then((pretty) => {
      let regex:RegExp = /^\s*$(?:\r\n?|\n)/gm;
      let result:string = pretty.replace(regex, "");
      return Promise.resolve(result);
    });
    
  }

  const saveAsGist = async (
    fileName: string, 
    body: string, 
    htmlName: string,
    html: string,
    jsonName: string,
    json: string
  ) => {
    const token = plugin.settings.githubApiToken;
    if (!token) {
      new Notice("❌ GitHub token not found, check livecodes settings. Click this message to dismiss.", 0);
      return;
    }
    try {
      new Notice("Creating gist…", 5000);
      let prettyHtml = await prettifyHtml(html, fileName);
      /**
       * https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#create-a-gist
       */
      const octokit = new Octokit({
        'auth': token
      });

      const result = await octokit.request('POST /gists', {
        'description': fileName,
        'public': plugin.settings.githubGistPublic,
        'files': {
          ["README.md"]: {
            'content': "## Hello, world!",
          },
          [fileName]: {
            'content': body,
          },
          [htmlName]: {
            'content': "<!DOCTYPE html>\n" + prettyHtml,
          },
          [jsonName]: {
            'content': json,
          },
        },
        'headers': {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      let gistId = result.data.id;
      let url = result.data.html_url;
      let files = Object.keys(result.data.files);
      let livecodesUrl:string|undefined = undefined;
      let openGistUrl:string|undefined = undefined;
      files.forEach(async (file) => {
        let fileExt = result.data.files[file].filename.split('.').pop();
        if (fileExt === 'json') {
          livecodesUrl = "\n"+plugin.settings.appUrl+"?config="+result.data.files[file].raw_url;
          openGistUrl = "\nobsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&gistUrl="+encodeURIComponent(result.data.files[file].raw_url);
          url += livecodesUrl + openGistUrl;
        }
      })
      await navigator.clipboard.writeText(url);
      url.split("\n").forEach((url: string, index: number) => { 
        let i= index+1;
        console.log(i + ' - ' + url); 
      })
      if (livecodesUrl !== undefined) {
        try {
          // https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#update-a-gist
          const patch = await octokit.request('PATCH /gists/'+gistId, {
            'description': "👉️ Open this code in Livecodes: "+livecodesUrl,
            'files': {
              'README.md': {
                content: openGistUrl
              }
            },
            'headers': {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        } catch (error) {
          new Notice("❌ " + error + " Click this message to dismiss.", 0);
        }
      }
      new Notice('Gist created - URLs copied to your clipboard and logged to the developer console');
    } catch (err) {
      new Notice("❌ There was an error creating your gist, check your token and connection. Click this message to dismiss.", 0);
      throw err;
    }

  }
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
      class="watch-button clickable-icon"
    />
    <button
      aria-label="Create note"
      bind:this={createNote}
      data-tooltip-position="bottom"
      class="create-note-button clickable-icon"
    />
    <button
      aria-label="Save as JSON"
      bind:this={saveAsJSON}
      data-tooltip-position="bottom"
      class="save-json-button clickable-icon"
    />
    <button
      aria-label="Save as HTML"
      bind:this={downloadHTML}
      data-tooltip-position="bottom"
      class="save-html-button clickable-icon"
    />
    <button
      aria-label="Copy HTML to clipboard"
      bind:this={copyHTML}
      data-tooltip-position="bottom"
      class="copy-html-button clickable-icon"
    />
    <button
      aria-label="Copy share URL to clipboard"
      bind:this={copyShareUrl}
      data-tooltip-position="bottom"
      class="share-url-button clickable-icon"
    />
    <button
      aria-label="Create Github gist"
      bind:this={createGist}
      data-tooltip-position="bottom"
      class="create-gist-button clickable-icon"
    />
    <!-- <button
      aria-label="Open in Codepen"
      bind:this={openInCodepen}
      data-tooltip-position="bottom">
    </button> -->
    <button
      aria-label="Set {plugin.settings.darkTheme ? 'light' : 'dark'} mode"
      bind:this={toggleTheme}
      data-tooltip-position="bottom"
      class="theme-mode-button clickable-icon"
    />
    <button
      aria-label="External resources"
      bind:this={openExternalResources}
      data-tooltip-position="bottom"
      class="external-resources-button clickable-icon"
    />
    <button
      aria-label="Playground settings"
      bind:this={openPlaygroundSettings}
      data-tooltip-position="bottom"
      class="playground-settings-button clickable-icon"
    />
    <button
      aria-label="Help"
      bind:this={showHelp}
      data-tooltip-position="bottom"
      class="clickable-icon"
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
    padding: .6em;
  }
</style>
<script lang="ts">
  import { setIcon } from "obsidian";
  import { createPlayground, EmbedOptions } from "livecodes";
  import { Boarding } from "boarding.js";
  import * as prettier from "prettier/standalone";
  import * as htmlPlugin from "prettier/plugins/html";
  import { onMount } from "svelte";
  import { saveJson, downloadFile, copyStringToClipboard } from "../utils";
  import { buttonTour } from "../settings/onboarding";
  import { saveAsModal } from "../modals/SaveAs";
  import { openShareGistModal } from "../modals/ShareGist";
  import { openExternalResourcesModal } from "../modals/ExternalResources";
  import { openPlaygroundSettingsModal } from "../modals/PlaygroundSettings";
  import moment from "moment";
  import { showNotice } from '../utils/notice';
  const { Octokit } = require("@octokit/rest");

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
  let openShareGist:HTMLButtonElement;
  let showHelp:HTMLButtonElement;
  let openExternalResources: HTMLButtonElement;
  let openPlaygroundSettings: HTMLButtonElement;
  let buttonsWrapper: HTMLDivElement;

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
      console: "open",
      lineNumbers: plugin.settings.lineNumbers,
      wordWrap: plugin.settings.wordWrap,
      // @ts-ignore
      enableAI: plugin.settings.enableAI,
      editor: plugin.settings.editor,
      version: "24",
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
          await copyStringToClipboard(await prettifyHtml("<!DOCTYPE html>\n" + code.result, "file.html"), "HTML code");
        } catch (error) {
          console.log(error.message || error);
        }
      });

      setIcon(downloadHTML, "file-code-2");
      downloadHTML.addEventListener("click", async (e) => {
        e.preventDefault();
        showNotice('Preparing HTML…', 3000, 'loading');
        try {
          const code = await playground.getCode();
          let fileName = playgroundPath.substring(
            playgroundPath.lastIndexOf("/") + 1,
            playgroundPath.length
          );
          downloadFile(
            await prettifyHtml("<!DOCTYPE html>\n" + code.result, fileName),
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
            showNotice('Watching for changes', 2000, 'success');
            watcher = playground.watch(
              "code",
              //@ts-ignore
              ({ config }) => {
                handleWatchedTemplate(playgroundPath, config);
                showNotice('Changes saved', 2000, 'success');
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
            showNotice('Stopped watching for changes', 2000, 'warning');
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
            await plugin.saveSettings();
            setIcon(toggleTheme, "sun");
            toggleTheme.setAttribute(
              "aria-label",
              "Set light mode"
            );
          } else {
            await playground.setConfig({ theme: "light" });
            plugin.settings.darkTheme = false;
            await plugin.saveSettings();
            setIcon(toggleTheme, "moon");
            toggleTheme.setAttribute("aria-label", "Set dark mode");
          }
        } catch (error) {
          console.log(error.message || error);
        }
      });

      // playground.watch('load', () => {
      //   // Livecodes playground loaded
      // });

      playground.watch('ready', () => {
        // Livecodes playground ready
        buttonsWrapper.setAttribute('style', '');
      });

      setIcon(saveAsJSON, "file-json-2");
      saveAsJSON.addEventListener("click", async (e) => {
        e.preventDefault();
        const cfg = await playground.getConfig();
        let fName = await saveAsModal(
          this.app,
          "Livecodes",
          "Save playground as:",
          "",
          "e.g. New Playground",
          false
        );
        if (fName?.length === 0) {
          return;
        }
        let prettyCfg: string | undefined = JSON.stringify(cfg, null, 2);
        try {
          await this.app.vault.create(
            plugin.settings.playgroundFolder + "/" + fName + ".json",
            await createText(prettyCfg)
          );
          showNotice("Template saved as: " + plugin.settings.playgroundFolder + "/" + fName + ".json", 3000, 'success');
        } catch (error) {
          showNotice(plugin.settings.playgroundFolder+'/'+fName + ".json - " + error + " Click this message to dismiss.", 0, 'error');
        }
      });

      setIcon(openShareGist, 'github');
      openShareGist.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          let conf = {
            includeLivecodesLink: await playground.getConfig().then((t: any) => {return t.includeLivecodesLink}),
            includeHtmlFile: await playground.getConfig().then((t: any) => {return t.includeHtmlFile}),
            includeJsonFile: await playground.getConfig().then((t: any) => {return t.includeJsonFile}),
            includeMarkdownFile: await playground.getConfig().then((t: any) => {return t.includeMarkdownFile}),
          };
          await openShareGistModal(
              this.app,
              this.plugin,
              "Share as gist",
              conf
            )
            .then(
              async (setting) => {
                if (setting !== null) {
                  let gistSetting = JSON.parse(setting);
                  const cfg = await playground.getConfig();
                  try {
                    let link:string = '';
                    let markDown:string = '';
                    if (gistSetting.includeLivecodesLink && gistSetting.includeJsonFile) {
                      link = "obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&playgroundPath="+encodeURIComponent(playgroundPath);
                    }
                    if (gistSetting.includeMarkdownFile) {
                      markDown += "---\n";
                      markDown += "created: "+moment().format("YYYY-MM-DD")+"\n"
                      if (cfg.title !== "") {
                        markDown += "title: "+cfg.title+"\n";
                      }
                      if (cfg.description !== "") {
                        markDown += "description: "+cfg.description+"\n";
                      }
                      if (cfg.tags.length) {
                        markDown += "tags: \n"
                        cfg.tags.forEach((tag:string) => {
                          markDown += "  - "+tag+"\n";
                        })
                      }
                      if (link !== '') {
                        markDown += "playground: \""+link+"\"\n";
                      }
                      markDown += "---\n\n";

                      if (cfg.markup.content !== "") {
                        markDown += "## "+cfg.markup.language+"\n\n```"+cfg.markup.language+"\n"+cfg.markup.content+"\n```\n\n";
                      }
                      if (cfg.style.content !== "") {
                        markDown += "## "+cfg.style.language+"\n\n```"+cfg.style.language+"\n"+cfg.style.content+"\n```\n\n";
                      }
                      if (cfg.script.content !== "") {
                        markDown += "## "+cfg.script.language+"\n\n```"+cfg.script.language+"\n"+cfg.script.content+"\n```\n\n";
                      }
                    }
                    const code = await playground.getCode();

                    await saveAsGist(gistSetting, cfg.title + '.md', markDown, cfg.title + '.html', code.result, cfg.title + '.json', JSON.stringify(cfg, null, 2) );

                  } catch (error) {
                    showNotice('Error: ' + error + " Click this message to dismiss.", 0, 'error');
                  }
                }
              }
            );
        } catch (error) {
          console.log(error.message || error);
        }
      });

      setIcon(createNote, "file-plus-2");
      createNote.addEventListener("click", async (e) => {
        e.preventDefault();
        const cfg = await playground.getConfig();
        let fName = await saveAsModal(
          this.app,
          "Livecodes",
          "Save note as:",
          playgroundPath.substring(playgroundPath.lastIndexOf("/") + 1, playgroundPath.length).replace(/\.json/, ""),
          "e.g. README",
          false
        );
        if (fName?.length === 0) {
          return;
        }
        try {
          let markDown:string = '';
          let link:string = "obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&playgroundPath="+encodeURIComponent(playgroundPath);
          markDown += "---\n";
          markDown += "created: "+moment().format("YYYY-MM-DD")+"\n"
          if (cfg.title !== "") {
            markDown += "title: "+cfg.title+"\n";
          }
          if (cfg.description !== "") {
            markDown += "description: "+cfg.description+"\n";
          }
          if (cfg.tags.length) {
            markDown += "tags: \n"
            cfg.tags.forEach((tag:string) => {
              markDown += "  - "+tag+"\n";
            })
          }
          if (link !== '') {
            markDown += "playground: \""+link+"\"\n";
          }
          markDown += "---\n\n";
          if (cfg.markup.content !== "") {
            markDown += "## "+cfg.markup.language+"\n\n```"+cfg.markup.language+"\n"+cfg.markup.content+"\n```\n\n";
          }
          if (cfg.style.content !== "") {
            markDown += "## "+cfg.style.language+"\n\n```"+cfg.style.language+"\n"+cfg.style.content+"\n```\n\n";
          }
          if (cfg.script.content !== "") {
            markDown += "## "+cfg.script.language+"\n\n```"+cfg.script.language+"\n"+cfg.script.content+"\n```\n\n";
          }
          try {
            await this.app.vault.create(
              plugin.settings.notesFolder + "/" + fName + ".md",
              await createText(markDown)
            );
          } catch (error) {
            showNotice(plugin.settings.notesFolder+'/'+fName + ".md - " + error + " Click this message to dismiss.", 0, 'error');
            return;
          }
          showNotice("Note saved as: " + plugin.settings.notesFolder + "/" + fName + '.md', 3000, 'success');
          await this.app.workspace.openLinkText(fName, plugin.settings.notesFolder);
        } catch (error) {
          console.log("Error: " + error);
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
            tags: await playground.getConfig().then((t: any) => {return t.tags}),
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
                  htmlAttrs: newConfig.htmlAttrs,
                  tags: newConfig.tags
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
              showNotice('Changes saved', 2000, 'success');
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
            opacity: 0.75,
            onPopoverRender: (popoverElements) => {
              setTimeout(() => {
                if (activeDocument.querySelector('.default-icon') !== null) {
                  setIcon(activeDocument.querySelector('.default-icon')!, "alert-triangle");
                }
                if (activeDocument.querySelector('.alert-icon') !== null) {
                  setIcon(activeDocument.querySelector('.alert-icon')!, "alert-triangle");
                }
              }, 0);
            },
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
    try {
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
    } catch (error) {
      showNotice('Prettify error: ' + error + " Click this message to dismiss.", 0, 'error');
      return Promise.resolve(src);
    }

  }

  const saveAsGist = async (
    gistSettings: {
      includeLivecodesLink: boolean,
      includeHtmlFile: boolean,
      includeJsonFile: boolean,
      includeMarkdownFile: boolean
    },
    fileName: string,
    body: string,
    htmlName: string,
    html: string,
    jsonName: string,
    json: string
  ) => {
    const token = plugin.settings.githubApiToken;
    if (!token) {
      showNotice('Error: GitHub token not found, check livecodes settings. Click this message to dismiss.', 0, 'error');
      return;
    }
    try {
      showNotice('Creating gist…', 5000, 'loading');
      let prettyHtml = await prettifyHtml(html, htmlName);
      /**
       * https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#create-a-gist
       */
      const octokit = new Octokit({
        'auth': token
      });

      let filteredFiles = {
        [fileName]: {
          'content': body,
        },
        [htmlName]: {
          'content': "<!DOCTYPE html>\n" + prettyHtml,
        },
        [jsonName]: {
          'content': json,
        },
      };
      if (!gistSettings.includeHtmlFile) {
        delete filteredFiles[`${htmlName}`]
      }
      if (!gistSettings.includeJsonFile) {
        delete filteredFiles[`${jsonName}`]
      }
      if (!gistSettings.includeMarkdownFile) {
        delete filteredFiles[`${fileName}`]
      }

      const result = await octokit.request('POST /gists', {
        'description': "",
        'public': plugin.settings.githubGistPublic,
        'files': filteredFiles,
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
      if (gistSettings.includeLivecodesLink && livecodesUrl!) {
        try {
          // https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#update-a-gist
          await octokit.request('PATCH /gists/'+gistId, {
            'description': "👉️ Open this code in Livecodes: "+livecodesUrl,
            'headers': {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        } catch (error) {
          showNotice('Error: ' + error + " Click this message to dismiss.", 0, 'error');
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        url.split("\n").forEach((url: string, index: number) => {
          let i= index+1;
          console.log(i + ' - ' + url);
        })
      } catch (error) {
        console.log("Error: " + error);
      }
      showNotice('Gist created - URLs copied to your clipboard and logged to the developer console', 4000, 'success');
    } catch (err) {
      showNotice("There was an error creating your gist, check your token and connection.  Click this message to dismiss.", 0, 'error');
      throw err;
    }

  }
</script>

<div class="livecodes-wrapper">
  <div
    bind:this={container}
    data-height={plugin.settings.dataHeight || "600"}
  />

  <div class="buttons-wrapper" style="display:none;" bind:this={buttonsWrapper}>
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
      aria-label="Share as Github gist"
      bind:this={openShareGist}
      data-tooltip-position="bottom"
      class="create-gist-button clickable-icon"
    />
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
    margin-block: 1em;
    width: 100%;
    flex-wrap: wrap;
  }
  .buttons-wrapper button {
    margin-inline: 0.25em;
    padding: .6em;
  }
</style>
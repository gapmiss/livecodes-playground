<script lang="ts">
  import { setIcon, TFile } from "obsidian";
  import { onMount } from "svelte";
  import { copyStringToClipboard } from "../utils";
  import {INDICATOR_SVG} from "../assets/indicator";

  // omnisearch API:
  type OmnisearchApi = {
    // Returns a promise that will contain the same results as the Vault modal
    search: (query: string) => Promise<ResultNoteApi[]>,
    // Refreshes the index
    refreshIndex: () => Promise<void>
    // Register a callback that will be called when the indexing is done
    registerOnIndexed: (callback: () => void) => void,
    // Unregister a callback that was previously registered
    unregisterOnIndexed: (callback: () => void) => void,
  }

  type ResultNoteApi = {
    score: number
    vault: string
    path: string
    basename: string
    foundWords: string[]
    matches: SearchMatchApi[]
    excerpt: string
  }

  type SearchMatchApi = {
    match: string
    offset: number
  }

  const app = this.app;
  const plugin = this.app.plugins.plugins["livecodes-playground"];
  let entries:any[] = [];
  let searchButton: HTMLButtonElement;
  let clearSearchButton: HTMLButtonElement;
  let searchInput: HTMLInputElement;
  let noOmnisearch: HTMLElement;
  let noOmnisearchIcon: HTMLElement;

  let startSearch = async function(query: string) {
    activeDocument.querySelector(".no-result")?.setAttr("style", "display: none;");
    activeDocument.querySelector(".waiting-indicator")?.setAttribute("style", "display: flex;");
    await sleep(250);
    entries = [];
    // Use path:"<somepath>" to restrict your results to corresponding paths
    // Use ext:"png jpg" or ext:png, or a plain .png to specify the filetype(s)
    // Use "exact expressions" in quotes to further filter the results returned by the query
    // Use -exclusions to exclude notes containing certain words
    const result = await this.omnisearch.search('ext:"json" ' + query);
    if (result.length) {
      result.forEach((res: ResultNoteApi) => {
        let fileExt = res.path.split('.').pop();
        if (fileExt === 'json') {
          entries = [...entries, {title: res.basename, path: res.path, score: res.score, excerpt: res.excerpt, matches: res.matches}];
        }
      });
      activeDocument.querySelector(".waiting-indicator")?.setAttribute("style", "display: none;");
      if (entries.length) {
        activeDocument.querySelector(".search-results-wrapper")?.setAttr("style", "display: block;");
      } else {
        activeDocument.querySelector(".no-result")?.setAttr("style", "display: flex;");
      }
    } else {
      activeDocument.querySelector(".waiting-indicator")?.setAttribute("style", "display: none;");
      activeDocument.querySelector(".no-result")?.setAttr("style", "display: flex;");
    }
  }

  function handleOpenJson(e:MouseEvent) {
    e.preventDefault();
    console.log('handleOpenJson');
    console.log(e.target);
  }

  async function handleKeypress(e:KeyboardEvent) {
    e.preventDefault;
    if (e.key === 'Enter' && (e.target as HTMLElement).classList.contains("search-input")) {
      let query = searchInput.value;
      // if (query.length > 1) {
      if (query.length) {
        activeDocument.querySelector(".search-results-wrapper")?.setAttr("style", "display:none;");
        activeDocument.querySelector(".waiting-indicator")?.setAttribute("style", "display: flex;");
        activeDocument.querySelector(".no-result")?.setAttr("style", "display: none;");
        startSearch(query);
      }
    }
  }

  function copyUrlHandler(node: HTMLElement, path: string) {
    setIcon(node, "link");
    node.addEventListener("click", async (e) => {
      e.preventDefault();
      await copyStringToClipboard("obsidian://playground?vault="+encodeURIComponent(this.app.vault.getName())+"&playgroundPath="+encodeURIComponent(path), 'Obsidian URL');
    });
  }

  function openJsonHandler(node: HTMLElement, path: string) {
    setIcon(node, "file-json-2");
    node.addEventListener("click", async (e) => {
      e.preventDefault();
      let splitPath = path.split('/');
      let fName = splitPath.pop();
      await this.app.workspace.openLinkText(fName, splitPath.join('/'));
    });
  }

  onMount(() => {
    if (!this.app.plugins.plugins["omnisearch"]) {
      setIcon(noOmnisearchIcon, 'alert-triangle');
      activeDocument.querySelector(".search-form-wrapper")?.setAttr("style", "display: none;");
      activeDocument.querySelector(".no-omnisearch")?.setAttr("style", "display: block;");
    }
    searchButton.addEventListener("click", async (e):Promise<any> => {
      e.preventDefault();
      let query = searchInput.value;
      activeDocument.querySelector(".search-results-wrapper")?.setAttr("style", "display:none;");
      activeDocument.querySelector(".waiting-indicator")?.setAttribute("style", "display: flex;");
      activeDocument.querySelector(".no-result")?.setAttr("style", "display: none;");
      startSearch(query);
    });
    searchInput.addEventListener("input", (evt) => {
      if ((evt.currentTarget! as HTMLInputElement).value && !searchInput.classList.contains("clear-input--touched")) {
        searchInput.classList.add("clear-input--touched")
      } else if (!(evt.currentTarget! as HTMLInputElement).value && searchInput.classList.contains("clear-input--touched")) {
        searchInput.classList.remove("clear-input--touched")
      }
    });
    clearSearchButton.addEventListener("click", (evt) => {
      searchInput.value = ''
      searchInput.focus()
      searchInput.classList.remove("clear-input--touched")
    })
    setTimeout(() => {
      searchInput.focus();
    }, 10);
  });
</script>

<div class="search-form-heading">Playground search</div>

<div class="search-form-wrapper">
  <div class="search-form-input">
    <div class="clear-input">
      <input
        type="text"
        placeholder="What are you looking for?"
        bind:this={searchInput}
        on:keypress={handleKeypress}
        class="search-input"
      />
      <button
        class="clear-input-button"
        aria-label="Clear input"
        bind:this={clearSearchButton}
      >
      </button>
    </div>
  </div>
  <button
    class="search-button"
    aria-label="Search"
    bind:this={searchButton}
    data-tooltip-position="bottom"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  </button>
</div>

{#if entries.length}
<div class="search-results-wrapper">
  <div class="results-note">
    {(entries.length === 50) ? entries.length + "+" : entries.length} playgrounds found
  </div>
  {#each entries as item}
    <div class="result-row">
      <div>
        <div>
          <a
            href="obsidian://playground?vault={encodeURIComponent(app.vault.getName())}&playgroundPath={encodeURIComponent(item.path)}"
            aria-label="Open playground → {item.path.split('/').pop().replace('.json', '')}"
          >
            {item.title}
          </a>
        </div>
        <div>
          <button
            use:copyUrlHandler={item.path}
            class="clickable-icon setting-editor-extra-setting-button"
            aria-label="Copy Obsidian URL to clipboard"
          >
          </button>
        </div>
        <div>
          <button
            use:openJsonHandler={item.path}
            class="clickable-icon setting-editor-extra-setting-button"
            aria-label="Open JSON file"
          >
          </button>
        </div>
      </div>
      <div class="result-row-stats">
        <div>{@html '<span>Score:</span> ' + Math.round(item.score)}</div>
        <div>{@html '<span>Matches:</span> ' + ((item.matches.length === 99) ? item.matches.length + "+" : item.matches.length)}</div>
      </div>
    </div>
  {:else}
    <div class="search-results-wrapper"></div>
  {/each}
</div>
{/if}
<div class="waiting-indicator" style="display: none;">
  {@html INDICATOR_SVG}
</div>
<div class="no-result" style="display: none;">
  No playgrounds found
</div>
<div class="no-omnisearch" style="display: none;" bind:this={noOmnisearch}>
  <p>
    <span bind:this={noOmnisearchIcon}></span>
    <span>The Omnisearch plugin is required for searching playgrounds.</span>
  </p>
  <p>
    <a href="obsidian://show-plugin?id=omnisearch">Install Omnisearch plugin</a>
  </p>
</div>

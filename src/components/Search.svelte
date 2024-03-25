<script lang="ts">
  import { setIcon, TFile } from "obsidian";
  import { onMount } from "svelte";
  // import { escapeRegExp } from 'lodash-es';
  import { copyStringToClipboard } from "../utils";
  import {INDICATOR_SVG} from "../assets/indicator";
  // import { showNotice } from '../utils/notice';

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

  let omnisearch: OmnisearchApi;

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
    // console.log(result);
    if (result.length) {
      result.forEach((res: ResultNoteApi) => {
        // console.log(res.excerpt);
        let fileExt = res.path.split('.').pop();
        if (fileExt === 'json') {
          // console.log(res.matches);
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

  function createNoteHandler(node: HTMLElement, path: string) {
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

  /*/
  function highlightText(text: string, matches: SearchMatchApi[]): string {
    if (!matches.length) {
      return text
    }
      try {
      // Text to highlight
      const src = new RegExp(
        matches
          .map(
            // This regex will match the word (with \b word boundary)
            // \b doesn't detect non-alphabetical character's word boundary, so we need to escape it
            matchItem =>
              `\\b${escapeRegExp(matchItem.match)}\\b${
                !/[a-zA-Z]/.test(matchItem.match)
                  ? `|${escapeRegExp(matchItem.match)}`
                  : ''
              }`
          )
          .join('|'),
        'giu'
      )

      // Replacer function that will highlight the matches
      const replacer = (match: string) => {
        const matchInfo = matches.find(info =>
          match.match(
            new RegExp(
              `\\b${escapeRegExp(info.match)}\\b${
                !/[a-zA-Z]/.test(info.match) ? `|${escapeRegExp(info.match)}` : ''
              }`,
              'giu'
            )
          )
        )
        if (matchInfo) {
          // return `<span class="${highlightClass}">${match}</span>`
          return `<span class="omnisearch-default-highlight">${match}</span>`
        }
        return match
      }

      // Effectively highlight the text
      return text.replace(src, replacer)
    } catch (e) {
      console.error('Omnisearch - Error in highlightText()', e)
      return text
    }
  }
  /**/


  onMount(() => {
    if (!this.app.plugins.plugins["omnisearch"]) {
      // showNotice('Omnisearch not installed or enabled! Click to dismiss.', 0, 'error');
      // console.log('Omnisearch not installed or enabled!');
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
    // https://nikitahl.com/input-clear-button
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
    <div class="clear-input-container">
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
      <!-- <div class="result-score" aria-label="Score: ${item.score}">score: {`${Math.round(item.score)}`}</div> -->
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
            use:createNoteHandler={item.path}
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

    <!-- <div style="padding:.25em;font-size:var(--font-smaller);">
      {@html 'Score: ' + Math.round(item.score) + '<br>'}
      {@html item.matches.length + ' matches'} -->
      <!-- {
        @html highlightText(
          item.excerpt
            .replaceAll('&amp;', '&')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('&quot;', '"')
            .replaceAll('&#039;', "'")
            .replaceAll('<br>', '')
          , item.matches
        )
      } -->
      <!-- {
        item.excerpt
          .replaceAll('&amp;', '&')
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>')
          .replaceAll('&quot;', '"')
          .replaceAll('&#039;', "'")
          .replaceAll('<br>', '')
        } -->
    <!-- </div> -->
    <!-- <div>
      {item.matches.length} matches
    </div> -->
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

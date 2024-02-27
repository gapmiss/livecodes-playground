<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";

  export let changes: {
    tags: string[];
  };
  export let delimiter = ",";
  let current = "";

  function parseInput() {
    const tagSet = new Set(changes.tags);
    current.split(delimiter).forEach((t) => {
      const clean = t && t.trim();
      clean && clean !== "" && tagSet.add(t);
    });
    current = "";
    sync(tagSet);
  }

  function handleInput({ key, code }:KeyboardEvent) {
    (key === delimiter || code === "Enter") && parseInput();
  }

  function removeTag(tag: string) {
    const tagSet = new Set(changes.tags);
    tagSet.delete(tag);
    sync(tagSet);
  }

  function sync(tagSet: Set<string>) {
    changes.tags = [...tagSet];
  }

  onMount(() => {});
</script>

<div class="setting-item tags-setting">
  <div class="setting-item-info">
    <div class="setting-item-name">Tags</div>
    <div class="setting-item-description">Use alpha-numeric with dashes and/or underscores ONLY, for compatibility with Obsidian's tags.</div>
  </div>
  <div class="setting-item-control">
    <div class="multi-select-container">
        {#each [...changes.tags.values()] as tag (tag)}
            <div class="multi-select-pill" animate:flip={{ duration: 200 }}>
              <div class="multi-select-pill-content"><span>{tag}</span></div>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div class="multi-select-pill-remove-button" aria-label="Remove tag" on:click={() => removeTag(tag)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="svg-icon lucide-x">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </div>
            </div>
        {/each}
        <div class="input">
          <input
            class="tag-entry"
            type="text"
            on:keyup={handleInput}
            on:blur={parseInput}
            bind:value={current}
          />
        </div>
    </div>
  </div>
</div>

<style>
  .multi-select-container {
    --pill-color-hover: var(--text-normal);
    --pill-color-remove: var(--text-faint);
    --pill-color-remove-hover: var(--color-red);
    --pill-background-hover: transparent;
    --pill-border-color-hover: var(--background-modifier-border-hover);
    --pill-padding-x: 0.65em;
    --pill-padding-y: 0.5em;
    background: none;
    border: none;
  }
  .multi-select-pill {
    height: fit-content;
  }
  .multi-select-container .tag-entry {
    border: 0;
    outline: 0;
    display: flex;
    margin: 0;
    padding: 3px 0;
    width: 100%;
    min-width: 75px;
    max-width: 150px;
    border: var(--input-border-width) solid var(--background-modifier-border);
  }
  .multi-select-container .tag-entry:focus {
    outline: 0;
  }
  .multi-select-container .input {
    background: transparent;
    margin: 0;
    padding: 0;
    width: 100%;
    flex: 1;
    border: 0;
  }
</style>

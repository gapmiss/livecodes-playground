export const helpPopovers = {
  appUrl:
  { 
    title: 'App URL', 
    description: '<p>Load the playground from a custom URL (e.g. <a href="https://livecodes.io/docs/features/self-hosting" target="_blank" rel="noopener noreferrer" class="external-link">self-hosted app</a>, <a href="https://livecodes.io/docs/features/permanent-url" target="_blank" rel="noopener noreferrer" class="external-link">permanent URL</a>). Trailing slash <strong>/</strong> is required.</p><p>Default: <strong>https://v21.livecodes.io/</strong></p>' 
  },
  shortUrl:
  { 
    title: 'Short share URL', 
    description: '<p>This requires sending the project configuration (<strong>including source code</strong>) to a server that saves the code and provides a short Id which can be used to retrieve the project. <strong>It cannot then be deleted</strong>.<p>The app hosted on <a href="https://livecodes.io" target="_blank" rel="noopener noreferrer" class="external-link">https://livecodes.io</a> uses an API endpoint specifically provided to generate short URLs for LiveCodes share service. We will make every effort to keep that online and available for free use, so long as it is not abused.</p><p>Short URLs generated by LiveCodes share service are <strong>private</strong> by default and are not listed or indexed.</p><p>See <a href="https://livecodes.io/docs/features/share" target="_blank" rel="noopener noreferrer" class="external-link">Livecodes documentation</a> page on sharing for further up-to-date details.</p>' 
  },
  githubToken:
  {
    title: 'Github API token',
    description: 'Add a Github API token to enable creating gists from a playground. Create a token at <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" class="external-link">https://github.com/settings/tokens/new</a> (only gist permission required)'
  },
  playgroundFolder: 
  { 
    title: 'Playground folder', 
    description: '<p>Select a vault folder to save & persist playground configuration files (JSON).</p><p>Default: <strong>playgrounds</strong></p>'
  },
  notesFolder: 
  { 
    title: 'Notes folder', 
    description: '<p>Select a vault folder to save playground notes (Markdown).</p><p>Default: <strong>playgrounds/notes</strong></p>'
  },
  autoWatch: 
  { 
    title: 'Auto watch', 
    description: '<p>Automatically watch for playground changes, then update the corresponding configuration file (JSON).</p><p>Default: <strong>enabled</strong></p>'
  },
	editor:
	{ 
		title: 'Code editor', 
		description: '<p>The following code editors are supported:</p><div><p><strong>monaco</strong>: This is the code editor that powers <strong>VS Code</strong>. It is feature-rich and supports autocomplete with <strong>IntelliSense</strong> (including types for custom libraries). <!-- However, it requires a relatively large download and is not supported in mobile browsers. --></p><p><strong>codemirror</strong>: Has many editing features, including autocomplete, with good <strong>mobile support</strong>.</p><p><strong>codejar</strong>: A <strong>lightweight</strong> code editor with very basic editing features. PrismJs is used for syntax highlighting. Please note that some editor settings are not supported in CodeJar</p></div><p>Default: <strong>monaco</strong></p>' 
	},
	editorTheme:
	{
		title: 'Editor theme',
		description: '<p>Set the editor theme for each editor and on light/dark modes.</p>'
	}
}

/**
 * https://josias-r.github.io/boarding.js
 * https://github.com/josias-r/boarding.js
 */
export const onboardingSteps = [
  {
    element: '.setting-item-heading-onboarding', 
    popover:
    {
      title: "Livecodes settings",
      description: "Click the <kbd>Next →</kbd> button to start a brief tour of Livecodes' settings. HINT: Use your keyboard's <kbd>←</kbd> and <kbd>→</kbd> arrow keys to navigate the tour.",
    }
  },
  { 
    element: '.livecodes-settings-input-appurl', 
    popover: helpPopovers.appUrl
  },
  { 
    element: '.livecodes-settings-input-shorturl', 
    popover: helpPopovers.shortUrl
  },
  { 
    element: '.livecodes-settings-input-githubtoken', 
    popover: helpPopovers.githubToken
  },
  {
    element: '.livecodes-settings-input-playgrounds', 
    popover: helpPopovers.playgroundFolder
  },
  {
    element: '.livecodes-settings-input-autowatch', 
    popover: helpPopovers.autoWatch
  },
  {
    element: '.livecodes-settings-input-notes', 
    popover: helpPopovers.notesFolder 
  },
  { 
    element: '.dropdownEditor', 
    popover: helpPopovers.editor
  }
]

export const buttonTour = [
  {
    element: '.watch-button', 
    popover:
    {
      title: "Watch for changes",
      description: "<p>Automatically watch for playground changes, then update the corresponding configuration file (JSON).</p><p>Default: <strong>enabled</strong></p>",
    }
  },
  {
    element: '.create-note-button', 
    popover:
    {
      title: "Create note",
      description: "<p>Create a markdown note with created date, playground link, and corresponding codeblocks from the playground editor.</p>",
    }
  },
  {
    element: '.save-json-button', 
    popover:
    {
      title: "Save as JSON",
      description: "<p>Save playground as a new JSON file.</p><p><strong>⚠️ Note: The new playground will need to be opened in a new playground view.</strong></p>",
    }
  },
  {
    element: '.save-html-button', 
    popover:
    {
      title: "Save as HTML",
      description: "<p>Save playground results to HTML. A prompt will ask where to save the HTML file on your device.</p>",
    }
  },
  {
    element: '.copy-html-button', 
    popover:
    {
      title: "Copy HTML to clipboard",
      description: "<p>Copy playground results HTML to the clipboard.</p>",
    }
  },
  {
    element: '.share-url-button', 
    popover:
    {
      title: "Copy share URL to clipboard",
      description: '<p>The generated URL encodes the project configuration in a base-64-encoded compressed query string. This step is generated locally without sending the code to any server. However, depending on the size of the project, the URL can be very long.</p><p>If <strong>Short share URL</strong> is enabled in settings, a short share URL will be generated. This requires sending the project configuration (<strong>including source code</strong>) to a server that saves the code and provides a short Id which can be used to retrieve the project.</p><p>See <a href="https://livecodes.io/docs/features/share" target="_blank" rel="noopener noreferrer" class="external-link">Livecodes documentation</a> page on sharing for further up-to-date details.</p>',
    }
  },
  {
    element: '.create-gist-button', 
    popover:
    {
      title: "Create Github gist",
      description: '<p>Create a PUBLIC gist which consists of 3 files.</p><ol><li>The HTML results (<code>.html</code>)</li><li>The playground configuration file (<code>.json</code>)</li><li>A markdown file (<code>.md</code>) with frontmatter (date created, obsidian playground URL) and fenced codeblocks (markup, style, script)</li></ol><p>2 URLs are copied to your clipboard.</p><ol><li>link to the gist</li><li>link to the playground\'s PUBLIC url which can be used to share your playground.</li></ol>',
    }
  },
  {
    element: '.theme-mode-button', 
    popover:
    {
      title: "Set theme mode",
      description: "<p>Sets the playground theme to light/dark mode.</p>",
    }
  },
  {
    element: '.external-resources-button', 
    popover:
    {
      title: "External resources",
      description: '<p>URLs to external CSS <strong>stylesheets</strong> and JS <strong>scripts</strong> can be added to the playground. URLs to stylesheets/scripts should be added each in a separate line. Stylesheets and scripts are loaded in the result page before editor codes. Thus, CSS properties defined in external stylesheets can be overriden in the style editor. Global javascript variables defined in external scripts are available to code in the script editor.</p><p>Choice of <strong>CSS presets</strong>, currently <a href="https://necolas.github.io/normalize.css/" target="_blank" rel="noopener noreferrer" class="external-link">Normalize.css</a> and <a href="https://meyerweb.com/eric/tools/css/reset/" target="_blank" rel="noopener noreferrer" class="external-link">Reset CSS</a>.</p>',
    }
  },
  {
    element: '.playground-settings-button', 
    popover:
    {
      title: "Playground settings",
      description: '<p>1. <strong>Title:</strong> used in result title tag and meta/title tag.</p><p>2. <strong>Description</strong>: used in result meta/description tag.</p><p>3. <strong>&lt;head&gt;:</strong> content added to the result &lt;head&gt; element. <p>Default:<br /><code>&lt;meta charset="UTF-8" /&gt;</code><br /><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;</code>.<p>4. <strong>htmlAttrs:</strong> attributes added to the result pane <code>&lt;html&gt;</code> element. It can be an object or a string.</p><p>Example:<br /><code>{ lang: "en", class: "dark" }</code> or <code>lang="en" class="dark"</code><br />becomes<br /><code>&lt;html lang="en" class="dark"&gt;</code>.</p><p>Default: <code>lang="en" class=""</code></p>',
    }
  },
]
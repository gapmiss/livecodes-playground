export const helpModals = {
  appUrl:
  { 
    title: 'App URL', 
    description: '<p>Load the playground from a custom URL (e.g. <a href="https://livecodes.io/docs/features/self-hosting" data-tooltip-position="top" aria-label="https://livecodes.io/docs/features/self-hosting" target="_blank" rel="noopener" class="external-link">self-hosted app</a>, <a href="https://livecodes.io/docs/features/permanent-url" data-tooltip-position="top" aria-label="https://livecodes.io/docs/features/permanent-url" target="_blank" rel="noopener" class="external-link">permanent URL</a>). Trailing slash <strong>/</strong> is required.</p><p>Default: <strong class="appurl-copy" aria-label="Click to copy">https://v24.livecodes.io/</strong>' 
  },
  shortUrl:
  { 
    title: 'Short share URL', 
    description: '<p><span class="alert-icon" aria-label="Info"></span><span>This requires sending the playground configuration (<strong>including source code</strong>) to a server that saves the code and provides a short Id which can be used to retrieve the playground. <strong>It cannot then be deleted</strong>.</span></p><p>The app hosted on <a href="https://livecodes.io" target="_blank" rel="noopener" class="external-link">https://livecodes.io</a> uses an API endpoint specifically provided to generate short URLs for LiveCodes share service. We will make every effort to keep that online and available for free use, so long as it is not abused.</p><p>Short URLs generated by LiveCodes share service are <strong>private</strong> by default and are not listed or indexed.</p><p>See <a href="https://livecodes.io/docs/features/share" data-tooltip-position="top" aria-label="https://livecodes.io/docs/features/share" target="_blank" rel="noopener" class="external-link">Livecodes documentation</a> page on sharing for further up-to-date details.</p>' 
  },
  githubToken:
  {
    title: 'Github API token',
    description: 'Add a Github API token to enable creating gists from a playground. Create a token at <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener" class="external-link">https://github.com/settings/tokens/new</a> (only gist permission required)'
  },
  githubGistPublic:
  {
    title: "Github gist privacy",
    description: '<p>Gists can be public or secret. public gists show up in <a href="https://gist.github.com/discover" data-tooltip-position="top" aria-label="https://gist.github.com/discover" target="_blank" rel="noopener" class="external-link">Github Discover</a>, where people can browse new gists as they\'re created. They\'re also searchable, so you can use them if you\'d like other people to find and see your work.</p><p>Secret gists don\'t show up in <a href="https://gist.github.com/discover" data-tooltip-position="top" aria-label="https://gist.github.com/discover" target="_blank" rel="noopener" class="external-link">Github Discover</a> and are not searchable unless you are logged in and are the author of the secret gist. Secret gists aren\'t private. If you send the URL of a secret gist to a friend, they\'ll be able to see it. However, if someone you don\'t know discovers the URL, they\'ll also be able to see your gist.</p><p>After creating a gist, you cannot convert it from public to secret. However, a secret gist can be made public by editing the gist and updating the visibility to public.</p><p>See <a href="https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/creating-gists" target="_blank" rel="noopener" class="external-link" data-tooltip-position="top" aria-label="https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/creating-gists">Github gist documentation</a> page on creating gists for further up-to-date details.</p>'
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
    description: '<p>The following code editors are supported:</p><div><p><strong><a href="https://microsoft.github.io/monaco-editor/" data-tooltip-position="top" aria-label="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener" class="external-link">monaco</a></strong>: This is the code editor that powers <strong>VS Code</strong>. It is feature-rich and supports autocomplete with <strong>IntelliSense</strong> (including types for custom libraries).<!-- However, it requires a relatively large download and is not supported in mobile browsers. --></p><p><strong><a href="https://codemirror.net/" data-tooltip-position="top" aria-label="https://codemirror.net/" target="_blank" rel="noopener" class="external-link">codemirror</a></strong>: Has many editing features, including autocomplete, with good <strong>mobile support</strong>.</p><p><strong><a href="https://medv.io/codejar/" data-tooltip-position="top" aria-label="https://medv.io/codejar/" target="_blank" rel="noopener" class="external-link">codejar</a></strong>: A <strong>lightweight</strong> code editor with very basic editing features. PrismJs is used for syntax highlighting. Please note that some editor settings are not supported in CodeJar.</p></div><p>Default: <strong>monaco</strong></p><p>See <a href="https://livecodes.io/docs/features/editor-settings#code-editor" data-tooltip-position="top" aria-label="https://livecodes.io/docs/features/editor-settings#code-editor" target="_blank" rel="noopener" class="external-link">Livecodes docs</a> for further details.</p>' 
  },
  editorTheme:
  {
    title: 'Editor theme',
    description: '<p>Set the editor theme for each editor and on light/dark modes.</p>'
  },
  enableAI:
  {
    title: 'Enable AI',
    description: '<p>LiveCodes supports AI-powered code completion, completely for <strong>free</strong> with <strong>no account or API token required</strong>, powered by <a href="https://codeium.com/" data-tooltip-position="top" aria-label="https://codeium.com/" target="_blank" rel="noopener" class="external-link">Codeium</a>, the ultrafast Copilot alternative.</p><p>The large generative machine learning model is capable of understanding the context of your code and comments in order to generate suggestions on what you might want to type next.</p><p>It has a wide range of language support.</p><p>Currently, only Monaco editor is supported. Wider editor support is planned.</p><p class="admonitionContent_S0QG"><p><span class="alert-icon" aria-label="Info"></span><span>Please note that when using Codeium AI assistant, your code is sent to their servers for code completion. However, your code is not used for training their model. Check Codeium <a href="https://codeium.com/faq#Will-Codeium-regurgitate-private-code%3F" data-tooltip-position="top" aria-label="https://codeium.com/faq#Will-Codeium-regurgitate-private-code%3F" target="_blank" rel="noopener" class="external-link">FAQ</a> and <a href="https://codeium.com/privacy-policy" data-tooltip-position="top" aria-label="https://codeium.com/privacy-policy" target="_blank" rel="noopener" class="external-link">privacy policy</a> for more details.</span></p>'
  },
  noteTemplate:
  {
    title: 'Note markdown template',
    description: '<p>Available variables:<table><tr><td><code>{{date}}</code></td><td>YYYY-MM-DD</td></tr><tr><td><code>{{time}}</code></td><td>HH:mm</td></tr><tr><td><code>{{timeFull}}</code></td><td>HH:mm:ss</td></tr><tr><td><code>{{title}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{descProperty}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{descString}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{tagsList}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{tagsString}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{obsidianUrl}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{head}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{htmlAttrs}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{stylesheetsList}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{scriptsList}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{cssPreset}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{markupLanguage}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{markupCode}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{styleLanguage}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{styleCode}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{scriptLanguage}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{scriptCode}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{htmlResults}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr></table></p>'
  },
  gistTemplate:
  {
    title: 'Gist markdown template',
    description: '<p>Available variables:<table><tr><td><code>{{date}}</code></td><td>YYYY-MM-DD</td></tr><tr><td><code>{{time}}</code></td><td>HH:mm</td></tr><tr><td><code>{{timeFull}}</code></td><td>HH:mm:ss</td></tr><tr><td><code>{{title}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{descProperty}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{descString}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{tagsList}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{tagsString}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{obsidianUrl}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{head}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{htmlAttrs}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{stylesheetsList}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{scriptsList}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{cssPreset}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{markupLanguage}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{markupCode}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{styleLanguage}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{styleCode}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{scriptLanguage}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{scriptCode}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr><tr><td><code>{{htmlResults}}</code></td><td>Amet officia pariatur cillum cupidatat reprehenderit Lorem consectetur et.</td></tr></td></tr></table></p>'
  },
  sponsorship:
  {
    title: "Support the developers",
    description: "<p>If this plugin adds value for you and you would like to help support continued development, please consider sponsoring the developers.</p>"
  }
}

export const buttonTour = [
  {
    element: '.watch-button', 
    popover:
    {
      title: "Watch for changes",
      description: "<p>Automatically watch for playground changes, then update the corresponding configuration file (JSON).</p><p>Default: <strong>enabled</strong></p><div><button data-prev='0' disabled=\"disabled\">←</button><span class=\"paging\">(1 of 10)</span><button data-step='1'>→</button></div>",
    }
  },
  {
    element: '.create-note-button', 
    popover:
    {
      title: "Create note",
      description: "<p>Create a markdown note with title, description, tags, created date, playground link, external resources, head meta, HTML attributes, and corresponding codeblocks from the playground editor.</p><div><button data-prev='1'>←</button><span class=\"paging\">(2 of 10)</span><button data-step='2'>→</button></div>",
    }
  },
  {
    element: '.save-json-button', 
    popover:
    {
      title: "Save as JSON",
      description: "<p>Save playground as a new JSON file.</p><p><span class=\"default-icon\"></span><span>The new playground will need to be opened in a new playground view.</span></p><div><button data-prev='2'>←</button><span class=\"paging\">(3 of 10)</span><button data-step='3'>→</button></div>",
    }
  },
  {
    element: '.save-html-button', 
    popover:
    {
      title: "Save as HTML",
      description: "<p>Save playground results to HTML. A prompt will ask where to save the HTML file on your device.</p><div><button data-prev='3'>←</button><span class=\"paging\">(4 of 10)</span><button data-step='4'>→</button>",
    }
  },
  {
    element: '.copy-html-button', 
    popover:
    {
      title: "Copy HTML to clipboard",
      description: "<p>Copy playground results HTML to the clipboard.</p><div><button data-prev='4'>←</button><span class=\"paging\">(5 of 10)</span><button data-step='5'>→</button>",
    }
  },
  {
    element: '.share-url-button', 
    popover:
    {
      title: "Copy share URL to clipboard",
      description: '<p>The generated URL encodes the playground configuration in a base-64-encoded compressed query string. This step is generated locally without sending the code to any server. However, depending on the size of the playground, the URL can be very long.</p><p>If <strong>Short share URL</strong> is enabled in settings, a short share URL will be generated.</p><p><span class="alert-icon" aria-label="Info"></span><span>This requires sending the playground configuration (<strong>including source code</strong>) to a server that saves the code and provides a short Id which can be used to retrieve the playground.</span></p><p>See <a href="https://livecodes.io/docs/features/share" data-tooltip-position="top" aria-label="https://livecodes.io/docs/features/share" target="_blank" rel="noopener" class="external-link">Livecodes documentation</a> page on sharing for further up-to-date details.</p><div><button data-prev=\'5\'>←</button><span class="paging">(6 of 10)</span><button data-step=\'6\'>→</button>',
    }
  },
  {
    element: '.create-gist-button', 
    popover:
    {
      title: "Create Github gist",
      description: '<p>Create a gist which optionally consists of a Livecodes.io playground link and 3 files.</p><ol><li>The HTML results (<code>.html</code>)</li><li>The playground configuration file (<code>.json</code>)</li><li>A markdown file (<code>.md</code>) with frontmatter (date created, obsidian playground URL) and fenced codeblocks (markup, style, script)</li></ol><p>3 URLs are copied to your clipboard and printed to the developer console.</p><ol><li>link to the gist</li><li>link to the Livecodes\' PUBLIC url which can be used to share your playground.</li><li>link to open the playground in Obsidian</li></ol><div><button data-prev=\'6\'>←</button><span class="paging">(7 of 10)</span><button data-step=\'7\'>→</button>',
    }
  },
  {
    element: '.theme-mode-button', 
    popover:
    {
      title: "Set theme mode",
      description: "<p>Sets the playground theme to light/dark mode.</p><div><button data-prev='7'>←</button><span class=\"paging\">(8 of 10)</span><button data-step='8'>→</button>",
    }
  },
  {
    element: '.external-resources-button', 
    popover:
    {
      title: "External resources",
      description: '<p>URLs to external CSS <strong>stylesheets</strong> and JS <strong>scripts</strong> can be added to the playground. URLs to stylesheets/scripts should be added each in a separate line. Stylesheets and scripts are loaded in the result page before editor codes. Thus, CSS properties defined in external stylesheets can be overriden in the style editor. Global javascript variables defined in external scripts are available to code in the script editor.</p><p>Choice of <strong>CSS presets</strong>, currently <a href="https://necolas.github.io/normalize.css/" data-tooltip-position="top" aria-label="https://necolas.github.io/normalize.css/" target="_blank" rel="noopener" class="external-link">Normalize.css</a> and <a href="https://meyerweb.com/eric/tools/css/reset/" data-tooltip-position="top" aria-label="https://meyerweb.com/eric/tools/css/reset/" target="_blank" rel="noopener" class="external-link">Reset CSS</a>.</p><div><button data-prev=\'8\'>←</button><span class="paging">(9 of 10)</span><button data-step=\'9\'>→</button>',
    }
  },
  {
    element: '.playground-settings-button', 
    popover:
    {
      title: "Playground settings",
      description: '<p>1. <strong>Title:</strong> used in result title tag and meta/title tag.</p><p>2. <strong>Description</strong>: used in result meta/description tag.</p><p>3. <strong>Tags</strong>: used when creating a playground note.</p><p>4. <strong>&lt;head&gt;:</strong> content added to the result &lt;head&gt; element. <p>Default:<br /><strong class="code">&lt;meta charset="UTF-8" /&gt;</strong><br /><strong class="code">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;</strong><p>5. <strong>htmlAttrs:</strong> attributes added to the result pane <strong class="code">&lt;html&gt;</strong> element. It can be an object or a string.</p><p>Example:<br /><strong class="code">{ lang: "en", class: "dark" }</strong> or <strong class="code">lang="en" class="dark"</strong><br />becomes<br /><strong class="code">&lt;html lang="en" class="dark"&gt;</strong></p><p>Default: <strong class="code">lang="en" class=""</strong></p><div><button data-prev=\'9\'>←</button><span class="paging">(10 of 10)</span><button data-step=\'10\' disabled="disabled">→</button>',
    }
  },
]

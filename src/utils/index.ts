import { normalizePath, Notice, requestUrl, type App } from "obsidian";
import { driver } from "driver.js";
// import form2buffer from "./Form2Buffer";

export function saveJson(
  app: App,
  path: string,
  content: string
) {
  savePlaygroundToFile(app, path, content);
}

async function savePlaygroundToFile(
  app: App,
  path: string,
  content: string
) {
  const filePath = normalizePath(path);
  await app.vault.adapter.write(filePath, content);
}

export async function downloadFile(data: BlobPart, fileName: string, type="text/plain") {
  const a = activeDocument.createElement("a");
  a.style.display = "none";
  activeDocument.body.appendChild(a);
  a.href = window.URL.createObjectURL(
    new Blob([data], { type })
  );
  a.setAttribute("download", fileName);
  a.click();
  window.URL.revokeObjectURL(a.href);
  activeDocument.body.removeChild(a);
  return;
}

/**
 * from: https://github.com/Obsidian-TTRPG-Community/TTRPG-Community-Admin/
 */
export async function copyStringToClipboard(text:string, topic:string|undefined=undefined) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      new Notice((topic !== undefined ? topic + " " : "") + "copied to clipboard", 2500);
    })
    .catch(function (error) {
      console.error('Failed to copy to clipboard: ', error)
    })
}

/**
 * https://blog.codepen.io/documentation/prefill/
 */
export async function postToCodepen(ele: HTMLElement, params: string, path: string = "https://codepen.io/pen/define", method: string='POST') {
  const form = window.document.createElement('form');
  form.method = method;
  form.action = path;
  form.target = '_blank';
  const hiddenField = window.document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = 'data';
  hiddenField.value = params;	
  form.appendChild(hiddenField);
  const submitBttn = window.document.createElement('input');
  submitBttn.type = 'submit';
  submitBttn.value = "Create New Pen with Prefilled Data";
  form.appendChild(submitBttn);  
  ele.appendChild(form);
  form.submit();
  // form.detach();

  /*/
  const form = new FormData();
  form.append("data", params);
  const buffer = await form2buffer(form);
  console.log('buffer');
  console.log(buffer);
  const response = (
    await requestUrl({
      url: path,
      method: "POST",
      body: buffer.body,
      headers: {
        "Content-Type": buffer.contentType,
      },
    })
  );
  console.log('response');
  console.log(response);
  /**/
}

/**
 * https://driverjs.com/docs/api
 */
export const driverObj = driver({
  // popoverClass: 'driverjs-theme',
  showProgress: true,
  steps: [
    {
      popover:
      {
        title: "Welcome to the Livecodes playground tour!",
        description: "Click the <strong>Next →</strong> button to start the tour. HINT: Use your keyboard's <kbd>←</kbd> and <kbd>→</kbd> arrow keys to navigate the tour.",
      }
    },
    { 
      element: '.livecodes-settings-input-appurl', 
      popover:
      { 
        title: 'App URL', 
        description: 'Load the playground from a custom URL (e.g. <a href="https://livecodes.io/docs/features/self-hosting" class="external-link">self-hosted app</a>, <a href="https://livecodes.io/docs/features/permanent-url" class="external-link">permanent URL</a>)' 
      }
    },
    { element: '.livecodes-settings-input-playgrounds', popover: { title: 'Title', description: 'Description' } },
    { element: '.livecodes-settings-input-notes', popover: { title: 'Title', description: 'Description' } },
    { element: '.livecodes-settings-input-autowatch', popover: { title: 'Title', description: 'Description' } },
    { 
      element: '.dropdownEditor', 
      popover:
      { 
        title: 'Code Editor', 
        description: '<p>The following code editors are supported:</p><ul><li><strong>Monaco Editor</strong>: This is the code editor that powers <strong>VS Code</strong>. It is feature-rich and supports autocomplete with <strong>IntelliSense</strong> (including types for custom libraries). <!-- However, it requires a relatively large download and is not supported in mobile browsers. --></li><li><strong>CodeMirror</strong>: Has many editing features, including autocomplete, with good <strong>mobile support</strong>.</li><li><strong>CodeJar</strong>: A <strong>lightweight</strong> code editor with very basic editing features. PrismJs is used for syntax highlighting. Please note that some editor settings are not supported in CodeJar</li></ul>' 
      } 
    },
  ]
});

export const blankPlayground = {
  appUrl: "https://v21.livecodes.io/",
  title: "New Project",
  description: "",
  head: "<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
  htmlAttrs: "lang=\"en\" class=\"\"",
  tags: [],
  autoupdate: false,
  autosave: false,
  autotest: false,
  delay: 1500,
  formatOnsave: false,
  mode: "full",
  theme: "dark",
  recoverUnsaved: true,
  showSpacing: false,
  welcome: true,
  readonly: false,
  allowLangChange: true,
  activeEditor: "markup",
  markup: {
    language: "html",
    content: ""
  },
  style: {
    language: "css",
    content: ""
  },
  script: {
    language: "javascript",
    content: ""
  },
  stylesheets: [],
  scripts: [],
  cssPreset: "normalize.css",
  imports: {},
  types: {},
  tests: {
    language: "typescript",
    content: ""
  },
  tools: {
    enabled: "all",
    active: "console",
    status: "open"
  },
  zoom: 1,
  processors: [],
  customSettings: {},
  editor: "monaco",
  fontFamily: "Iosevka",
  fontSize: 12,
  useTabs: false,
  tabSize: 2,
  lineNumbers: true,
  wordWrap: false,
  closeBrackets: true,
  semicolons: true,
  singleQuote: false,
  trailingComma: true,
  emmet: true,
  editorTheme: [],
  version: "21"
};

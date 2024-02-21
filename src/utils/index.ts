import { normalizePath, Notice, App } from "obsidian";

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
/*/
export async function postToCodepen(ele: HTMLElement, params: string, path: string = "https://codepen.io/pen/define", method: string='POST') {
  console.log(params);  
  const form = window.document.createElement('form');
  form.method = method;
  form.action = path;
  form.target = '_blank';
  form.setAttribute('style', 'display:none;');
  const button = window.document.createElement('button');
  button.name = 'data';
  button.value = params;	
  form.appendChild(button);
  ele.appendChild(form);
  // console.log(form);
  // form.submit();
  // form.detach();
}
/**/
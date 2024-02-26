import { normalizePath, App } from "obsidian";
import { showNotice } from './notice';

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
      showNotice((topic !== undefined ? topic + " " : "Text ") + "copied to clipboard", 2500, 'success');
    })
    .catch(function (error) {
      console.error('Failed to copy to clipboard: ', error)
    })
}

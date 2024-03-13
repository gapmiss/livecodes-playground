import { normalizePath, App, TFile } from "obsidian";
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
  let filePath = normalizePath(path);
  let fPath: TFile = this.app.vault.getFileByPath(filePath)!;
  try {
    await app.vault.modify(fPath, content);
  } catch (error) {
    console.log(error);
  }
}

export async function downloadFile(data: BlobPart, fileName: string, type="text/plain") {
  let a = activeDocument.createElement("a");
  a.href = window.URL.createObjectURL(
    new Blob([data], { type })
  );
  a.setAttribute("class", 'download-file-link');
  a.setAttribute("download", fileName);
  activeDocument.body.appendChild(a);
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

/**
 * https://github.com/NomarCub/obsidian-copy-url-in-preview/blob/main/src/helpers.ts#L78
 */
export interface Listener {
  (this: Document, ev: Event): any;
}

export function onElement(
  el: Document,
  event: keyof HTMLElementEventMap,
  selector: string,
  listener: Listener,
  options?: { capture?: boolean }
) {
  el.on(event, selector, listener, options);
  return () => el.off(event, selector, listener, options);
}
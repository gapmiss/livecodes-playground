import { normalizePath, Notice, requestUrl, type App } from "obsidian";

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

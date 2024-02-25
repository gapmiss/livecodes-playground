// credits: https://github.com/nyable/obsidian-code-block-enhancer/blob/master/src/core.ts#L6:7
import { type MarkdownPostProcessorContext, type App, setIcon } from 'obsidian';
import LivecodesPlugin from "../main";
import { codeLanguages } from "../livecodes";

let markupLanguages:any[] = [];
codeLanguages().markup.forEach((m) => {
  markupLanguages.push(m.name);
});
codeLanguages().style.forEach((m) => {
  markupLanguages.push(m.name);
});
codeLanguages().script.forEach((m) => {
  markupLanguages.push(m.name);
});

export function codeBlockPostProcessor(
  element: HTMLElement,
  context: MarkdownPostProcessorContext,
  app: App,
  plugin: LivecodesPlugin
) {
  let lang = 'text';
  const code: HTMLPreElement = element.querySelector('pre:not(.frontmatter) > code') as HTMLPreElement;
  if (!code) return;
  if (!markupLanguages.some(name => code.classList.contains(`language-${name}`))) {
    return;
  }
  const LANG_REGEX = /^language-/;
  code.classList.forEach((val, key) => {
    if (LANG_REGEX.test(val)) {
      lang = val.replace(`language-`, '');
      return;
    }
  });

  const pre = code.parentElement;
  if (pre?.parentElement?.querySelector(`div.open-with-livecodes-codeblock`)) {
    return;
  }
  pre?.parentElement?.addClass(`open-with-livecodes-codeblock`);
  const button = createEl('button', {cls:'open-with-livecodes-button'});
  button.setAttribute('aria-label', 'Open in livecodes');
  setIcon(button, "code");
  pre?.appendChild(button);

  const buttonHanlder = async () => {
    await plugin.newLivecodesPlaygroundFromCodeblock(lang, code.innerText);
  };
  plugin.registerDomEvent(button, 'click', buttonHanlder);
}
import {TFile} from 'obsidian';

export const NOTE_MD_TEMPLATE: string = '---\ncreated: {{date}}{% if title %}\ntitle: "{{title}}"{% endif %}\n{% if descProperty %}description: {{descProperty}}{% endif %}\n{% if tagsList %}tags: {{tagsList}}{% endif %}\n{% if obsidianUrl %}playground: {{obsidianUrl}}{% endif %}\n---\n\n{% if title %}## {{ title }}\n{% endif %}\n\n{% if descString %}{{ descString }}\n{% endif %}\n\n{% if tagsString %}{{ tagsString }}\n{% endif %}\n\n{% if head %}```html\n{{ head }}\n```\n{% endif %}\n\n{% if htmlAttrs %}```text\n{{ htmlAttrs }}\n```\n{% endif %}\n\n{% if stylesheetsList %}{{ stylesheetsList }}\n{% endif %}\n\n{% if scriptsList %}{{ scriptsList }}\n{% endif %}\n\n{% if cssPreset %}`{{ cssPreset }}`\n{% endif %}\n\n{% if markupCode %}```{{ markupLanguage }}\n{{ markupCode }}\n```\n{% endif %}\n\n{% if styleCode %}```{{ styleLanguage }}\n{{ styleCode }}\n```\n{% endif %}\n\n{% if scriptCode %}```{{ scriptLanguage }}\n{{ scriptCode }}\n```\n{% endif %}\n\n{% if htmlResults %}```html\n{{ htmlResults }}\n```\n{% endif %}\n\n{# this is a nunjucks comment #}\n\n{# https://mozilla.github.io/nunjucks/templating.html #}\n\n%% this is an Obsidian markdown comment %%\n';
export const GIST_MD_TEMPLATE: string = '---\ncreated: {{date}}{% if title %}\ntitle: "{{title}}"{% endif %}\n{% if descProperty %}description: {{descProperty}}{% endif %}\n{% if tagsList %}tags: {{tagsList}}{% endif %}\n{% if obsidianUrl %}playground: {{obsidianUrl}}{% endif %}\n---\n\n{% if title %}## {{ title }}\n{% endif %}\n\n{% if descString %}{{ descString }}\n{% endif %}\n\n{% if tagsString %}{{ tagsString }}\n{% endif %}\n\n{% if head %}```html\n{{ head }}\n```\n{% endif %}\n\n{% if htmlAttrs %}```text\n{{ htmlAttrs }}\n```\n{% endif %}\n\n{% if stylesheetsList %}{{ stylesheetsList }}\n{% endif %}\n\n{% if scriptsList %}{{ scriptsList }}\n{% endif %}\n\n{% if cssPreset %}`{{ cssPreset }}`\n{% endif %}\n\n{% if markupCode %}```{{ markupLanguage }}\n{{ markupCode }}\n```\n{% endif %}\n\n{% if styleCode %}```{{ styleLanguage }}\n{{ styleCode }}\n```\n{% endif %}\n\n{% if scriptCode %}```{{ scriptLanguage }}\n{{ scriptCode }}\n```\n{% endif %}\n\n{% if htmlResults %}```html\n{{ htmlResults }}\n```\n{% endif %}\n\n{# this is a nunjucks comment #}\n\n{# https://mozilla.github.io/nunjucks/templating.html #}\n\n%% this is an Obsidian markdown comment %%\n';

export interface LivecodesSettings {
  playgroundFolder: string;
  notesFolder: string;
  autoWatch: boolean;
  appUrl: string;
  shortUrl: boolean;
  fontFamily: string;
  fontSize: any;
  editor: any;
  lineNumbers: boolean;
  darkTheme: boolean;
  layout: string;
  useTabs: boolean;
  tabSize: any;
  closeBrackets: boolean;
  semicolons: boolean;
  singleQuote: boolean;
  trailingComma: boolean;
  wordWrap: boolean;
  enableAI: boolean;
  autoUpdate: boolean;
  editorTheme: any;
  monacoDarkTheme: any;
  monacoLightTheme: any;
  codemirrorDarkTheme: any;
  codemirrorLightTheme: any;
  codejarDarkTheme: any;
  codejarLightTheme: any;
  delay: number;
  jsonTemplate: TFile | undefined;
  dataHeight: any;
  githubApiToken: string;
  githubGistPublic: boolean;
  quickPlaygroundMarkup: string;
  quickPlaygroundStyle: string;
  quickPlaygroundScript: string;
  noteMarkdownTemplate: string;
  gistMarkdownTemplate: string;
}

export const DEFAULT_SETTINGS: LivecodesSettings = {
  playgroundFolder: "playgrounds",
  notesFolder: "playgrounds/notes",
  autoWatch: true,
  appUrl: "https://v45.livecodes.io/",
  shortUrl: false,
  fontFamily: "Default",
  fontSize: "12",
  editor: "monaco",
  lineNumbers: true,
  darkTheme: true,
  layout: "responsive",
  useTabs: false,
  tabSize: "2",
  closeBrackets: true,
  semicolons: true,
  singleQuote: false,
  trailingComma: true,
  wordWrap: false,
  enableAI: false,
  autoUpdate: false,
  editorTheme: ["vs@light", "vs-dark@dark"],
  monacoDarkTheme: "",
  monacoLightTheme: "",
  codemirrorDarkTheme: "",
  codemirrorLightTheme: "",
  codejarDarkTheme: "",
  codejarLightTheme: "",
  delay: 1500,
  jsonTemplate: undefined,
  dataHeight: "600",
  githubApiToken: "",
  githubGistPublic: false,
  quickPlaygroundMarkup: 'html',
  quickPlaygroundStyle: 'css',
  quickPlaygroundScript: 'javascript',
  noteMarkdownTemplate: NOTE_MD_TEMPLATE,
  gistMarkdownTemplate: GIST_MD_TEMPLATE,
};

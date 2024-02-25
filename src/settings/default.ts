import {TFile} from 'obsidian';

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
}

export const DEFAULT_SETTINGS: LivecodesSettings = {
  playgroundFolder: "playgrounds",
  notesFolder: "playgrounds/notes",
  autoWatch: true,
  appUrl: "https://v24.livecodes.io/",
  shortUrl: false,
  fontFamily: "Default",
  fontSize: "12",
  editor: "monaco",
  lineNumbers: true,
  darkTheme: true,
  useTabs: false,
  tabSize: "2",
  closeBrackets: true,
  semicolons: true,
  singleQuote: false,
  trailingComma: true,
  wordWrap: false,
  enableAI: false,
  autoUpdate: true,
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
  githubGistPublic: false
};

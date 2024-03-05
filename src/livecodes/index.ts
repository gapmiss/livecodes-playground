export const ALLOWED_LANGS = ["html","mdx","css","scss","javascript","jsx","typescript","tsx","astro","svelte"];
export const ALLOWED_EXTS = ["html","mdx","css","scss","js","jsx","ts","tsx","astro","svelte"];

export function codeLanguages() {
  const lists = {
    markup: [
      { name: 'art-template', title: 'art-template' },
      { name: 'asciidoc', title: 'AsciiDoc' },
      { name: 'astro', title: 'Astro' },
      { name: 'diagrams', title: 'Diagrams' },
      { name: 'dot', title: 'doT' },
      { name: 'ejs', title: 'EJS' },
      { name: 'eta', title: 'Eta' },
      { name: 'haml', title: 'Haml' },
      { name: 'handlebars', title: 'Handlebars' },
      { name: 'html', title: 'HTML' },
      { name: 'liquid', title: 'Liquid' },
      { name: 'markdown', title: 'Markdown' },
      { name: 'mdx', title: 'MDX' },
      { name: 'mjml', title: 'MJML' },
      { name: 'mustache', title: 'Mustache' },
      { name: 'nunjucks', title: 'Nunjucks' },
      { name: 'pug', title: 'Pug' },
      { name: 'richtext', title: 'Rich Text' },
      { name: 'twig', title: 'Twig' },
    ],
    style: [
      { name: 'css', title: 'CSS' },
      { name: 'less', title: 'Less' },
      { name: 'scss', title: 'SCSS' },
      { name: 'stylis', title: 'Stylis' },
      { name: 'stylus', title: 'Stylus' },
      { name: 'tailwindcss', title: 'Tailwind CSS', processor: true },
      { name: 'windicss', title: 'Windi CSS', processor: true },
      { name: 'unocss', title: 'UnoCSS', processor: true },
      { name: 'lightningcss', title: 'Lightning CSS', processor: true },
    ],
    script: [
      { name: 'assemblyscript', title: 'AssemblyScript' },
      { name: 'babel', title: 'Babel' },
      { name: 'blockly', title: 'Blockly' },
      { name: 'civet', title: 'Civet' },
      { name: 'clio', title: 'Clio' },
      { name: 'clojurescript', title: 'CLJS' },
      { name: 'coffeescript', title: 'CoffeeScript' },
      { name: 'commonlisp', title: 'Lisp' },
      { name: 'cpp', title: 'C++' },
      { name: 'cpp-wasm', title: 'C++ (Wasm)' },
      { name: 'fennel', title: 'Fennel' },
      { name: 'flow', title: 'Flow' },
      { name: 'go', title: 'Go' },
      { name: 'imba', title: 'Imba' },
      { name: 'javascript', title: 'JS' },
      { name: 'jsx', title: 'JSX' },
      { name: 'julia', title: 'Julia' },
      { name: 'livescript', title: 'LiveScript' },
      { name: 'lua', title: 'Lua' },
      { name: 'lua-wasm', title: 'Lua (Wasm)' },
      { name: 'malina', title: 'Malina.js' },
      { name: 'ocaml', title: 'OCaml' },
      { name: 'perl', title: 'Perl' },
      { name: 'php', title: 'PHP' },
      { name: 'php-wasm', title: 'PHP (Wasm)' },
      { name: 'prolog', title: 'Prolog' },
      { name: 'python', title: 'Python' },
      { name: 'python-wasm', title: 'Python (Wasm)' },
      { name: 'r', title: 'R' },
      { name: 'react-native', title: 'React Native' },
      { name: 'react-native-tsx', title: 'React Native (TSX)' },
      { name: 'reason', title: 'Reason' },
      { name: 'rescript', title: 'ReScript' },
      { name: 'riot', title: 'Riot.js' },
      { name: 'ruby', title: 'Ruby' },
      { name: 'ruby-wasm', title: 'Ruby (Wasm)' },
      { name: 'scheme', title: 'Scheme' },
      { name: 'solid', title: 'Solid' },
      { name: 'solid.tsx', title: 'Solid (TS)' },
      { name: 'sql', title: 'SQL' },
      { name: 'stencil', title: 'Stencil' },
      { name: 'sucrase', title: 'Sucrase' },
      { name: 'svelte', title: 'Svelte' },
      { name: 'tcl', title: 'Tcl' },
      { name: 'teal', title: 'Teal' },
      { name: 'tsx', title: 'TSX' },
      { name: 'typescript', title: 'Typescript' },
      { name: 'vue', title: 'Vue 3' },
      { name: 'vue2', title: 'Vue 2' },
      { name: 'wat', title: 'WAT' },
    ],
  }
  return lists;
};

export function codeBlockLanguages() {
  const lists = {
    markup: [
      { name: 'asciidoc', title: 'AsciiDoc' },
      { name: 'astro', title: 'Astro' },
      { name: 'ejs', title: 'EJS' },
      { name: 'haml', title: 'Haml' },
      { name: 'handlebars', title: 'Handlebars' },
      { name: 'html', title: 'HTML' },
      { name: 'liquid', title: 'Liquid' },
      { name: 'markdown', title: 'Markdown' },
      { name: 'mdx', title: 'MDX' },
      { name: 'pug', title: 'Pug' },
      { name: 'twig', title: 'Twig' },
    ],
    style: [
      { name: 'css', title: 'CSS' },
      { name: 'less', title: 'Less' },
      { name: 'scss', title: 'SCSS' },
      { name: 'stylus', title: 'Stylus' },
    ],
    script: [
      { name: 'coffeescript', title: 'CoffeeScript' },
      { name: 'cpp', title: 'C++' },
      { name: 'flow', title: 'Flow' },
      { name: 'go', title: 'Go' },
      { name: 'javascript', title: 'JS' },
      { name: 'jsx', title: 'JSX' },
      { name: 'julia', title: 'Julia' },
      { name: 'livescript', title: 'LiveScript' },
      { name: 'lua', title: 'Lua' },
      { name: 'ocaml', title: 'OCaml' },
      { name: 'perl', title: 'Perl' },
      { name: 'php', title: 'PHP' },
      { name: 'prolog', title: 'Prolog' },
      { name: 'python', title: 'Python' },
      { name: 'r', title: 'R' },
      { name: 'reason', title: 'Reason' },
      { name: 'ruby', title: 'Ruby' },
      { name: 'scheme', title: 'Scheme' },
      { name: 'solid', title: 'Solid' },
      { name: 'sql', title: 'SQL' },
      { name: 'svelte', title: 'Svelte' },
      { name: 'tcl', title: 'Tcl' },
      { name: 'tsx', title: 'TSX' },
      { name: 'typescript', title: 'Typescript' },
    ],
  }
  return lists;
};

export const blankPlayground = {
  appUrl: "https://v26.livecodes.io/",
  title: "New Playground",
  description: "",
  head: "<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
  htmlAttrs: "lang=\"en\" class=\"\"",
  tags: '[]',
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
  stylesheets: '[]',
  scripts: '[]',
  cssPreset: "",
  imports: '{}',
  types: '{}',
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
  processors: '[]',
  customSettings: '{}',
  editor: "monaco",
  fontFamily: "Iosevka",
  fontSize: 12,
  useTabs: false,
  tabSize: 2,
  lineNumbers: true,
  wordWrap: false,
  enableAI: false,
  closeBrackets: true,
  semicolons: true,
  singleQuote: false,
  trailingComma: true,
  emmet: true,
  editorTheme: "[]",
  version: "24"
};
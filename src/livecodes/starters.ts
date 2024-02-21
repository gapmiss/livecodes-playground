/**
 * https://github.com/live-codes/livecodes/tree/develop/src/livecodes/templates
 */
export const livecodesStarters = [
  {
    name: 'C++',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"name\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/cpp.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n\n<script>\n  // set initial input\n  livecodes.cpp.input = \"-1\";\n\n  addEventListener('load', async () => {\n    const button = document.querySelector(\"#counter-button\");\n\n    // wait till loaded\n    await livecodes.cpp.loaded;\n\n    // get initial output\n    const initialOutput = livecodes.cpp.output;\n    update(initialOutput);\n\n    button.onclick = async () => {\n      // run with new input\n      const {output, error, exitCode} = await livecodes.cpp.run(window.count);\n      update(output);\n    };\n\n    function update(output) {\n      const counter = document.querySelector(\"#counter\");\n      const name = document.querySelector(\"#name\");\n\n      const [title, count] = output.split('\\n');\n\n      if (parseInt(count) !== NaN) {\n        window.count = count;\n        counter.innerText = window.count;\n      }\n      if (title) {\n        name.innerText = title;\n      }\n    }\n  });\n</script>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'cpp',
      content: "#include <iostream>\nusing namespace std;\n\nint main() {\n    char title[] = \"C++\";\n    cout << title << endl;\n\n    int count;\n    cin >> count;\n    count += 1;\n    cout << count << endl;\n\n    return 0;\n}\n"
    }
  },
  {
    name: 'Lua (wasm)',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/lua.svg\" />\n  <p id=\"counter\">You clicked 0 times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'lua-wasm',
      content: "document = window.document\ndocument:getElementById(\"title\").innerHTML = \"Lua\"\n\nCounter = {count = 0}\nfunction Counter:new (o)\n  o = o or {}\n  setmetatable(o, self)\n  self.__index = self\n  return o\nend\nfunction Counter:increment ()\n  self.count = self.count + 1\nend\nfunction Counter:show ()\n  local counter_el = document:getElementById(\"counter\")\n  counter_el.innerHTML = (\"You clicked %d times.\"):format(self.count)\nend\n\ncounter = Counter:new(nil)\nbutton = document:querySelector(\"#counter-button\")\nbutton:addEventListener(\"click\", function()\n  counter:increment()\n  counter:show()\nend)\n\n-- check console\ntime = os.date(\"*t\").hour\nif time < 12 then\n  print (\"Good morning\")\nelseif time >= 12 and time < 18 then\n  print (\"Good afternoon\")\nelse\n  print (\"Good evening\")\nend\n"
    }
  },
  {
    name: 'Lua',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/lua.svg\" />\n  <p id=\"counter\">You clicked 0 times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'lua',
      content: "js = require \"js\"\nwindow = js.global\ndocument = window.document\n\ndocument:getElementById(\"title\").innerHTML = \"Lua\"\n\nCounter = {count = 0}\nfunction Counter:new (o)\n  o = o or {}\n  setmetatable(o, self)\n  self.__index = self\n  return o\nend\nfunction Counter:increment ()\n  self.count = self.count + 1\nend\nfunction Counter:show ()\n  local counter_el = document:getElementById(\"counter\")\n  counter_el.innerHTML = (\"You clicked %d times.\"):format(self.count)\nend\n\ncounter = Counter:new(nil)\nbutton = document:querySelector(\"#counter-button\")\nbutton:addEventListener(\"click\", function()\n  counter:increment()\n  counter:show()\nend)\n\n-- check console\ntime = os.date(\"*t\").hour\nif time < 12 then\n  print (\"Good morning\")\nelseif time >= 12 and time < 18 then\n  print (\"Good afternoon\")\nelse\n  print (\"Good evening\")\nend\n"
    }
  },
  {
    name: 'Perl',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/perl.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'perl',
      content: "use strict;\n\nmy $title = 'Perl';\nJS::inline('document.getElementById(\"title\").innerHTML') = $title;\n\n{\npackage Counter;\n  sub new {\n    my $class = shift;\n    my $self = {count => 0};\n    return bless $self, $class;\n  }\n  sub count {\n    my $self = shift;\n    return $self->{count};\n  }\n  sub increment {\n    my $self = shift;\n    $self->{count}++;\n  }\n}\n\nmy $counter = Counter->new;\n\nsub onClick {\n    $counter->increment;\n    JS::inline('document.getElementById(\"counter\").innerHTML') =\n    $counter->count;\n}\n\nJS::inline('document.getElementById(\"counter-button\").onclick') = \\&onClick;\n\n# check console\nmy ($sec,$min,$hour) = localtime(time);\nif ($hour < 12) {\n  print \"Good morning\";\n} elsif ($hour >= 12 && $hour < 18) {\n  print \"Good afternoon\";\n} else {\n  print \"Good evening\";\n}\n"
    }
  },
  {
    name: 'PHP (wasm)',
    markup: {
      language: 'html',
      content: "<p>\n  <h1>Hello, <span id=\"title\">world</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/php.svg\" />\n</p>\n"
    },
    style: {
      language: 'css',
      content: "body {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'php-wasm',
      content: "<?php\n$title = 'PHP';\nvrzno_eval('document.getElementById(\"title\").innerText = \"' . $title . '\"');\n\n$time = date('H');\nif ($time < 12) {\n  $greeting = 'Good morning!';\n} elseif ($time < 17) {\n  $greeting = 'Good afternoon!';\n} elseif ($time < 20) {\n  $greeting = 'Good evening!';\n} else {\n  $greeting = 'Good night!';\n}\n\n$date = date('l jS \\of F, Y');\n\necho $greeting . '<br>Today is:<br>' . $date;\n"
    }
  },
  {
    name: 'PHP',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">world</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/php.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'php',
      content: "<?php\n$title = 'PHP';\n$document->getElementById('title')->innerText = $title;\n\n$count = 0;\n\n$document\n  ->getElementById('counter-button')\n  ->addEventListener('click', function () use (&$count, $document) {\n      $count += 1;\n      $document->getElementById('counter')->innerText = $count;\n      echo \"count: $count\";\n  });\n"
    }
  },
  {
    name: 'Ruby',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/ruby.svg\" />\n  <p id=\"counter\">You clicked 0 times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'ruby',
      content: "require \"date\"\nrequire \"native\"\n\ntitle = \"Ruby\"\n$$.document.querySelector(\"#title\").innerHTML = title\n\n$counter = 0\n$counter_element = $$.document.querySelector \"#counter\"\n\ndef increment\n    $counter += 1\n    $counter_element.innerHTML = \"You clicked %d times.\" % [$counter]\nend\n\nbutton = $$.document.querySelector \"button\"\nbutton.onclick = -> {increment}\n\n# check console\ncurrent_time = Time.now.hour\nmsg = Date.today.strftime \"happy %A!\"\nif current_time < 12\n    puts \"Good morning, \" + msg\nelsif current_time < 18\n    puts \"Good afternoon, \" + msg\nelse\n    puts \"Good evening, \" + msg\nend\n"
    }
  },
  {
    name: 'Python (wasm)',
    markup: {
      language: 'html',
      content: "<h1 id=\"title\">Hello, World!</h1>\n<div id=\"plot\">Loading...</div>\n"
    },
    style: {
      language: 'css',
      content: "h1 {\n  text-align: center;\n}\n"
    },
    script: {
      language: 'python-wasm',
      content: "from js import document, XMLHttpRequest\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom io import StringIO\n\ndef load_data(url):\n  req = XMLHttpRequest.new()\n  req.open(\"GET\", url, False)\n  req.send()\n  res = req.response\n  return StringIO(f\"\"\"{res}\"\"\")\n\n\ndef prepare_data(dataframe):\n  def add_species_id(x):\n    if x == 'setosa':\n        return 0\n    elif x == 'versicolor':\n        return 1\n    return 2\n\n  df = dataframe.copy()\n  df['species_id'] = df['species'].apply(add_species_id)\n  return df\n\n\ndef showPlot(figure, selector):\n  iconStyles = document.createElement('link')\n  iconStyles.rel = 'stylesheet'\n  iconStyles.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'\n  document.head.appendChild(iconStyles)\n  el = document.querySelector(selector)\n  el.innerHTML = ''\n  document.pyodideMplTarget = el\n  figure.canvas.show()\n\n\ndf = pd.read_csv(load_data(\"https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv\"))\ndf = prepare_data(df)\n\nformatter = plt.FuncFormatter(lambda i, *args: df['species'].unique()[int(i)])\nfig = plt.figure(figsize=(6, 4))\nplt.scatter(df[df.columns[0]], df[df.columns[1]], c=df['species_id'])\nplt.colorbar(ticks=[0, 1, 2], format=formatter)\nplt.xlabel(df.columns[0])\nplt.ylabel(df.columns[1])\nplt.title('Iris dataset')\nplt.tight_layout()\nshowPlot(fig, '#plot')\n\ntitle = document.getElementById('title')\nname = 'Python'\ntitle.innerHTML = f\"Hello, {name}!\"\n"
    }
  },
  {
    name: 'Python',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1 id=\"header\">Hello, World!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/python.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'python',
      content: "from browser import document\nimport time\n\ntitle = 'Python'\ndocument['header'].html = f\"Hello, {title}!\"\n\ncounter = 0\n\ndef increment(ev):\n    global counter\n    counter += 1\n    document['counter'].html = str(counter)\n\ndocument[\"counter-button\"].bind(\"click\", increment)\n\n# check console\ncurrent_time = int(time.strftime('%H'))\nif current_time < 12 :\n      print('Good morning')\nelif 12 <= current_time < 18:\n      print('Good afternoon')\nelse:\n      print('Good evening')\n"
    }
  },
  {
    name: 'Markdown',
    markup: {
      language: 'markdown',
      content: "# Project Title\n\nOne Paragraph of project description goes here\n\n## Getting Started\n\nThese instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.\n\n### Prerequisites\n\nWhat things you need to install the software and how to install them\n\n```\nGive examples\n```\n\n### Installing\n\nA step by step series of examples that tell you how to get a development env running\n\nSay what the step will be\n\n```\nGive the example\n```\n\nAnd repeat\n\n```\nuntil finished\n```\n\nEnd with an example of getting some data out of the system or using it for a little demo\n\n## Running the tests\n\nExplain how to run the automated tests for this system\n\n### Break down into end to end tests\n\nExplain what these tests test and why\n\n```\nGive an example\n```\n\n### And coding style tests\n\nExplain what these tests test and why\n\n```\nGive an example\n```\n\n## Deployment\n\nAdd additional notes about how to deploy this on a live system\n\n## Built With\n\n* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used\n* [Maven](https://maven.apache.org/) - Dependency Management\n* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds\n\n## Contributing\n\nPlease read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.\n\n## Versioning\n\nWe use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).\n\n## Authors\n\n* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)\n\nSee also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.\n\n## License\n\nThis project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details\n\n## Acknowledgments\n\n* Hat tip to anyone whose code was used\n* Inspiration\n* etc\n\n\nSource: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2\n"
    },
    style: {
      language: 'css',
      content: "@import \"github-markdown-css\";\n\nbody {\n  border: 1px solid #e1e4e8;\n  border-radius: 6px;\n  padding: 20px;\n  margin: 20px !important;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "document.body.classList.add('markdown-body');\n"
    }
  },
  {
    name: 'Tailwind CSS',
    markup: {
      language: 'html',
      content: "<div class=\"min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12\">\n  <div class=\"relative py-3 sm:max-w-xl sm:mx-auto\">\n    <div class=\"back-card\"></div>\n    <div class=\"relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20\">\n      <div class=\"max-w-md mx-auto\">\n        <div>\n          <img src=\"https://v24.livecodes.io/livecodes/assets/templates/tailwindplay.svg\" class=\"h-7 sm:h-8\" />\n        </div>\n        <div class=\"divide-y divide-gray-200\">\n          <div class=\"py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7\">\n            <p class=\"prose md:prose-xl\">A template based on <a href=\"https://play.tailwindcss.com/\" class=\"text-cyan-600 hover:text-cyan-700\" target=\"_blank\">Tailwind CSS playground</a>. Here you can do things like:</p>\n            <ul class=\"list-disc space-y-2\">\n              <li class=\"flex items-start\">\n                <span class=\"h-6 flex items-center sm:h-7\">\n                  <svg class=\"flex-shrink-0 h-5 w-5 text-cyan-500\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                    <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\" />\n                  </svg>\n                </span>\n                <p class=\"ml-2\">\n                  Customizing configuration in\n                  <code class=\"text-sm font-bold text-gray-900\">menu → Custom Settings</code>\n                </p>\n              </li>\n              <li class=\"flex items-start\">\n                <span class=\"h-6 flex items-center sm:h-7\">\n                  <svg class=\"flex-shrink-0 h-5 w-5 text-cyan-500\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                    <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\" />\n                  </svg>\n                </span>\n                <p class=\"ml-2\">\n                  Extracting classes with\n                  <code class=\"text-sm font-bold text-gray-900\">@apply</code>\n                </p>\n              </li>\n              <li class=\"flex items-start\">\n                <span class=\"h-6 flex items-center sm:h-7\">\n                  <svg class=\"flex-shrink-0 h-5 w-5 text-cyan-500\" viewBox=\"0 0 20 20\" fill=\"currentColor\">\n                    <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\" />\n                  </svg>\n                </span>\n                <p class=\"ml-2\">Viewing generated CSS code (in <code class=\"text-sm font-bold text-gray-900\">Compiled</code> pane below)</p>\n              </li>\n            </ul>\n            <p>Perfect for learning how the framework works, prototyping a new idea, or creating a demo to share online.</p>\n          </div>\n          <div class=\"pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7\">\n            <p>Want to dig deeper into Tailwind?</p>\n            <p>\n              <a href=\"https://tailwindcss.com/docs\" class=\"text-cyan-600 hover:text-cyan-700\" target=\"_blank\"> Read the docs &rarr; </a>\n            </p>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"
    },
    style: {
      language: 'css',
      content: "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n.back-card {\n  @apply absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl;\n}\n"
    },
    script: {
      language: 'javascript',
      content: ""
    },
    processors: [
      "tailwindcss"
    ]
  },
  {
    name: 'Bootstrap 5',
    markup: {
      language: 'html',
      content: "<nav class=\"navbar navbar-expand-md navbar-dark bg-dark fixed-top\">\n  <div class=\"container-fluid\">\n    <a class=\"navbar-brand\" href=\"#\">Navbar</a>\n    <button\n      class=\"navbar-toggler\"\n      type=\"button\"\n      data-bs-toggle=\"collapse\"\n      data-bs-target=\"#navbarsExampleDefault\"\n      aria-controls=\"navbarsExampleDefault\"\n      aria-expanded=\"false\"\n      aria-label=\"Toggle navigation\"\n    >\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n\n    <div class=\"collapse navbar-collapse\" id=\"navbarsExampleDefault\">\n      <ul class=\"navbar-nav me-auto mb-2 mb-md-0\">\n        <li class=\"nav-item active\">\n          <a class=\"nav-link\" aria-current=\"page\" href=\"#\">Home</a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link\" href=\"#\">Link</a>\n        </li>\n        <li class=\"nav-item\">\n          <a\n            class=\"nav-link disabled\"\n            href=\"#\"\n            tabindex=\"-1\"\n            aria-disabled=\"true\"\n            >Disabled</a\n          >\n        </li>\n        <li class=\"nav-item dropdown\">\n          <a\n            class=\"nav-link dropdown-toggle\"\n            href=\"#\"\n            id=\"dropdown01\"\n            data-bs-toggle=\"dropdown\"\n            aria-expanded=\"false\"\n            >Dropdown</a\n          >\n          <ul class=\"dropdown-menu\" aria-labelledby=\"dropdown01\">\n            <li><a class=\"dropdown-item\" href=\"#\">Action</a></li>\n            <li><a class=\"dropdown-item\" href=\"#\">Another action</a></li>\n            <li><a class=\"dropdown-item\" href=\"#\">Something else here</a></li>\n          </ul>\n        </li>\n      </ul>\n      <form class=\"d-flex\">\n        <input\n          class=\"form-control me-2\"\n          type=\"search\"\n          placeholder=\"Search\"\n          aria-label=\"Search\"\n        />\n        <button class=\"btn btn-outline-success\" type=\"submit\">Search</button>\n      </form>\n    </div>\n  </div>\n</nav>\n\n<main class=\"container\">\n  <div class=\"starter-template text-center py-5 px-3\">\n    <h1>Bootstrap starter template</h1>\n    <p class=\"lead\">\n      Use this document as a way to quickly start any new project.<br />\n      All you get is this text and a mostly barebones HTML document.\n    </p>\n  </div>\n</main>\n"
    },
    style: {
      language: 'css',
      content: "body {\n  padding-top: 5rem;\n}\n\n.bd-placeholder-img {\n  font-size: 1.125rem;\n  text-anchor: middle;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n}\n\n@media (min-width: 768px) {\n  .bd-placeholder-img-lg {\n    font-size: 3.5rem;\n  }\n}\n"
    },
    stylesheets: [
      "https://fastly.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    ],
    scripts: [
      "https://fastly.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
    ]
  },
  {
    name: 'jQuery',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/jquery.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 300px;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "import $ from \"jquery\";\n\n$(\"#title\").text('jQuery');\n\nlet count = 0;\n$(\"#counter-button\").click(() => {\n  count += 1;\n  $(\"#counter\").text(count);\n});\n"
    }
  },
  {
    name: 'Riot.js',
    markup: {
      language: 'html',
      content: "<counter title=\"Riot.js\"></counter>\n\n<script>\n  livecodes.templateData = {\n    url: 'https://riot.js.org/'\n  }\n</script>\n"
    },
    script: {
      language: 'riot',
      content: "<counter>\n  <div class=\"container\">\n    <h1>Hello, { props.title }!</h1>\n    <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/riot.svg\" />\n    <p>You clicked { state.count } times.</p>\n    <button onclick=\"{ increment }\">Click me</button>\n    <div class=\"footer\">\n      <a href=\"{ props.url }\" target=\"_blank\">Riot.js Website</a>\n    </div>\n  </div>\n\n  <style>\n    .container,\n    .container button {\n      text-align: center;\n      font: 1em sans-serif;\n    }\n    .logo {\n      width: 150px;\n    }\n    .footer {\n      font: 0.8em sans-serif;\n      margin: 1.5em;\n    }\n  </style>\n\n  <script>\n    export default {\n      onBeforeMount(props, state) {\n        this.state = {\n          count: 0,\n        };\n      },\n      increment(e) {\n        e.preventDefault();\n        this.update({\n          count: this.state.count + 1,\n        });\n      },\n    };\n  </script>\n</counter>\n"
    }
  },
  {
    name: 'Astro',
    markup: {
      language: 'astro',
      content: "---\nimport {format} from 'date-fns';\n\nconst title = \"Astro\";\n\nconst builtAt: Date = new Date();\nconst builtAtFormatted = format(builtAt, 'MMMM dd, yyyy -- H:mm:ss.SSS');\n---\n<html lang=\"en\">\n\n<head>\n\t<meta charset=\"utf-8\" />\n\t<meta name=\"viewport\" content=\"width=device-width\" />\n\t<title>Welcome to Astro</title>\n  <style>\n    .container,\n    .container button {\n      text-align: center;\n      font: 1em sans-serif;\n    }\n    .logo {\n      width: 150px;\n    }\n    .note {\n      margin: 1rem;\n      padding: 1rem;\n      border-radius: 8px;\n      background: #E4E5E6;\n      border: 1px solid #BBB;\n    }\n  </style>\n</head>\n\n<body>\n  <div class=\"container\">\n    <h1>Hello, {title}!</h1>\n    <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/astro.svg\" />\n    <p>You clicked <span id=\"counter\">0</span> times.</p>\n    <button id=\"counter-button\">Click me</button>\n    <p class=\"note\">\n      <strong>RENDERED AT:</strong><br/>\n      {builtAtFormatted}\n    </p>\n  </div>\n  <script>\n    let count = 0\n    document\n      .querySelector(\"#counter-button\")\n      .addEventListener(\"click\", () => {\n        count += 1;\n        document.querySelector(\"#counter\").innerText = count;\n    });\n  </script>\n</body>\n\n</html>\n"
    }
  },
  {
    name: 'MDX',
    activeEditor: 'markup',
    markup: {
      language: 'mdx',
      content: "import { Greeting, Counter } from './script';\n\n<Greeting name=\"MDX\" />\n\n![MDX Logo](https://v24.livecodes.io/livecodes/assets/templates/mdx.svg)\n\n<Counter />\n"
    },
    style: {
      language: 'css',
      content: "body,\nbody button {\n  text-align: center;\n  font: 1em sans-serif;\n}\nimg {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'jsx',
      content: "import { useState } from \"https://esm.sh/react\";\n\nexport const Greeting = (props) => <h1>Hello, {props.name || \"World\"}!</h1>;\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>You clicked {count} times.</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n"
    }
  },
  {
    name: 'Stencil.js',
    markup: {
      language: 'html',
      content: "<my-app title=\"Stencil\"></my-app>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 100px;\n}\n"
    },
    script: {
      language: 'stencil',
      content: "import { Component, Prop, h, State } from \"@stencil/core\";\n\n@Component({\n  tag: \"my-app\",\n  styles: `\n    my-app,\n    button {\n      text-align: center;\n      font: 1em sans-serif;\n    }\n    .logo {\n      width: 150px;\n    }\n  `,\n})\nexport class App {\n  @Prop() title: string;\n  @State() count = 0;\n\n  increment = () => {\n    this.count += 1;\n  };\n\n  render() {\n    return (\n      <div class=\"container\">\n        <h1>Hello, {this.title}!</h1>\n        <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/stencil.png\" />\n        <p>You clicked {this.count} times.</p>\n        <button onClick={this.increment}>Click me</button>\n      </div>\n    );\n  }\n}\n"
    }
  },
  {
    name: 'Lit',
    markup: {
      language: 'html',
      content: "<!-- src: -->\n\n<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://lit.dev/images/logo.svg\" />\n  <custom-counter></custom-counter>\n</div>\n\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 200px;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@0.7.1/lit-element.js?module';\n\nclass Counter extends LitElement {\n  static get properties() {\n    return {\n      count: { type: Number },\n    };\n  }\n\n  constructor() {\n    super();\n    this.count = 0;\n  }\n\n  setCount = count => {\n    this.count = count;\n  };\n\n  render() {\n    const { count } = this;\n    return html`\n      <p>You clicked <span id=\"counter\">${count}</span> times.</p>\n      <button id=\"counter-button\" @click=${() => this.setCount(count + 1)}>Click me</button>\n    `;\n  }\n}\n\ncustomElements.define('custom-counter', Counter);\n"
    }
  },
  {
    name: 'Solid.js',
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'solid.tsx',
      content: "import { createSignal } from \"https://esm.sh/solid-js\";\n\nfunction Counter(props: { name: string }) {\n  const [count, setCount] = createSignal(0);\n  const increment = () => setCount(count() + 1);\n  return (\n    <div className=\"container\">\n      <h1>Hello, {props.name}!</h1>\n      <img className=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/solid.svg\" />\n      <p>You clicked {count()} times.</p>\n      <button onClick={increment}>Click me</button>\n    </div>\n  );\n}\n\nexport default function App() {\n  return <Counter name=\"Solid\" />;\n}\n"
    }
  },
  {
    name: 'Svelte',
    activeEditor: 'script',
    script: {
      language: 'svelte',
      content: "<script>\n  let title = \"Svelte\";\n  let counter = 0;\n  function increment() {\n    counter += 1;\n  }\n</script>\n\n<style>\n  .container,\n  .container button {\n    text-align: center;\n    font: 1em sans-serif;\n  }\n  .logo {\n    width: 150px;\n  }\n</style>\n\n<div class=\"container\">\n  <h1>Hello, {title}!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/svelte.svg\" />\n  <p>You clicked {counter} times.</p>\n  <button on:click=\"{increment}\">Click me</button>\n</div>\n"
    }
  },
  {
    name: 'Angular',
    markup: {
      language: 'html',
      content: '<app>Loading...</app>\n',
    },
    style: {
      language: 'css',
      content: '',
    },
    script: {
      language: 'typescript',
      content: 'import {\n  Component,\n  Input,\n  NgModule,\n  enableProdMode,\n} from "@angular/core@12.2.13";\nimport { CommonModule } from "@angular/common@12.2.13";\nimport { BrowserModule } from "@angular/platform-browser@12.2.13";\nimport { platformBrowserDynamic } from "@angular/platform-browser-dynamic@12.2.13";\nimport "zone.js";\n\n// app.component.ts\n@Component({\n  selector: "app",\n  styles: [\n    `\n    .container,\n    .container button {\n      text-align: center;\n      font: 1em sans-serif;\n    }\n    .logo {\n      width: 150px;\n    }\n    `,\n  ],\n  template: `\n    <div class="container">\n      <heading name="{{name}}"></heading>\n      <img\n        class="logo"\n        alt="logo"\n        src="https://livecodes.io/livecodes/assets/templates/angular.svg"\n      />\n      <p>You clicked {{count}} times.</p>\n      <button type="button" (click)="increment()">Click me</button>\n    </div>\n  `,\n})\nclass AppComponent {\n  count = 0;\n  name = "Angular";\n\n  constructor() {}\n\n  increment() {\n    this.count += 1;\n  }\n}\n\n// heading.component.ts\n@Component({\n  selector: "heading",\n  template: "<h1>{{title}}</h1>",\n})\nclass HeadingComponent {\n  @Input() name: string;\n  title: string;\n\n  ngOnInit() {\n    this.title = `Hello, ${this.name}!`;\n  }\n}\n\n// app.module.ts\n@NgModule({\n  imports: [BrowserModule, CommonModule],\n  declarations: [AppComponent, HeadingComponent],\n  bootstrap: [AppComponent],\n  providers: [],\n})\nclass AppModule {}\n\n// main.ts\n// enableProdMode();\nplatformBrowserDynamic()\n  .bootstrapModule(AppModule)\n  .catch((err: Error) => console.error(err));',
    },
    customSettings: {
      typescript: {
        experimentalDecorators: true,
      },
    },
    activeEditor: 'script',
  },
  {
    name: 'Vue 2',
    markup: {
      language: 'html',
      content: "<div id=\"app\">\n  <h1>Hello, Vue!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/vue.svg\" />\n  <p>You clicked {{ counter }} times.</p>\n  <button @click=\"increment()\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: "#app,\n#app button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "new Vue({\n  el: \"#app\",\n  data: {\n    counter: 0,\n  },\n  methods: {\n    increment() {\n      this.counter += 1;\n    },\n  },\n});\n"
    },
    scripts: [
      "https://fastly.jsdelivr.net/npm/vue@2"
    ]
  },
  {
    name: 'Vue 3 SFC',
    script: {
      language: 'vue',
      content: "<script setup lang=\"tsx\">\n  import { ref } from 'vue';\n\n  const name = 'Vue';\n  const count = ref(0);\n  const align = 'center';\n\n  // define inline component\n  function Greeting(props: {name: string}) {\n    return <h1>Hello, { props.name }!</h1>\n  }\n</script>\n\n<template>\n  <div class=\"container\">\n    <Greeting :name=\"name\" />\n    <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/vue.svg\" />\n    <p>You clicked {{ count }} times.</p>\n    <button @click=\"count++\">Click me</button>\n  </div>\n</template>\n\n<style scoped>\n  .container,\n  .container button {\n    text-align: v-bind(\"align\");\n    font: 1em sans-serif;\n  }\n  .logo {\n    width: 150px;\n  }\n</style>\n"
    }
  },
  {
    name: 'React Native',
    script: {
      language: 'react-native',
      content: "import { useState } from \"react\";\nimport { Button, Image, StyleSheet, Text, View } from \"react-native\";\n\nconst logoUri = `data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 841.9 595.3\"><g fill=\"#61DAFB\"><path d=\"M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z\" /><circle cx=\"420.9\" cy=\"296.5\" r=\"45.7\" /><path d=\"M520.5 78.1z\" /></g></svg>`;\n\nfunction Link(props) {\n  return (\n    <Text\n      {...props}\n      accessibilityRole=\"link\"\n      style={StyleSheet.compose(styles.link, props.style)}\n    />\n  );\n}\n\nfunction Counter(props) {\n  const [count, setCount] = useState(props.initialCount);\n  return (\n    <View>\n      <Text style={styles.text}>You clicked {count} times.</Text>\n      <Button onPress={() => setCount(count + 1)} title=\"Click me\" />\n    </View>\n  );\n}\n\nexport default function App() {\n  return (\n    <View style={styles.app}>\n      <View style={styles.header}>\n        <Image\n          accessibilityLabel=\"React logo\"\n          source={{ uri: logoUri }}\n          resizeMode=\"contain\"\n          style={styles.logo}\n        />\n        <Text style={styles.title}>React Native for Web</Text>\n      </View>\n      <Text style={styles.text}>\n        This is an example app built with{\" \"}\n        <Link href=\"https://necolas.github.io/react-native-web/\">\n          React Native for Web\n        </Link>\n      </Text>\n      <Counter initialCount={0}></Counter>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  app: {\n    marginHorizontal: \"auto\",\n    marginVertical: 20,\n    maxWidth: 500,\n  },\n  logo: {\n    height: 150,\n  },\n  header: {\n    padding: 20,\n  },\n  title: {\n    fontWeight: \"bold\",\n    fontSize: \"1.5rem\",\n    marginVertical: \"0.5em\",\n    textAlign: \"center\",\n  },\n  text: {\n    lineHeight: \"1.5em\",\n    fontSize: \"1.125rem\",\n    marginVertical: \"0.5em\",\n    textAlign: \"center\",\n  },\n  link: {\n    color: \"#1B95E0\",\n  },\n});\n"
    }
  },
  {
    name: 'React',
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'jsx',
      content: "import { useState } from \"https://esm.sh/react\"\n\nfunction Counter(props) {\n  const [count, setCount] = useState(0);\n  return (\n    <div className=\"container\">\n      <h1>Hello, {props.name}!</h1>\n      <img className=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/react.svg\" />\n      <p>You clicked {count} times.</p>\n      <button onClick={() => setCount(count + 1)}>Click me</button>\n    </div>\n  );\n}\n\nexport default function App() {\n  return <Counter name=\"React\" />;\n}\n"
    }
  },
  {
    name: 'Typescript',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/typescript.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'typescript',
      content: "class Counter {\n  private count: number;\n  constructor() {\n    this.count = 0;\n  }\n  increment() {\n    this.count += 1;\n  }\n  getValue() {\n    return this.count;\n  }\n}\n\nconst title = document.querySelector<HTMLElement>(\"#title\");\nconst count = document.querySelector<HTMLElement>(\"#counter\");\nconst button = document.querySelector<HTMLElement>(\"#counter-button\");\n\ntitle.innerText = \"TypeScript\";\nconst counter = new Counter();\nbutton.addEventListener(\n  \"click\",\n  () => {\n    counter.increment();\n    count.innerText = String(counter.getValue());\n  },\n  false\n);\n"
    }
  },
  {
    name: 'Javascript',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://v24.livecodes.io/livecodes/assets/templates/javascript.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n  <button id=\"counter-button\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "const title = document.querySelector(\"#title\");\nconst counter = document.querySelector(\"#counter\");\nconst button = document.querySelector(\"#counter-button\");\n\ntitle.innerText = \"JavaScript\";\nlet count = 0;\n\nbutton.addEventListener(\"click\", () => {\n  count++;\n  counter.innerText = count;\n});\n"
    }
  },
  {
    name: '_hyperscript',
    markup: {
      language: 'html',
      content: "<!-- https://htmx.org/docs/#creating-demos -->\n<script src=\"https://unpkg.com/hyperscript.org@0.9.11\"></script>\n\n<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://hyperscript.org/img/transparent_logo.png\" />\n  <p>You clicked <span id=\"result\">0</span> times.</p>\n  <button _=\"on click increment :x then put it into #result\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 200px;\n}\n"
    },
  },
  {
    name: 'HTMX',
    markup: {
      language: 'html',
      content: "<!-- https://htmx.org/docs/#creating-demos -->\n<script src=\"https://demo.htmx.org\"></script>\n\n<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://bigsky.software/img/htmx.png\" />\n  <p>You clicked <output id=\"result\">0</output> times.</p>\n  <!-- post to /foo -->\n  <button hx-post=\"/foo\" hx-target=\"#result\">Click me</button>\n</div>\n\n<!-- respond to /foo with some dynamic content in a template tag -->\n<script>\n  globalInt = 1;\n</script>\n\n<!-- note the url and delay attributes -->\n<template url=\"/foo\" delay=\"250\">\n  ${globalInt++}\n</template>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 200px;\n}\n"
    }
  },
  {
    name: 'VanJS',
    activeEditor: 'script',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://vanjs.org/logo.svg\" />\n  <p>You clicked <span id=\"counter\">0</span> times.</p>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 150px;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "// https://vanjs.org/tutorial#state\n// derived from: https://jsfiddle.net/gh/get/library/pure/vanjs-org/vanjs-org.github.io/tree/master/jsfiddle/tutorial/state\nimport van from \"https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.8.min.js\"\n\nconst {button} = van.tags\n\n// Create a new state object with init value 0\nconst counter = van.state(0)\n\n// Log whenever the value of the state is updated\nvan.derive(() => document.querySelector(\"#counter\").innerText = counter.val)\n\n// Button to increment the value of the state\nconst incrementBtn = button({id: \"counter-button\", onclick: () => ++counter.val}, \"Click me\")\n\nvan.add(document.querySelector(\".container\"), incrementBtn)\n"
    },
  },
  {
    name: 'Open-props (CSS)',
    activeEditor: 'style',
    markup: {
      language: 'html',
      content: "<!-- src: https://codepen.io/argyleink/pen/XWaYyWe -->\n\n<header>\n  <h3>Scheme</h3>\n  <form id=\"theme-switcher\">\n    <div>\n      <input checked type=\"radio\" id=\"auto\" name=\"theme\" value=\"auto\" />\n      <label for=\"auto\">Auto</label>\n    </div>\n    <div>\n      <input type=\"radio\" id=\"light\" name=\"theme\" value=\"light\" />\n      <label for=\"light\">Light</label>\n    </div>\n    <div>\n      <input type=\"radio\" id=\"dark\" name=\"theme\" value=\"dark\" />\n      <label for=\"dark\">Dark</label>\n    </div>\n    <div>\n      <input type=\"radio\" id=\"dim\" name=\"theme\" value=\"dim\" />\n      <label for=\"dim\">Dim</label>\n    </div>\n    <div>\n      <input type=\"radio\" id=\"grape\" name=\"theme\" value=\"grape\" />\n      <label for=\"grape\">Grape</label>\n    </div>\n    <div>\n      <input type=\"radio\" id=\"choco\" name=\"theme\" value=\"choco\" />\n      <label for=\"choco\">Choco</label>\n    </div>\n  </form>\n</header>\n\n<main>\n  <section>\n    <div class=\"surface-samples\">\n      <div class=\"surface-1 rad-shadow\">1</div>\n      <div class=\"surface-2 rad-shadow\">2</div>\n      <div class=\"surface-3 rad-shadow\">3</div>\n      <div class=\"surface-4 rad-shadow\">4</div>\n    </div>\n  </section>\n\n  <section>\n    <div class=\"text-samples\">\n      <h1 class=\"text-1\">\n        <span class=\"swatch brand rad-shadow\"></span>\n        Brand\n      </h1>\n      <h1 class=\"text-1\">\n        <span class=\"swatch text-1 rad-shadow\"></span>\n        Text Color 1\n      </h1>\n      <h1 class=\"text-2\">\n        <span class=\"swatch text-2 rad-shadow\"></span>\n        Text Color 2\n      </h1>\n      <br />\n      <p class=\"text-1\">\n        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod\n        tempor incididunt ut labore et dolore magna aliqua.\n      </p>\n      <p class=\"text-2\">\n        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi\n        ut aliquip ex ea commodo consequat.\n      </p>\n    </div>\n  </section>\n</main>\n"
    },
    style: {
      language: 'css',
      content: "@import \"https://unpkg.com/open-props\";\n@import \"https://unpkg.com/open-props/gray-hsl.min.css\";\n@import \"https://unpkg.com/open-props/purple-hsl.min.css\";\n@import \"https://unpkg.com/open-props/choco-hsl.min.css\"; \n\nhtml {\n  /* light */\n  --brand-light: var(--orange-6);\n  --text-1-light: var(--gray-8);\n  --text-2-light: var(--gray-7);\n  --surface-1-light: var(--gray-0);\n  --surface-2-light: var(--gray-1);\n  --surface-3-light: var(--gray-2);\n  --surface-4-light: var(--gray-3);\n  --surface-shadow-light: var(--gray-8-hsl);\n  --shadow-strength-light: 2%;\n\n  /* dark */\n  --brand-dark: var(--orange-3);\n  --text-1-dark: var(--gray-3);\n  --text-2-dark: var(--gray-5);\n  --surface-1-dark: var(--gray-12);\n  --surface-2-dark: var(--gray-11);\n  --surface-3-dark: var(--gray-10);\n  --surface-4-dark: var(--gray-9);\n  --surface-shadow-dark: var(--gray-12-hsl);\n  --shadow-strength-dark: 80%;\n\n  /* dim */\n  --brand-dim: var(--orange-4);\n  --text-1-dim: var(--gray-3);\n  --text-2-dim: var(--gray-4);\n  --surface-1-dim: var(--gray-8);\n  --surface-2-dim: var(--gray-7);\n  --surface-3-dim: var(--gray-6);\n  --surface-4-dim: var(--gray-5);\n  --surface-shadow-dim: var(--gray-9-hsl);\n  --shadow-strength-dim: 20%;\n  \n  /* grape */\n  --brand-grape: var(--purple-5);\n  --text-1-grape: var(--purple-9);\n  --text-2-grape: var(--purple-7);\n  --surface-1-grape: var(--purple-0);\n  --surface-2-grape: var(--purple-1);\n  --surface-3-grape: var(--purple-2);\n  --surface-4-grape: var(--purple-3);\n  --surface-shadow-grape: var(--purple-12-hsl);\n  --shadow-strength-grape: 2%;\n  \n  /* choco */\n  --brand-choco: var(--choco-5);\n  --text-1-choco: var(--choco-1);\n  --text-2-choco: var(--choco-2);\n  --surface-1-choco: var(--choco-12);\n  --surface-2-choco: var(--choco-11);\n  --surface-3-choco: var(--choco-10);\n  --surface-4-choco: var(--choco-9);\n  --surface-shadow-choco: 25deg 65% 11%;\n  --shadow-strength-choco: 50%;\n}\n\n:root {\n  color-scheme: light;\n\n  /* set defaults */\n  --brand: var(--brand-light);\n  --text-1: var(--text-1-light);\n  --text-2: var(--text-2-light);\n  --surface-1: var(--surface-1-light);\n  --surface-2: var(--surface-2-light);\n  --surface-3: var(--surface-3-light);\n  --surface-4: var(--surface-4-light);\n  --surface-shadow: var(--surface-shadow-light);\n  --shadow-strength: var(--shadow-strength-light);\n}\n\n@media (color-index: 48) {\n  :root {\n    color-scheme: dark;\n\n    --brand: var(--brand-dark);\n    --text-1: var(--text-1-dark);\n    --text-2: var(--text-2-dark);\n    --surface-1: var(--surface-1-dark);\n    --surface-2: var(--surface-2-dark);\n    --surface-3: var(--surface-3-dark);\n    --surface-4: var(--surface-4-dark);\n    --surface-shadow: var(--surface-shadow-dark);\n    --shadow-strength: var(--shadow-strength-dark);\n  }\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    color-scheme: dark;\n\n    --brand: var(--brand-dark);\n    --text-1: var(--text-1-dark);\n    --text-2: var(--text-2-dark);\n    --surface-1: var(--surface-1-dark);\n    --surface-2: var(--surface-2-dark);\n    --surface-3: var(--surface-3-dark);\n    --surface-4: var(--surface-4-dark);\n    --surface-shadow: var(--surface-shadow-dark);\n    --shadow-strength: var(--shadow-strength-dark);\n  }\n}\n\n[color-scheme=\"light\"] {\n  color-scheme: light;\n\n  --brand: var(--brand-light);\n  --text-1: var(--text-1-light);\n  --text-2: var(--text-2-light);\n  --surface-1: var(--surface-1-light);\n  --surface-2: var(--surface-2-light);\n  --surface-3: var(--surface-3-light);\n  --surface-4: var(--surface-4-light);\n  --surface-shadow: var(--surface-shadow-light);\n  --shadow-strength: var(--shadow-strength-light);\n}\n\n[color-scheme=\"dark\"] {\n  color-scheme: dark;\n  \n  --brand: var(--brand-dark);\n  --text-1: var(--text-1-dark);\n  --text-2: var(--text-2-dark);\n  --surface-1: var(--surface-1-dark);\n  --surface-2: var(--surface-2-dark);\n  --surface-3: var(--surface-3-dark);\n  --surface-4: var(--surface-4-dark);\n  --surface-shadow: var(--surface-shadow-dark);\n  --shadow-strength: var(--shadow-strength-dark);\n}\n\n[color-scheme=\"dim\"] {\n  color-scheme: dark;\n\n  --brand: var(--brand-dim);\n  --text-1: var(--text-1-dim);\n  --text-2: var(--text-2-dim);\n  --surface-1: var(--surface-1-dim);\n  --surface-2: var(--surface-2-dim);\n  --surface-3: var(--surface-3-dim);\n  --surface-4: var(--surface-4-dim);\n  --surface-shadow: var(--surface-shadow-dim);\n  --shadow-strength: var(--shadow-strength-dim);\n}\n\n[color-scheme=\"grape\"] {\n  color-scheme: light;\n\n  --brand: var(--brand-grape);\n  --text-1: var(--text-1-grape);\n  --text-2: var(--text-2-grape);\n  --surface-1: var(--surface-1-grape);\n  --surface-2: var(--surface-2-grape);\n  --surface-3: var(--surface-3-grape);\n  --surface-4: var(--surface-4-grape);\n  --surface-shadow: var(--surface-shadow-grape);\n  --shadow-strength: var(--shadow-strength-grape);\n}\n\n[color-scheme=\"choco\"] {\n  color-scheme: light;\n\n  --brand: var(--brand-choco);\n  --text-1: var(--text-1-choco);\n  --text-2: var(--text-2-choco);\n  --surface-1: var(--surface-1-choco);\n  --surface-2: var(--surface-2-choco);\n  --surface-3: var(--surface-3-choco);\n  --surface-4: var(--surface-4-choco);\n  --surface-shadow: var(--surface-shadow-choco);\n  --shadow-strength: var(--shadow-strength-choco);\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n}\n\nhtml {\n  height: 100%;\n  background-color: var(--gray-0);\n  background-color: var(--surface-1);\n  color: var(--gray-8);\n  color: var(--text-1);\n  accent-color: var(--orange-6);\n  accent-color: var(--brand);\n}\n\nbody {\n  min-height: 100%;\n  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;\n  padding: var(--size-6);\n  display: grid;\n  align-content: center;\n  justify-content: center;\n  place-content: center;\n  grid-gap: var(--size-6);\n  gap: var(--size-6);\n}\n\nmain {\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center;\n  align-content: center;\n  justify-content: center;\n  grid-gap: var(--size-10);\n  gap: var(--size-10);\n}\n\nsection {\n  display: grid;\n  grid-gap: var(--size-6);\n  gap: var(--size-6);\n}\n\nh1 {\n  font-weight: var(--font-weight-1);\n}\n\np {\n  max-width: var(--size-content-1);\n  font-size: var(--font-size-4);\n  line-height: var(--font-lineheight-3);\n}\n\nheader {\n  display: inline-grid;\n  grid-gap: var(--size-3);\n  gap: var(--size-3);\n}\n\nform {\n  display: flex;\n  grid-gap: var(--size-5);\n  gap: var(--size-5)\n}\n\nform > div {\n    display: inline-flex;\n    align-items: center;\n    grid-gap: var(--size-2);\n    gap: var(--size-2);\n  }\n\n.surface-samples {\n  display: grid;\n  --size: var(--size-content-1);\n  grid-template-columns: var(--size) var(--size);\n  grid-auto-rows: var(--size);\n  grid-gap: var(--size-5);\n  gap: var(--size-5)\n}\n\n@media (max-width: 480px) { .surface-samples {\n    --size: 40vw;\n  }}\n\n.surface-samples > * {\n    border-radius: var(--radius-3);\n    display: grid;\n    align-content: center;\n    justify-content: center;\n    place-content: center;\n    font-size: var(--font-size-8);\n    font-weight: var(--font-weight-2);\n  }\n\n.text-samples {\n  display: grid;\n  grid-gap: var(--size-4);\n  gap: var(--size-4)\n}\n\n.text-samples > h1 {\n    font-size: var(--font-size-6);\n    display: inline-flex;\n    align-items: center;\n    grid-gap: var(--size-3);\n    gap: var(--size-3);\n  }\n\n.brand {\n  color: var(--orange-6);\n  color: var(--brand);\n  background-color: var(--orange-6);\n  background-color: var(--brand);\n}\n\n.surface-1 {\n  background-color: var(--gray-0);\n  background-color: var(--surface-1);\n  color: var(--gray-7);\n  color: var(--text-2);\n}\n\n.surface-2 {\n  background-color: var(--gray-1);\n  background-color: var(--surface-2);\n  color: var(--gray-7);\n  color: var(--text-2);\n}\n\n.surface-3 {\n  background-color: var(--gray-2);\n  background-color: var(--surface-3);\n  color: var(--gray-8);\n  color: var(--text-1);\n}\n\n.surface-4 {\n  background-color: var(--gray-3);\n  background-color: var(--surface-4);\n  color: var(--gray-8);\n  color: var(--text-1);\n}\n\n.text-1 {\n  color: var(--gray-8);\n  color: var(--text-1)\n}\n\np.text-1 {\n    font-weight: var(--font-weight-2)\n}\n\n.text-2 {\n  color: var(--gray-7);\n  color: var(--text-2);\n}\n\n.swatch {\n  display: inline-block;\n  flex-shrink: 0;\n  width: var(--size-8);\n  height: var(--size-8);\n  border-radius: var(--radius-round)\n}\n\n.swatch.text-1 { background-color: var(--gray-8); background-color: var(--text-1); }\n\n.swatch.text-2 { background-color: var(--gray-7); background-color: var(--text-2); }\n\n.rad-shadow {\n  border: 1px solid hsl(var(--brand-hue) 10% 50% / 15%);\n  box-shadow: 0 1rem .5rem -.5rem;\n  box-shadow:\n    0 2.8px 2.2px hsl(var(--gray-8-hsl) / calc(2% + 3%)),\n    0 6.7px 5.3px hsl(var(--gray-8-hsl) / calc(2% + 1%)),\n    0 12.5px 10px hsl(var(--gray-8-hsl) / calc(2% + 2%)),\n    0 22.3px 17.9px hsl(var(--gray-8-hsl) / calc(2% + 2%)),\n    0 41.8px 33.4px hsl(var(--gray-8-hsl) / calc(2% + 3%)),\n    0 100px 80px hsl(var(--gray-8-hsl) / 2%);\n  box-shadow:\n    0 2.8px 2.2px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 3%)),\n    0 6.7px 5.3px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 1%)),\n    0 12.5px 10px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 2%)),\n    0 22.3px 17.9px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 2%)),\n    0 41.8px 33.4px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 3%)),\n    0 100px 80px hsl(var(--surface-shadow) / var(--shadow-strength))\n  ;\n}"
    },
    script: {
      language: 'javascript',
      content: "const switcher = document.querySelector('#theme-switcher');\nconst doc = document.firstElementChild;\n\nswitcher.addEventListener('input', (e) =>\nsetTheme(e.target.value));\n\nconst setTheme = (theme) =>\ndoc.setAttribute('color-scheme', theme);"
    },
  },
  {
    name: 'modulo.js',
    activeEditor: 'markup',
    markup: {
      language: 'html',
      content: "\n<template Modulo>\n  <Component name=\"HelloCount\">\n    <Template>\n      <div class=\"container\">\n        <h1>Hello, {{ state.title }}!</h1>\n        <img class=\"logo\" alt=\"logo\" src=\"https://modulojs.org/static/images/modulo_logo.svg\" />\n        <p>You clicked <span id=\"counter\">{{ state.num }}</span> times.</p>\n        <button @click:=script.countUp>Click me</button>\n      </div>\n    </Template>\n    <State\n        num:=0\n        title=\"world\"\n    ></State>\n    <Script>\n        function countUp() {\n            state.num++;\n        }\n    </Script>\n  </Component>\n</template>\n\n<script src=\"https://unpkg.com/mdu.js\"></script>\n\n<x-HelloCount></x-HelloCount>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 125px;\n}\n"
    },
  },
  {
    name: 'Reef.js',
    activeEditor: 'markup',
    markup: {
      language: 'html',
      content: "<!-- src: https://github.com/cferdinandi/reef/blob/master/demos/web-components.html -->\n\n<div id=\"app\"></div>\n\n<!-- Get the latest major version -->\n<script src=\"https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js\"></script>\n\n<script>\n  let {signal, component} = reef;\n\n  // Create a signal\n  let data = signal({\n      title: \"world\"\n  });\n\n  // Create a template\n  function template () {\n  \tlet {heading, title} = data;\n  \treturn `<div class=\"container\">\n  \t\t<h1>Hello,  ${title}!</h1>\n        <!-- <img class=\"logo\" alt=\"logo\" src=\"https://lemonadejs.net/templates/default/img/logo.svg\" /> -->\n        <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"logo\" viewBox=\"0 0 56 83\"><title></title><path fill=\"#73CFFA\" fill-rule=\"nonzero\" d=\"M5.159 46.847c-.87.147-1.676.218-2.394.208a2.716 2.716 0 00-1.938.774A2.71 2.71 0 000 49.749a2.73 2.73 0 002.693 2.764c2.181.031 4.337-.326 6.589-1.09a1.508 1.508 0 011.548.35c2.174 2.126 4.632 3.68 7.012 5.185 5.553 3.517 9.938 6.291 10.286 14.545l-.006 1.038c-.02 2.131-.064 7.063.081 10.11h5.463l-.001-.104a86.437 86.437 0 01-.078-6.825l.004-.03-.004-.098c.076-5.533 4.852-8.295 9.51-10.265 4.494-1.899 8.648-5.25 9.922-7.266.01-.01.014-.02.021-.026 1.252-1.895 2.09-4.082 2.564-6.687a2.69 2.69 0 00-.443-2.041 2.707 2.707 0 00-1.756-1.133 2.713 2.713 0 00-2.043.443 2.715 2.715 0 00-1.131 1.755c-1.127 6.224-4.793 7.889-9.432 10-.787.358-1.678.763-2.561 1.206a1.523 1.523 0 01-1.662-.199 1.519 1.519 0 01-.467-1.605c1.113-3.586 2.5-6.823 3.842-9.953 3.748-8.734 7.623-17.767 6.725-35.157a2.729 2.729 0 00-2.865-2.584c-.729.036-1.4.354-1.887.897a2.716 2.716 0 00-.697 1.969c.254 4.921.121 9.304-.404 13.396a1.523 1.523 0 01-1.133 1.276 1.526 1.526 0 01-1.604-.581c-.695-.96-1.475-1.925-2.523-3.129a2.696 2.696 0 00-1.871-.93 2.705 2.705 0 00-1.98.666 2.735 2.735 0 00-.264 3.851c3.781 4.33 6.949 9.213 4.584 15.549-.014.041-.014.041-.703 1.678l-1.578 3.739a1.519 1.519 0 01-2.85-.135c-1.972-6.355-4.658-11.178-7.256-15.837-1.495-2.683-3.044-5.457-4.408-8.492a1.54 1.54 0 01-.009-1.222c1.072-2.495 2.82-4.696 4.675-7.026 1.79-2.252 3.641-4.58 5.002-7.376l.028-.067a2.724 2.724 0 00-2.443-3.92 2.737 2.737 0 00-2.456 1.548l-.004.011c-.007.014-.012.026-.02.039-1.057 2.187-2.598 4.125-4.382 6.37l-1.267 1.608a1.53 1.53 0 01-1.53.545 1.51 1.51 0 01-1.147-1.139c-.879-3.88-1.424-8.062-1.667-12.781a2.709 2.709 0 00-.9-1.887 2.7 2.7 0 00-1.968-.697A2.7 2.7 0 009.263.9a2.711 2.711 0 00-.697 1.969c.075 1.483.183 2.959.324 4.387a1.519 1.519 0 01-1.587 1.662 13.7 13.7 0 01-3.639-.667A2.737 2.737 0 00.207 9.973a2.735 2.735 0 001.723 3.455c2.095.702 4.284 1.018 6.695.966a1.512 1.512 0 011.515 1.205c1.976 9.423 5.414 15.588 8.736 21.547 2.63 4.721 5.116 9.179 6.958 15.306a1.517 1.517 0 01-2.307 1.689 98.616 98.616 0 00-2.768-1.795c-4.359-2.762-8.127-5.148-9.616-10.262a21.265 21.265 0 01-.582-1.868 2.731 2.731 0 00-3.341-1.933 2.714 2.714 0 00-1.658 1.271 2.7 2.7 0 00-.274 2.07c.352 1.316.674 2.317 1.018 3.15.175.428.147.908-.073 1.313a1.516 1.516 0 01-1.074.76z\"></path></svg><span>Reef</span>\n  \t\t<count-up></count-up>\n      </div>`;\n  }\n\n  // Create a reactive component\n  // It automatically renders into the UI\n  component('#app', template);\n</script>\n"
    },
    style: {
      language: 'css',
      content: "body {\n  background-color: #20252E;\n  color: white;\n}\n.container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 60px;\n}\n.container span:not(#counter) {\n  font-size: 3.5em;\n  font-family: Georgia, \"Times New Roman\", Times, serif;\n  color: #73cffa;\n  left: 0.2em;\n  height: fit-content;\n  top: -30px;\n  position: relative;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "/**\n * A native web component for counting up\n */\nclass CountUp extends HTMLElement {\n  /**\n   * The class constructor object\n   */\n  constructor() {\n    // Always call super first in constructor\n    super();\n\n    // Define count property\n    this.count = 0;\n\n    // Render HTML\n    this.innerHTML = `<p>You clicked <span id=\"counter\">${this.count}</span> times.</p>\n      <button aria-live=\"polite\">Click me</button>`;\n  }\n\n  /**\n   * Handle click events\n   * @param  {Event} event The event object\n   */\n  clickHandler(event) {\n    // Get the host component\n    let host = event.target.closest(\"count-up\");\n\n    // Get the message element\n    let target = host.querySelector(\"#counter\");\n    if (!target) return;\n\n    // Increase count\n    host.count++;\n    target.textContent = `${host.count}`;\n  }\n\n  /**\n   * Runs each time the element is appended to or moved in the DOM\n   */\n  connectedCallback() {\n    // Attach a click event listener to the button\n    let btn = this.querySelector(\"button\");\n    if (!btn) return;\n    btn.addEventListener(\"click\", this.clickHandler);\n  }\n\n  /**\n   * Runs when the element is removed from the DOM\n   */\n  disconnectedCallback() {\n    // Remove the click event listener from the button\n    let btn = this.querySelector(\"button\");\n    if (!btn) return;\n    btn.removeEventListener(\"click\", this.clickHandler);\n  }\n}\n\n// Define the new web component\nif (\"customElements\" in window) {\n  customElements.define(\"count-up\", CountUp);\n}\n"
    },
  },
  {
    name: 'Arrow.JS',
    activeEditor: 'script',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://www.arrow-js.com/assets/logo-1f03ba90.png\" />\n  <div id=\"arrow-app\"></div>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 200px;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "/**\n * https://www.arrow-js.com/docs/#templates\n */\nimport { reactive, html } from 'https://esm.sh/@arrow-js/core';\n\nconst appElement = document.getElementById('arrow-app');\n\nconst data = reactive({\n  clicks: 0\n});\n\nconst template = html`\n  <p>You clicked <span id=\"counter\">${() => data.clicks}</span> times.</p>\n  <button id=\"counter-button\" @click=\"${() => data.clicks++}\">Click me</button>\n`;\n\ntemplate(appElement);\n"
    },
  },
  {
    name: 'Lemonade.JS',
    activeEditor: 'script',
    markup: {
      language: 'html',
      content: "<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://lemonadejs.net/templates/default/img/logo.svg\" />\n  <div id=\"lemonadejs-app\"></div>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 125px;\n}\n"
    },
    script: {
      language: 'javascript',
      content: "/**\n * https://lemonadejs.net/docs/getting-started\n */\nimport lemonade from 'lemonadejs';\n\nconst appElement = document.getElementById('lemonadejs-app');\n\nfunction Counter() {\n  let self = this;\n  self.count = 0;\n  self.add = function() {self.count++;}\n  return `\n    <>\n      <p>You clicked <span id=\"counter\">{{self.count}}</span> times.</p>\n      <button id=\"counter-button\" onclick=\"self.add()\">Click me</button>\n    </>\n  `;\n}\n\nlemonade.render(Counter, appElement);\n"
    },
  },
  {
    name: 'Stellar',
    activeEditor: 'markup',
    markup: {
      language: 'html',
      content: "<!-- src: https://github.com/hawkticehurst/stellar/tree/main/examples/counter -->\n\n<div class=\"container\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://raw.githubusercontent.com/hawkticehurst/stellar/main/assets/banner.png\" />\n\n<counter-button>\n  <p>You clicked <span $state=\"count\">0</span> times.</p>\n  <button id=\"counter-button\" @click=\"increment\">Click me</button>\n</counter-button>\n\n<script type=\"module\">\n  import { Stellar } from 'https://www.unpkg.com/stellar-element@0.4.0/build/index.js';\n  class CounterButton extends Stellar {\n    increment = () => this.count++;\n    decrement = () => this.count--;\n  }\n  customElements.define('counter-button', CounterButton);\n</script>\n\n\n\n<!-- TODO: ADD Obsidian.md \"playground\" handler for starters -->\n\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 200px;\n}\n"
    }
  },
  {
    name: 'Alpine.js',
    markup: {
      language: 'html',
      content: "<!-- https://dev.to/mohsenkamrani/alpinejs-simple-counter-28li -->\n<script src=\"https://unpkg.com/alpinejs\" defer></script>\n\n<div class=\"container\" x-data=\"{ count: 0 }\">\n  <h1>Hello, <span id=\"title\">World</span>!</h1>\n  <img class=\"logo\" alt=\"logo\" src=\"https://alpinejs.dev/alpine_long.svg\" />\n  <p>You clicked <span id=\"result\" x-text=\"count\"></span> times.</p>\n  <button x-on:click=\"count++\">Click me</button>\n</div>\n"
    },
    style: {
      language: 'css',
      content: ".container,\n.container button {\n  text-align: center;\n  font: 1em sans-serif;\n}\n.logo {\n  width: 200px;\n}\n"
    },
  },
  {
    name: 'SCSS',
    activeEditor: 'style',
    markup: {
      language: 'html',
      content: "\n<div class=\"content\">\n  Eu reprehenderit consectetur amet eu enim proident nisi ea reprehenderit ut enim. Ullamco consectetur excepteur labore amet qui amet labore tempor cillum amet do officia. Elit consectetur do cillum ad sit do anim. Do consequat ut sint Lorem elit et ex mollit.\n</div>\n\n\n<div class=\"footer\">\n  Eu reprehenderit consectetur amet eu enim proident nisi ea reprehenderit ut enim. Ullamco consectetur excepteur labore amet qui amet labore tempor cillum amet do officia. Elit consectetur do cillum ad sit do anim. Do consequat ut sint Lorem elit et ex mollit.\n</div>\n\n"
    },
    style: {
      language: 'scss',
      content: "$fontFamily: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n$monoFamily: 'Courier New', Courier, monospace;\nbody {\n  background-color:#000;\n  font-family: $fontFamily;\n}\n$color: #fefefe;\n.content {\n  background-color: $color;\n  padding: 1em;\n  margin-block-end: .5em;\n  border-radius: 8px;\n}\n\n$color: #939393;\n.footer {\n  background-color: $color;\n  padding: 1em;\n  border-radius: 8px;\n  font-family: $monoFamily;\n  color: white;\n}"
    },
  },
  {
    name: 'Bulma (CSS)',
    activeEditor: 'style',
    style: {
      language: 'css',
      content: "@import \"https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css\";\n\n.logo {\n  width: 200px;\n  margin-bottom: 2em;\n}"
    },
    markup: {
      language: 'html',
      content: "<section class=\"section\">\n  <div class=\"container\">\n    <img src=\"https://bulma.io/images/bulma-logo.png\" class=\"logo\" />\n    <h1 class=\"title\">Hello World</h1>\n    <p class=\"subtitle\">My first website with <strong>Bulma</strong>!</p>\n  </div>\n</section>\n"
    },
  }
]
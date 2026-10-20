import { PostLayout } from '~/layouts/post-layout'
import { Twemoji } from '~/components/ui/twemoji'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { Pre } from '~/components/mdx/pre'
import { CodeTitle } from '~/components/mdx/code-title'
import { TableWrapper } from '~/components/mdx/table-wrapper'
import { Callout } from '~/components/mdx/callout'
import { CodeBlock } from '~/components/mdx/code-block'
import { allSnippets } from '~/data/snippet-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const snippet = allSnippets.find((p) => p.slug === 'vscode-settings')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'vscode-settings')!

  const authorList = snippet.authors || ['default']
  const authorDetails = authorList.map((authorSlug) => {
    return allAuthors.find((p) => p.slug === authorSlug)!
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CodeSnippet',
    headline: snippet.title,
    datePublished: snippet.date,
    dateModified: snippet.lastmod || snippet.date,
    description: snippet.summary,
    image: snippet.images ? snippet.images[0] : '/static/images/logo.jpg',
    url: `https://www.mushfiqweb.com/snippets/${snippet.slug}`,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout content={snippet} authorDetails={authorDetails}>
        <h2 id="launching-code-from-the-command-line">
          Launching{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'code'}</code> from
          the command line
        </h2>

        <p>
          In order to launch{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'code'}</code> from
          the command line, you need to add{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'code'}</code> to your{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'PATH'}</code>{' '}
          environment variable.
        </p>

        <p>
          Open the VSCode's <strong>Command Palette</strong> (
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Cmd+Shift+P'}</code>)
          and type{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'shell command'}
          </code>{' '}
          to open the <strong>Shell Command</strong> menu:
        </p>

        <p>
          !<Link href="/static/images/install-code.png">Shell command</Link>
        </p>

        <p>
          Select{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {"Install 'code' command in PATH"}
          </code>
          .
        </p>

        <p>If you got permission denied error from your system like this:</p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {"EACCES: permission denied\nunlink '/usr/local/bin/code'"}
          </code>
        </Pre>

        <p>
          Simply run{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {"Unintall 'code' command in PATH"}
          </code>{' '}
          first, then run{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {"Install 'code' command in PATH"}
          </code>{' '}
          again. That's should fix it.
        </p>

        <p>
          Now try open a file or folder with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'code'}</code>{' '}
          command:
        </p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {'$ code ~/.bash_profile\n# or cd ./your-project && code .'}
          </code>
        </Pre>

        <p>The project/file should open in VSCode now.</p>

        <h2 id="vscode-settings">VSCode settings</h2>

        <CodeTitle lang="json" title="settings.json showLineNumbers" />
        <Pre>
          <code className="language-json">
            {
              '{\n  "editor.fontFamily": "JetBrains Mono, Monaco, \'Courier New\', monospace",\n  "prettier.useTabs": false,\n  "editor.autoIndent": "full",\n  "editor.tabSize": 2,\n  "terminal.integrated.fontSize": 15,\n  "editor.fontSize": 17,\n  "git.autofetch": true,\n  "javascript.updateImportsOnFileMove.enabled": "always",\n  "editor.wordSeparators": "`~!@#%^&*()=+[{]}\\\\|;:\'\\",.<>/?",\n  "editor.suggest.snippetsPreventQuickSuggestions": false,\n  "redhat.telemetry.enabled": false,\n  "mdx-preview.preview.useWhiteBackground": true,\n  "scss.validate": false,\n  "turboConsoleLog.logMessagePrefix": "👉 -------->",\n  "turboConsoleLog.insertEnclosingClass": false,\n  "turboConsoleLog.insertEnclosingFunction": false,\n  "turboConsoleLog.delimiterInsideMessage": "-",\n  "debug.console.fontSize": 16,\n  "markdown.preview.fontSize": 16,\n  "editor.defaultFormatter": "dbaeumer.vscode-eslint",\n  "typescript.updateImportsOnFileMove.enabled": "always",\n  "turboConsoleLog.includeFileNameAndLineNum": false,\n  "editor.inlineSuggest.enabled": true,\n  "editor.bracketPairColorization.enabled": true,\n  "editor.guides.bracketPairsHorizontal": false,\n  "[shellscript]": {\n    "editor.defaultFormatter": "foxundermoon.shell-format"\n  },\n  "[prisma]": {\n    "editor.defaultFormatter": "Prisma.prisma"\n  },\n  "[scss]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "[json]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "editor.unicodeHighlight.allowedCharacters": {\n    "️": true\n  },\n  "[jsonc]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "[typescriptreact]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "[typescript]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "editor.detectIndentation": false,\n  "editor.insertSpaces": true,\n  "editor.quickSuggestions": {\n    "strings": true\n  },\n  "turboConsoleLog.quote": "\'",\n  "git.suggestSmartCommit": false,\n  "workbench.iconTheme": "material-icon-theme",\n  "editor.fontLigatures": true,\n  "workbench.fontAliasing": "auto",\n  "editor.fontWeight": "normal",\n  "git.inputValidationSubjectLength": 100,\n  "git.inputValidationLength": 100,\n  "diffEditor.ignoreTrimWhitespace": false,\n  "tailwindCSS.classAttributes": [\n    "class",\n    "className",\n    "ngClass",\n    "headerClass",\n    "triggerClass",\n    "cls",\n    "wrapperClass",\n    "containerClassName",\n    ".*ClassName",\n    ".*Class"\n  ],\n  "tailwindCSS.experimental.classRegex": [\n    ["cva\\\\(([^)]*)\\\\)", "[\\"\'`]([^\\"\'`]*).*?[\\"\'`]"],\n    ["cx\\\\(([^)]*)\\\\)", "(?:\'|\\"|`)([^\']*)(?:\'|\\"|`)"]\n  ],\n  "github.copilot.enable": {\n    "*": false,\n    "plaintext": true,\n    "markdown": true,\n    "scminput": false,\n    "yaml": false\n  },\n  "files.associations": {\n    "*.liquid": "liquid",\n    "*.css": "tailwindcss"\n  },\n  "[liquid]": {\n    "editor.formatOnSave": false,\n    "editor.defaultFormatter": "Shopify.theme-check-vscode"\n  },\n  "files.autoSaveDelay": 100,\n  "git.confirmSync": false,\n  "tailwindCSS.includeLanguages": {\n    "plaintext": "html"\n  },\n  "editor.formatOnSave": true,\n  "[dotenv]": {\n    "editor.defaultFormatter": "foxundermoon.shell-format"\n  },\n  "[svg]": {\n    "editor.defaultFormatter": "jock.svg"\n  },\n  "workbench.preferredLightColorTheme": "Solarized Light",\n  "[properties]": {\n    "editor.defaultFormatter": "foxundermoon.shell-format"\n  },\n  "[ignore]": {\n    "editor.defaultFormatter": "foxundermoon.shell-format"\n  },\n  "window.confirmBeforeClose": "keyboardOnly",\n  "cSpell.userWords": [\n    /*...*/\n  ],\n  "cSpell.enableFiletypes": ["schema.prisma"],\n  "typescript.tsserver.log": "off",\n  "window.autoDetectColorScheme": true,\n  "[javascript]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "workbench.colorTheme": "Solarized Light",\n  "[tailwindcss]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "github.copilot.editor.enableAutoCompletions": false,\n  "github.copilot.editor.enableCodeActions": false,\n  "supermaven.otherWarning": false,\n  "git.openRepositoryInParentFolders": "never",\n  "[markdown]": {\n    "editor.defaultFormatter": "yzhang.markdown-all-in-one"\n  },\n  "editor.codeActionsOnSave": {},\n  "[mdx]": {\n    "editor.defaultFormatter": "unifiedjs.vscode-mdx"\n  },\n  "[plaintext]": {\n    "editor.defaultFormatter": "esbenp.prettier-vscode"\n  },\n  "security.workspace.trust.untrustedFiles": "open"\n}'
            }
          </code>
        </Pre>

        <h2 id="keyboard-shortcuts">Keyboard shortcuts:</h2>

        <CodeTitle lang="json" title="keybindings.json showLineNumbers" />
        <Pre>
          <code className="language-json">
            {
              '[\n\t{\n\t\t"key": "cmd+r",\n\t\t"command": "-workbench.action.reloadWindow",\n\t\t"when": "isDevelopment"\n\t},\n\t{\n\t\t"key": "cmd+k",\n\t\t"command": "workbench.action.terminal.clear",\n\t\t"when": "terminalFocus"\n\t},\n\t{\n\t\t"key": "ctrl+shift+r",\n\t\t"command": "-editor.action.refactor",\n\t\t"when": "editorHasCodeActionsProvider && editorTextFocus && !editorReadonly"\n\t},\n\t{\n\t\t"key": "cmd+r",\n\t\t"command": "editor.action.rename",\n\t\t"when": "editorHasRenameProvider && editorTextFocus && !editorReadonly"\n\t},\n\t{\n\t\t"key": "f2",\n\t\t"command": "-editor.action.rename",\n\t\t"when": "editorHasRenameProvider && editorTextFocus && !editorReadonly"\n\t},\n\t{\n\t\t"key": "shift+cmd+d",\n\t\t"command": "-workbench.view.debug",\n\t\t"when": "viewContainer.workbench.view.debug.enabled"\n\t},\n\t{\n\t\t"key": "shift+cmd+d",\n\t\t"command": "duplicate.execute"\n\t},\n\t{\n\t\t"key": "cmd+l",\n\t\t"command": "turboConsoleLog.displayLogMessage"\n\t},\n\t{\n\t\t"key": "ctrl+alt+l",\n\t\t"command": "-turboConsoleLog.displayLogMessage"\n\t},\n\t{\n\t\t"key": "cmd+j",\n\t\t"command": "-workbench.action.togglePanel"\n\t},\n\t{\n\t\t"key": "cmd+j",\n\t\t"command": "workbench.action.terminal.toggleTerminal",\n\t\t"when": "terminal.active"\n\t},\n\t{\n\t\t"key": "ctrl+`",\n\t\t"command": "-workbench.action.terminal.toggleTerminal",\n\t\t"when": "terminal.active"\n\t},\n\t{\n\t\t"key": "shift+cmd+l",\n\t\t"command": "turboConsoleLog.deleteAllLogMessages"\n\t},\n\t{\n\t\t"key": "shift+alt+d",\n\t\t"command": "-turboConsoleLog.deleteAllLogMessages"\n\t},\n\t{\n\t\t"key": "shift+cmd+g",\n\t\t"command": "workbench.view.scm",\n\t\t"when": "workbench.scm.active"\n\t},\n\t{\n\t\t"key": "ctrl+shift+g",\n\t\t"command": "-workbench.view.scm",\n\t\t"when": "workbench.scm.active"\n\t},\n\t{\n\t\t"key": "alt+p",\n\t\t"command": "git.push"\n\t},\n\t{\n\t\t"key": "shift+alt+p",\n\t\t"command": "git.pullFrom"\n\t},\n\t{\n\t\t"key": "cmd+u",\n\t\t"command": "references-view.findReferences",\n\t\t"when": "editorHasReferenceProvider"\n\t},\n\t{\n\t\t"key": "shift+alt+f12",\n\t\t"command": "-references-view.findReferences",\n\t\t"when": "editorHasReferenceProvider"\n\t},\n\t{\n\t\t"key": "cmd+u",\n\t\t"command": "-cursorUndo",\n\t\t"when": "textInputFocus"\n\t},\n\t{\n\t\t"key": "alt+tab",\n\t\t"command": "workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup",\n\t\t"when": "!activeEditorGroupEmpty"\n\t},\n\t{\n\t\t"key": "ctrl+tab",\n\t\t"command": "-workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup",\n\t\t"when": "!activeEditorGroupEmpty"\n\t},\n\t{\n\t\t"key": "alt+tab",\n\t\t"command": "workbench.action.quickOpenNavigateNextInEditorPicker",\n\t\t"when": "inEditorsPicker && inQuickOpen"\n\t},\n\t{\n\t\t"key": "ctrl+tab",\n\t\t"command": "-workbench.action.quickOpenNavigateNextInEditorPicker",\n\t\t"when": "inEditorsPicker && inQuickOpen"\n\t},\n\t{\n\t\t"key": "shift+alt+tab",\n\t\t"command": "workbench.action.quickOpenLeastRecentlyUsedEditorInGroup",\n\t\t"when": "!activeEditorGroupEmpty"\n\t},\n\t{\n\t\t"key": "ctrl+shift+tab",\n\t\t"command": "-workbench.action.quickOpenLeastRecentlyUsedEditorInGroup",\n\t\t"when": "!activeEditorGroupEmpty"\n\t},\n\t{\n\t\t"key": "shift+alt+tab",\n\t\t"command": "workbench.action.quickOpenNavigatePreviousInEditorPicker",\n\t\t"when": "inEditorsPicker && inQuickOpen"\n\t},\n\t{\n\t\t"key": "ctrl+shift+tab",\n\t\t"command": "-workbench.action.quickOpenNavigatePreviousInEditorPicker",\n\t\t"when": "inEditorsPicker && inQuickOpen"\n\t},\n\t{\n\t\t"key": "shift+cmd+,",\n\t\t"command": "workbench.action.openSettings"\n\t},\n\t{\n\t\t"key": "cmd+,",\n\t\t"command": "-workbench.action.openSettings"\n\t},\n\t{\n\t\t"key": "cmd+q",\n\t\t"command": "-workbench.action.quit"\n\t},\n\t{\n\t\t"key": "cmd+o",\n\t\t"command": "-workbench.action.files.openFile",\n\t\t"when": "false"\n\t},\n\t{\n\t\t"key": "cmd+o",\n\t\t"command": "-workbench.action.files.openFolderViaWorkspace",\n\t\t"when": "!openFolderWorkspaceSupport && workbenchState == \'workspace\'"\n\t},\n\t{\n\t\t"key": "cmd+o",\n\t\t"command": "-workbench.action.files.openFileFolder",\n\t\t"when": "isMacNative && openFolderWorkspaceSupport"\n\t},\n\t{\n\t\t"key": "cmd+o",\n\t\t"command": "-workbench.action.files.openLocalFileFolder",\n\t\t"when": "remoteFileDialogVisible"\n\t}\n]'
            }
          </code>
        </Pre>

        <p>
          Happy coding! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}

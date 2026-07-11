import Editor, { type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { getMonacoLanguage } from '../../utils/languages'

type CodeEditorProps = {
  value: string
  language: string
  onChange: (value: string) => void
}

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace',
  lineHeight: 22,
  padding: { top: 18, bottom: 18 },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  wordWrap: 'on',
  automaticLayout: true,
  tabSize: 2,
  renderLineHighlight: 'line',
}

export function CodeEditor({ value, language, onChange }: CodeEditorProps) {
  const handleMount: OnMount = (_editor, monaco) => {
    monaco.editor.defineTheme('code-analyzer-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '71717A' },
        { token: 'keyword', foreground: '93C5FD' },
        { token: 'string', foreground: '86EFAC' },
        { token: 'number', foreground: 'FBBF24' },
      ],
      colors: {
        'editor.background': '#111113',
        'editor.foreground': '#E4E4E7',
        'editorLineNumber.foreground': '#52525B',
        'editorLineNumber.activeForeground': '#D4D4D8',
        'editor.lineHighlightBackground': '#18181B',
        'editorCursor.foreground': '#3B82F6',
        'editor.selectionBackground': '#2563EB55',
        'editor.inactiveSelectionBackground': '#27272A',
      },
    })
    monaco.editor.setTheme('code-analyzer-dark')
  }

  return (
    <div className="h-[560px] overflow-hidden rounded-xl border border-zinc-800 bg-[#111113]">
      <Editor
        value={value}
        language={getMonacoLanguage(language)}
        theme="code-analyzer-dark"
        options={editorOptions}
        onMount={handleMount}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        loading={<div className="grid h-full place-items-center text-sm text-zinc-500">Loading editor...</div>}
      />
    </div>
  )
}

import Editor from '@monaco-editor/react';

type CodeEditorProps = {
  theme?: string
  language?: string
  height?: string
  defaultValue?: string
  className?: string
}

export default function CodeEditor({ theme = 'vs-dark', language = 'python', height = '90vh', defaultValue = '#Write your solution here', className }: CodeEditorProps) {
  return (
    <div className={className}>
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={defaultValue}
        theme={theme}
      />
    </div>
  )
}

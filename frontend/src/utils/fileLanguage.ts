const extensionToLanguage: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  php: 'php',
  rb: 'ruby',
}

export function getLanguageFromPath(path: string) {
  const extension = path.split('.').pop()?.toLowerCase() ?? ''
  return extensionToLanguage[extension] ?? 'plaintext'
}

import type { LanguageOption } from '../types/language'

export const languages: LanguageOption[] = [
  { label: 'JavaScript', value: 'javascript', monacoLanguage: 'javascript' },
  { label: 'TypeScript', value: 'typescript', monacoLanguage: 'typescript' },
  { label: 'Python', value: 'python', monacoLanguage: 'python' },
  { label: 'Java', value: 'java', monacoLanguage: 'java' },
  { label: 'C++', value: 'cpp', monacoLanguage: 'cpp' },
  { label: 'C#', value: 'csharp', monacoLanguage: 'csharp' },
  { label: 'Go', value: 'go', monacoLanguage: 'go' },
  { label: 'Rust', value: 'rust', monacoLanguage: 'rust' },
  { label: 'PHP', value: 'php', monacoLanguage: 'php' },
  { label: 'Ruby', value: 'ruby', monacoLanguage: 'ruby' },
]

export function getMonacoLanguage(language: string) {
  return languages.find((item) => item.value === language)?.monacoLanguage ?? 'plaintext'
}

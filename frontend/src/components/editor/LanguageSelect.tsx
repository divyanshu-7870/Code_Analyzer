import { ChevronDown } from 'lucide-react'
import { languages } from '../../utils/languages'

type LanguageSelectProps = {
  value: string
  onChange: (language: string) => void
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Language</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-lg border border-zinc-700 bg-zinc-900 py-0 pl-3 pr-9 text-sm font-medium text-zinc-100 outline-none transition hover:border-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
    </label>
  )
}
